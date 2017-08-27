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
import MainNavigate from '../MainNavigate/MainNavigate'

export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
        AppUtils.setRootNavigation(this.props.navigation);
    }
    hideLoading() {
        this.setState({ modalVisible: false });
    }
    render() {
        return (
            <View style={styles.rootView}>
                <MainNavigate />
                <Modal transparent={true} onRequestClose={() => this.onRequestClose()} visible={this.state.modalVisible}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator styleAttr='Inverse' color='#FF4500' />
                    </View>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    rootView:{
        flex:1
    },
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }
});
