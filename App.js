import React from 'react';
import Main from './components/MainComponent';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}