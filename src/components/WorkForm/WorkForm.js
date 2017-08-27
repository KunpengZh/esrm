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

    }
    componentDidMount() {
        AppUtils.isUserLoggedIn().then((isUserLoggedIn) => {
            if (isUserLoggedIn) {
                this._reLoadingWorkFormList();
            } else {
                this.setState({ showFullScreenLoading: false });
                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false, callback: this._reLoadingWorkFormList })
            }
        })
        AppUtils.setTabNavigation('WorkForm', this);
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
    _cleanWorkList = () => {
        this.setState({ workFormsList: [] });
    }
    _reLoadingWorkFormList = () => {
        this.setState({ showFullScreenLoading: true });
        AppUtils.getOpenWorkForms().then((res) => {
            if (res.status === 200) {
                this.setState({ workFormsList: res.data, showFullScreenLoading: false })
            } else if (res.status === 700) {
                this.setState({ showFullScreenLoading: false });
                AppUtils.showToast(res.message);
                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false, callback: this._reLoadingWorkFormList })
            } else {
                this.setState({ showFullScreenLoading: false })
                AppUtils.showToast(res.message)
            }
        })
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
                updateWorkFormList: self._updateWorkFormList,
                reLoadingWorkFormList: self._reLoadingWorkFormList
            });
        }
    }
    _createNewWorkForm = () => {
        let self = this;
        let data = {
            requestId: "",
            company: "",
            requester: "",
            creationtime: "",
            workitem: "",
            workCategory: "",
            worklocation: "",
            workers: [],
            workersnumber: "",
            workhour: "",
            planreturntime: "",
            returntime: "",
            workcomments: "",
            workdocument: [],
            requestStatus: "New",
            securityTools: [],
            spareParts: [],
            isSpareParts: "",
            isSecurityTools: "",
            sanPiaoZhiXing: "",
        };
        this.setState({ showFullScreenLoading: true });
        AppUtils.newWFRequestId().then((res) => {
            this.setState({ showFullScreenLoading: false });
            if (res.status === 200) {
                data.requestId = res.data.requestId;
                data.creationtime = res.data.creationtime
                data.company = AppUtils.getUserProfile().company;
                this.props.navigation.navigate('CreateWorkForm', {
                    workFormData: data,
                    formModel: 'CreateModel',
                    updateWorkFormList: self._updateWorkFormList,
                    reLoadingWorkFormList: self._reLoadingWorkFormList
                })
            } else if (res.status === 700) {
                AppUtils.showToast(res.message);
                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false })

            } else {
                AppUtils.showToast(res.message);
                return;
            }
        }).catch((err) => {
            this.setState({ showFullScreenLoading: false });
            AppUtils.showToast(err);
            return;
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                <Text style={styles.funLabel}>创建新的派工单</Text>
                <View style={styles.topContainer} >
                    <TouchableOpacity onPress={this._createNewWorkForm}>
                        <Image style={styles.actionLogo} source={require('../../images/icon_create.png')} />
                        <Text>新建派工</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._reLoadingWorkFormList}>
                        <Image style={styles.actionLogo} source={require('../../images/refresh.png')} />
                        <Text>刷新列表</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.funLabel}>您所属单位的没有完成的工单</Text>
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
    funLabel: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        marginTop: 10,
        fontSize: 12,
        color: '#848482'
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        padding: 10,
        margin: 10,
        marginTop: 0,
        marginBottom: 5,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#D1D0C1',
    },
    bottomContainer: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: '#D1D0C1',
        padding: 10,
        margin: 10,
        marginTop: 0,
        backgroundColor: "#FFF",
    },
    actionLogo: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 10
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
            headerTitle: 'Create - ' + navigation.state.params.workFormData.requestId,
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
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
