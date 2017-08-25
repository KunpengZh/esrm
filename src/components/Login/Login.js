import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, KeyboardAvoidingView , Button} from 'react-native'

import LoginForm from './LoginForm'



export default class Login extends Component {
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logoImg} source={require('../../images/elpower.png')} />
                    <Image style={styles.title1} resizeMode="contain" source={require('../../images/xianxiangongdian.png')} />
                </View>
                <View style={styles.formContainer}>
                    <LoginForm navigation={this.props.navigation} isMainLogin={this.props.isMainLogin?this.props.isMainLogin:this.props.navigation.state.params.isMainLogin}/>
                </View>
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db'
        //backgroundColor: '#2980b9'
    },
    logoImg: {
        width: 100,
        height: 100,
        borderRadius:50
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logoTitle: {
        color: 'white',
         marginTop: 12,
        fontSize: 18,
        opacity: 0.8
    },
    formContainer: {
        marginBottom: 20
    },
    title1:{
        width:330,
        height:80
    }

})