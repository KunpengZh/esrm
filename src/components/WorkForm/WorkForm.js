import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import CreateWorkForm from './CreateWorkForm'
import CreateUrgentWorkForm from './CreateUrgentWorkForm'
import AppUtils from '../../Share/AppUtils'
import WorkFformList from './WorkFormList'

class WorkFormHome extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Home',
    };
    constructor(props) {
        super(props)
        this.state = {
            workFormsList: []
        }
        AppUtils.getOpenWorkForms().then((res) => {
            if (res.status) {
                for(let i=0;i<res.data.length;i++){
                    res.data[i]['key']=res.data[i]['requestId']
                }
                this.setState({ workFormsList: res.data })
            } else {
                AppUtils.showToast(res.message)
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateWorkForm')}>
                        <Image style={styles.actionLogo} source={require('../../images/icon_create.png')} />
                        <Text>新建派工</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateUrgentWorkForm')}>
                        <Image style={styles.actionLogo} source={require('../../images/icon_urgent.png')} />
                        <Text>紧急派工</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                <WorkFformList data={this.state.workFormsList} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 0
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderWidth: 1,
        //borderColor: '#C2DFFF'
        // borderColor:'#E5E4E2'
        borderColor: '#D1D0C1'
    },
    actionLogo: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginBottom: 10
    },
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

})
export default StackNavigator({
    WorkFormHome: {
        screen: WorkFormHome,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'My Work Forms',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
    CreateWorkForm: {
        screen: CreateWorkForm,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Create New WorkForm',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
    CreateUrgentWorkForm: {
        screen: CreateUrgentWorkForm,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Create Urgent WorkForm',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        })
    }
})
