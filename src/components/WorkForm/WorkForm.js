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

import CreateWorkForm from './CreateWorkForm'
import CreateUrgentWorkForm from './CreateUrgentWorkForm'
import AppUtils from '../../Share/AppUtils'
import WorkFformList from './WorkFormList'
import FullScreenLoading from '../ShareComments/FullScreenLoading';

class WorkFormHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            workFormsList: [],
            showFullScreenLoading: true
        }
        AppUtils.getOpenWorkForms().then((res) => {
            if (res.status) {
                this.setState({ workFormsList: res.data, showFullScreenLoading: false })
            } else {
                this.setState({ showFullScreenLoading: false })
                AppUtils.showToast(res.message)
            }
        })
    }
    _updateWorkFormList = (newData) => {
        let WorkFormList = this.state.workFormsList;
        for (let i = 0; i < WorkFormList.length; i++) {
            if (WorkFormList[i].requestId === newData.requestId) {
                WorkFormList[i] = newData;
                break;
            }
        }
        this.setState({ workFormsList: WorkFormList });
    }
    _onPressItem = (id) => {
        let self = this;
        let workForm = {};
        let find = false;
        for (let i = 0; i < this.state.workFormsList.length; i++) {
            if (this.state.workFormsList[i].requestId === id) {
                workForm = this.state.workFormsList[i];
                find = true;
                break;
            }
        }
        if (find) {
            this.props.navigation.navigate('OpenWorkForm', {
                workFormData: workForm,
                formModel: 'EditModel',
                updateWorkFormList: self._updateWorkFormList
            });
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
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
                    <WorkFformList data={this.state.workFormsList} onPressItem={this._onPressItem} />
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
        //backgroundColor: "#98AFC7",
        height: 35,
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
            //headerTitle: 'Create New WorkForm',
            // headerStyle: styles.headerStyle,
            //headerTitleStyle: styles.headerTitleStyle
        }),
    },
    CreateUrgentWorkForm: {
        screen: CreateUrgentWorkForm,
        navigationOptions: ({ navigation }) => ({
            // headerTitle: 'Create Urgent WorkForm',
            // headerStyle: styles.headerStyle,
            // headerTitleStyle: styles.headerTitleStyle
        })
    },
    OpenWorkForm: {
        screen: CreateWorkForm,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'WorkForm - ' + navigation.state.params.workFormData.requestId,
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
            //headerRight: <Button title="Save" onPress={() => navigation.state.params.handleSave()} />
        })
    }
}, {
        //headerMode: "none",

    })
