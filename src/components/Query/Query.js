import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


import AppUtils from '../../Share/AppUtils'
import FullScreenLoading from '../ShareComments/FullScreenLoading';


class Query extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: <TouchableOpacity style={styles.topMenuContainer} onPress={() => params.queryByWorkForm()}>
                <FontAwesome name="list-alt" style={styles.headericon} />
                <Text style={styles.topMenuButton}>按工单汇总</Text>
            </TouchableOpacity>,
            headerLeft: <TouchableOpacity style={styles.topMenuContainer} onPress={() => params.queyryByWorker()}>
                <FontAwesome name="user-circle-o" style={styles.headericon} />
                <Text style={styles.topMenuButton}>按工作人员汇总</Text>
            </TouchableOpacity>
        };
    };
    _queyryByWorker=()=>{
        console.log("query by worker")
    }
    _queryByWorkForm=()=>{
        console.log('query by work form')
    }
    componentDidMount() {
        this.props.navigation.setParams({ 
            queryByWorkForm: this._queryByWorkForm.bind(this), 
            queyryByWorker: this._queyryByWorker.bind(this) });
    }
    render() {
        return (
            <View style={styles.container}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    topMenuButton: {
        color: "#3BB9FF",
        fontSize: 12,
        marginRight: 10
    },
    topMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
    },
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    headerStyle: {
        //backgroundColor: "#98AFC7",
        height: 35,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
    }

})
export default StackNavigator({
    QueryMain: {
        screen: Query,
        navigationOptions: ({ navigation }) => ({
            headerTitle: '',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },

}, {
        //headerMode: "none",

    })
