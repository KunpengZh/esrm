import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Text, Button } from 'react-native'
import AppUtils from '../../Share/AppUtils'


export default class LoginForm extends Component {
    getUser() {
        
        AppUtils.isUserLoggedIn()

    }
    doAppLogin() {
        console.log("function to do login")
        AppUtils.appLogin('sundameinv', "zaq12wsx")
    }
    render() {
        return (
            <View behavior="padding" style={styles.container}>
                <Button onPress={this.getUser} title="Login" />
                <TextInput
                    placeholder="User Name"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    underlineColorAndroid='transparent'
                    style={styles.textInput}

                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                />
                <TouchableOpacity
                    //onPress={() => this.props.navigation.navigate('MainNavigate')}
                    onPress={this.doAppLogin}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>登陆</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    textInput: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
         marginBottom: 20,
        color: '#FFF',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#e67e22',
        paddingVertical: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    }

})