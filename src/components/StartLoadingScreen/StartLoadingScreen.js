import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Modal,
    StyleSheet,
    Button
} from 'react-native';

import AppUtils from '../../Share/AppUtils'

export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
        };
        AppUtils.setRootNavigation(this.props.navigation);
        AppUtils.isUserLoggedIn().then((isUserLoggedIn) => {
            this.hideLoading();
            if (isUserLoggedIn) {
                this.props.navigation.navigate('MainNavigate')
            } else {
                this.props.navigation.navigate('Login', {isMainLogin:true})
            }
        }).catch((err) => {
            this.hideLoading()
        })
    }
    hideLoading() {
        this.setState({ modalVisible: false });
    }
    render() {
        return (
            <Modal transparent={true} onRequestClose={() => this.onRequestClose()} visible={this.state.modalVisible}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator styleAttr='Inverse' color='#FF4500' />
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }
});
