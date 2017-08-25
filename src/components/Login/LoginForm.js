import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Text, Button } from 'react-native'
import AppUtils from '../../Share/AppUtils'

import FullScreenLoading from '../ShareComments/FullScreenLoading'

export default class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showFullScreenLoading: false,
            username: '',
            password: ''
        }
    }
    doAppLogin() {
        if (this.state.username === '' || this.state.password === "") {
            AppUtils.showToast("请输入用户名和密码");
            return;
        }
        this.setState({ showFullScreenLoading: true });
        AppUtils.appLogin(this.state.username, this.state.password).then((jsonRes) => {
            this.setState({ showFullScreenLoading: false });
            if (jsonRes.isAuthenticated) {
                if(this.props.isMainLogin){
                    this.props.navigation.navigate('MainNavigate')
                }else{
                    this.props.navigation.goBack();
                }
            } else {
                AppUtils.showToast(jsonRes.message);
            }
        }).catch((err) => {
            this.setState({ showFullScreenLoading: false });
            AppUtils.showToast(jsonRes.message);
        })
    }
    render() {
        return (
            <View behavior="padding" style={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                <TextInput
                    placeholder="User Name"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    onChangeText={(username) => this.setState({ username: username })}
                    value={this.state.username}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    onChangeText={(password) => this.setState({ password: password })}
                    value={this.state.password}
                />
                <TouchableOpacity
                    //onPress={() => this.props.navigation.navigate('MainNavigate')}
                    onPress={this.doAppLogin.bind(this)}
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