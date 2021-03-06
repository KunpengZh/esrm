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
import JPushModule from 'jpush-react-native';


class WorkFormHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            workFormsList: [],
            showFullScreenLoading: true
        }

    }
    setJPushAlias = () => {
        JPushModule.setAlias(AppUtils.getUserProfile().username, function (me) {
            console.log("set alias successed");
            AppUtils.clenNotifications();
            AppUtils.checkOfflineNotifications();
        }, function (err) {
            console.log("failed set alias");
            console.log(err);
        })
    }
    componentDidMount() {

        JPushModule.notifyJSDidLoad((resultCode) => {
            if (resultCode === 0) {
            }
        });
        // JPushModule.addReceiveCustomMsgListener((map) => {
        //     // console.log("addReceiveCustomMsgListener");
        // 	// console.log("extras: " + map.extras);
        // });
        JPushModule.addReceiveNotificationListener((map) => {
            // console.log("addReceiveNotificationListener");
            // console.log("alertContent: " + map.alertContent);
            // console.log("extras: " + map.extras);
            
            let extra = JSON.parse(map.extras);
            let messages = extra.messages;
            AppUtils.addPUshNotifications(messages)

        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            // console.log("addReceiveOpenNotificationListener");
            // console.log("Opening notification!");
            // console.log("map.extra: " + map.extras);
           
            this.props.navigation.navigate("Conf");
        });
        // JPushModule.addGetRegistrationIdListener((registrationId) => {
        //     console.log("addGetRegistrationIdListener");
        // 	console.log("Device register succeed, registrationId " + registrationId);
        // });
        AppUtils.isUserLoggedIn().then((isUserLoggedIn) => {
            if (isUserLoggedIn) {
                this.setJPushAlias();
                this._reLoadingWorkFormList();
            } else {
                this.setState({ showFullScreenLoading: false });
                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false, callback: this._reInitialateWorkForm })
            }
        })
        AppUtils.setTabNavigation('WorkForm', this);
    }
    _reInitialateWorkForm = () => {
        this.setJPushAlias();
        this._reLoadingWorkFormList();
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
            chargerName: "",
            chargerID: ""
        };
        this.setState({ showFullScreenLoading: true });
        AppUtils.newWFRequestId().then((res) => {
            this.setState({ showFullScreenLoading: false });
            if (res.status === 200) {
                data.requestId = res.data.requestId;
                data.creationtime = res.data.creationtime
                data.company = AppUtils.getUserProfile().company;
                data.requester = AppUtils.getUserProfile().fullname;
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
        let isAdmin = AppUtils.getUserProfile().isAdmin || AppUtils.getUserProfile().isAdminOffice || AppUtils.getUserProfile().isCompanyAdmin;
        return (
            <View style={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                <Text style={styles.funLabel}>创建新的派工单</Text>
                <View style={styles.topContainer} >
                    {isAdmin ? (
                        <TouchableOpacity onPress={this._createNewWorkForm}>
                            <Image style={styles.actionLogo} source={require('../../images/icon_create.png')} />
                            <Text>新建派工</Text>
                        </TouchableOpacity>
                    ) : (
                            <View>
                                <Image style={styles.actionLogo} source={require('../../images/icon_create1.png')} />
                                <Text>新建派工</Text>
                            </View>
                        )}
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
