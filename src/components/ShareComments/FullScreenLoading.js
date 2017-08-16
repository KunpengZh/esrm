import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    Modal,
    StyleSheet
} from 'react-native';

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.showLoading
        };
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
