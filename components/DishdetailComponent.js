import React, { Component } from 'react';
import {
    Text, View, ScrollView, FlatList, Modal, StyleSheet,
    Button, Alert, PanResponder, Share
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;

    function recognizeDrag({ moveX, moveY, dx, dy }) {
        if (dx < -200)
            return 'Favorite';
        else if (dx > 200)
            return 'AddComment';
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },


        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState) == 'Favorite')
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );
            //Assigment 3: Task 3
            else if (recognizeDrag(gestureState) == 'AddComment') {
                props.onCommentPress();
            }


            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        })
    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View>
                            <Icon
                                raised
                                reverse
                                name={props.favorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                        </View>
                        {/*Assigmente 1: Task 1*/}
                        <View>
                            <Icon
                                raised
                                reverse
                                name={'pencil'}
                                type='font-awesome'
                                color='blue'
                                onPress={() => props.onCommentPress()}
                            />
                        </View>
                        <View>
                            <Icon
                                raised
                                reverse
                                name='share'
                                type='font-awesome'
                                color='#51D2A8'
                                onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                        </View>
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 1,
            author: null,
            comment: null
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(dishId) {
        console.log(JSON.stringify(this.state));
        console.log(dishId);
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 1,
            author: null,
            comment: null
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onCommentPress={() => this.toggleModal()} />

                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                {/*Assigment 2: Task 1 */}
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={{ padding: 10 }}>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={60}
                            showRating
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                            style={{ marginBottom: 20 }}
                        />
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="    Name"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                onChangeText={value => this.setState({ author: value })}
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="  Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                onChangeText={value => this.setState({ comment: value })}
                                style={{ marginBottom: 20 }}
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Button
                                onPress={() => { this.handleComment(dishId); this.resetForm() }}
                                color="#512DA8"
                                title="Submit"
                                style={{ marginBottom: 20 }}
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Button
                                onPress={() => { this.resetForm() }}
                                color="grey"
                                title="Close"
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView >
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);