import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ConfigView extends React.Component {

    doDataCleaning = () => {
        if (AppUtils.getTabNavigation('Query') !== null) {
            AppUtils.getTabNavigation('Query').updateUserCompany();
        }
        if (AppUtils.getTabNavigation('WorkForm') !== null) {
            AppUtils.getTabNavigation('WorkForm')._cleanWorkList();
        }
    }
    doLogout = () => {
        let self = this;
        AppUtils.AppForceLogout().then((res) => {
            if (res.status === 200) {

                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false, callback: this.doDataCleaning })
            } else {
                AppUtils.showToast(res.message);
            }
        })

    }
    render() {
        return (
            <View>

                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="user" style={styles.labelicon} />
                        <TouchableOpacity style={styles.touchableArea} onPress={this.doLogout.bind(this)}>
                            <Text style={styles.contentText}>换个用户登陆</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
    },
    contentText: {
        flex: 1,
        fontSize: 12,
    },
    labelicon: {
        fontSize: 16,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },

    touchableArea: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    container: {
        //flex: 1,
        padding: 20,
        margin: 20,
        backgroundColor: "#FFF",
    },
})

