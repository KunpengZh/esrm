import React from 'react';
import {
    Text,
    View,
    Button
} from 'react-native';
import AppUtils from '../../Share/AppUtils'
export default class RecentChatsScreen extends React.Component {
    doLogout(){
        AppUtils.AppForceLogout();
    }
    render() {
        return (
            <View>
                <Button title="logout" onPress={this.doLogout.bind(this)} />
            </View>
        )
    }
}

