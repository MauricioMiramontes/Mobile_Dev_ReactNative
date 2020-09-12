import React from 'react';
import Main from './components/MainComponent';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);


export default class App extends React.Component {
  render() {
    return (
      <Main />
    );
  }
}