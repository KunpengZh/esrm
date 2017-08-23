import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';

import Login from './src/components/Login/Login'
import MainNavigate from './src/components/MainNavigate/MainNavigate'
import StartLoading from './src/components/StartLoadingScreen/StartLoadingScreen'


const esrm = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      //headerTitle: "",
    }
  },
  MainNavigate: {
    screen: MainNavigate,
    navigationOptions: {
      //headerTitle: '',
    }
  },
  StartLoading: {
    screen: StartLoading
  }
}, {
    initialRouteName: "StartLoading",
    headerMode: "none"
    //moe:"modal"
  });

AppRegistry.registerComponent('esrm', () => esrm);

const styles = StyleSheet.create({
  activeicon: {
    fontSize: 22,
    color: "#157DEC"
    //color:"#1589FF"
  },
  deactiveicon: {
    fontSize: 22,
    color: "gray"
  },
});


