import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal
} from 'react-native';
import AppUtils from '../../Share/AppUtils'
const { width, height } = Dimensions.get('window')
import loadingImage from '../../images/loading/2.gif'
class LoadingView extends Component {
    constructor() {
        super();
        AppUtils.isUserLoggedIn().then((isUserLoggedIn) => {
            if (isUserLoggedIn) {
                this.props.navigation.navigate('MainNavigate')
            } else {
                this.props.navigation.navigate('Login')
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    _close() {
        console.log("onRequestClose ---- ")
    }
    render() {
        return (
            <Modal onRequestClose={() => this._close()} visible={true} transparent>
                <View style={[styles.loadingView, { opacity: 0.3, backgroundColor: 'gray' }]}></View>
                <View style={styles.loadingImageView}>
                    <View style={styles.loadingImage}>
                        {
                            this.props.loadingViewClick ?
                                <TouchableOpacity onPress={this.props.loadingViewClick}>
                                    <Image style={styles.loadingImage} source={loadingImage} />
                                </TouchableOpacity>
                                :
                                <Image style={styles.loadingImage} source={loadingImage} />
                        }
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute'
    },
    loadingImage: {
        width: 150,
        height: 100,
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
// LoadingView.propTypes = {
//     loadingViewClick: React.PropTypes.func, //.isRequired,
//     showLoading: React.PropTypes.bool, //.isRequired,
//     opacity: React.PropTypes.number,
//     backgroundColor: React.PropTypes.string
// }


export default LoadingView


