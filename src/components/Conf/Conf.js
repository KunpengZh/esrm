import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ShowPushNotifications from './ShowPushNotifications';

class ConfigView extends React.Component {
    doDataCleaning = () => {
        if (AppUtils.getTabNavigation('Query') !== null) {
            AppUtils.getTabNavigation('Query').updateUserCompany();
        }
        if (AppUtils.getTabNavigation('WorkForm') !== null) {
            AppUtils.getTabNavigation('WorkForm')._cleanWorkList();
            AppUtils.getTabNavigation('WorkForm').setJPushAlias();
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
    componentWillReceiveProps(newProps) {
        
    }
    showNotifications = () => {
        this.props.navigation.navigate('ShowPushNotifications', {
            data: AppUtils.getPushNotifications()
        })
    }
    render() {
        
        return (
            <View>
                <Text style={styles.funLabel}>退出当前用户登陆</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="user" style={styles.labelicon} />
                        <TouchableOpacity style={styles.touchableArea} onPress={this.doLogout.bind(this)}>
                            <Text style={styles.contentText}>换个用户登陆</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.funLabel}>查看系统收到的派工消息</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="id-card" style={styles.labelicon} />
                        <TouchableOpacity style={styles.touchableArea} onPress={this.showNotifications.bind(this)}>
                            <Text style={styles.contentText}>系统收到的信息</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
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
    funLabel: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        marginTop: 10,
        fontSize: 12,
        color: '#848482'
    },
    container: {
        //flex: 1,
        padding: 20,
        margin: 20,
        marginTop: 0,
        backgroundColor: "#FFF",
    },
    icon: {
        width: 24,
        height: 24,
    },
    headerStyle: {
        //backgroundColor: "#98AFC7",
        height: 40,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
    }
})

export default StackNavigator({
    ConfigView: {
        screen: ConfigView,
        navigationOptions: ({ navigation }) => ({
            headerTitle: '系统配置',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
    ShowPushNotifications: {
        screen: ShowPushNotifications,
        navigationOptions: ({ navigation }) => ({
            headerTitle: '系统消息',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
        }),
    }
}, {
        //headerMode: "none",

    })

