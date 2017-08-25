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
        //AppUtils.getRootNavigation().navigate('Login');
    }
    doLoadingConfig(){
        AppUtils.loadingConfigData().then((res)=>{
            console.log(res);
        }).catch(function(err){
            console.log("the error function");
            console.log(err);
        })
    }
    render() {
        return (
            <View>
                <Button title="logout" onPress={this.doLogout.bind(this)} />
                <Button title="LoadConfig" onPress={this.doLoadingConfig.bind(this)} />
            </View>
        )
    }
}

