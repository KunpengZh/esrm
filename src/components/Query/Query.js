
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native';

import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

class MyHomeScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Home',
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        );
    }
}

class MyNotificationsScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
    headerStyle: {
        backgroundColor: "#98AFC7",
        height: 30,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
    }
});

export default StackNavigator({
    Home: {
        screen: MyHomeScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'MyHomeScreen',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
    Notifications: {
        screen: MyNotificationsScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Notifictainos',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
}, {
        drawerPosition: "left",
        drawerWidth: 10
    })