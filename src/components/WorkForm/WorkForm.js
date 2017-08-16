import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
                <FontAwesome name="address-book" size={20} color="#4F8EF7" />
                <Button title="logout" onPress={this.doLogout} />
            </View>
        )
    }
}
  

