//Assigment 1: Task 1
import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static navigationOptions = {
        title: 'Contact Us',
    };

    render() {

        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    title='Contact Information'>
                    <Text
                        style={{ margin: 10 }}>
                        121, Clear Water Bay Road{'\n'}{'\n'}
                    Clear Water Bay, Kowloon{'\n'}{'\n'}
                    HONG KONG{'\n'}{'\n'}
                    Tel: +852 1234 5678{'\n'}{'\n'}
                    Fax: +852 8765 4321{'\n'}{'\n'}
                    Email:confusion@food.net{'\n'}{'\n'}
                    </Text>
                </Card>
            </Animatable.View>
        );
    }
}

export default Contact;