import CookieManager from "react-native-cookies";
import Toast from 'react-native-root-toast';
import moment from 'moment';

var AppUtils = (function () {
    /**
     * Define the Server URL
     * This can be changed from the Settings function
     */
    var appServerURL = "http://120.77.170.133/"
    //var appServerURL = "http://192.168.0.102/"

    /**
     * Define a variable to keep the root navigation
     */

    var rootNavigation = null;

    var setRootNavigation = function (navigation) {
        rootNavigation = navigation;
    }
    var getRootNavigation = function () {
        return rootNavigation;
    }

    var getAppServerURL = function () {
        return appServerURL;
    }
    var setAppServerURL = function (url = appServerURL) {
        appServerURL = url;
    }

    /**
     * Shared Applicatin Store, used to store data and share between comments
     * e.g User Profile, Config Document.....
     */
    var appStore;

    var getFromAppStore = function (key) {
        if (!appStore) appStore = {};
        return appStore[key];
    };
    var setToAppStore = function (key, value) {
        if (!appStore) appStore = {};
        appStore[key] = value;
    }

    var appUser = {
        username: "",
        role: "",
        isAdmin: false,
        company: "",
        fullname: "",
        isAuthenticated: false,
        isAdminOffice: false,
        isCompanyAdmin: false
    }
    var getUserProfile = function () {
        return appUser;
    };
    var setUserProfile = function (user) {
        appUser = user
    }
    var setUserIteam = function (key, value) {
        appUser[key] = value;
    }

    /**
     * Application Config related documents
     */

    var configDoc = {
        companySource: [],
        companyAdmin: [],
        companyEmployee: [],
        workItem: [],
        workCategory: [],
        spareParts: [],
        securityTools: [],
        isSecurityTools: [{ name: '是' }, { name: '否' }],
        isSpareParts: [{ name: '是' }, { name: '否' }],
        sanPiaoZhiXing: [{ name: '是' }, { name: '否' }],
    }

    var setConfigDoc = function (key, value) {
        configDoc[key] = value;
    }
    var getConfigItem = function (key) {
        return configDoc[key];
    }

    var loadingConfigData = function () {
        return new Promise(function (resolve, reject) {
            fetch(appServerURL + 'esrvapi/getallconfigdoc')
                .then((response) => response.json()).then((jsonRes) => {
                    if (jsonRes.hasOwnProperty('err')) {
                        resolve({
                            status: 700,
                            message: "好像还木有登陆",
                            data: null
                        })
                    }
                    for (let i = 0; i < jsonRes.length; i++) {
                        let category = jsonRes[i].category;
                        configDoc[category] = jsonRes[i].data;
                    }
                    resolve({ status: 200, message: '' });
                }).catch((error) => {
                    console.error(error);
                    reslove({ status: 500, message: "Unable to load config data from Server" })
                });
        })
    }

    /**
     * Applicatino Login related functions
     * Login
     * Logout
     * CacheLocal
     * Read from Local Cache
     */

    var _updateUserProfile = function (responseJson) {
        appUser.username = responseJson.username;
        appUser.role = responseJson.role;
        appUser.company = responseJson.company;
        appUser.fullname = responseJson.fullname;
        appUser.isAuthenticated = true;
        appUser.isAdmin = responseJson.role === "Admin" ? true : false;
        appUser.isAdminOffice = responseJson.role === "AdminOffice" ? true : false;
        appUser.isCompanyAdmin = responseJson.role === "CompanyAdmin" ? true : false;
    }

    var AppLogin = function (username, password) {
        return new Promise(function (reslove, rej) {
            if (!username || !password || username === "" || password === "") throw "UserName and Password is mandatory required";
            fetch(appServerURL + 'login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'esrm.xianxian.com'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.isAuthenticated) {
                    _updateUserProfile(responseJson);
                    reslove({ isAuthenticated: true, message: '' });
                } else {
                    reslove({ isAuthenticated: false, message: responseJson.message });
                }
            }).catch((error) => {
                console.error(error);
                reslove({ isAuthenticated: false, message: "Unable to connect with Server" })
            });
        })
    }

    var isUserLoggedIn = function () {
        return new Promise(function (reslove, rej) {
            if (appUser.isAuthenticated) {
                reslove(true);
            } else {
                fetch(appServerURL + 'login/isAuthenticated')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.isAuthenticated) {
                            _updateUserProfile(responseJson);
                            reslove(true);
                        } else {
                            reslove(false);
                        }
                    }).catch((error) => {
                        console.error(error);
                        showToast(error);
                        reslove(false);
                    });
            }
        })

    }

    var AppForceLogout = function () {
        return new Promise(function (resolve, reject) {
            CookieManager.clearAll().then((cookres) => {
                resolve({ status: 200, message: '', data: '' });
            }).catch((err) => {
                resolve({ status: 500, message: err, data: '' });
            })
        })

    }

    /**
     * To show a toast
     */

    var showToast = function (message, duration = "SHORT", position = Toast.positions.BOTTOM) {

        let durationDuration = Toast.durations.SHORT;
        switch (duration.toUpperCase()) {
            case 'LONG':
                durationDuration = Toast.durations.LONG;
                break;
            case 'SHORT':
                durationDuration = Toast.durations.LONG;
                break;
        }

        let toast = Toast.show(message, {
            duration: durationDuration,
            position: position,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            // onShow: () => {
            //     // calls on toast\`s appear animation start
            // },
            // onShown: () => {
            //     // calls on toast\`s appear animation end.
            // },
            // onHide: () => {
            //     // calls on toast\`s hide animation start.
            // },
            // onHidden: () => {
            //     // calls on toast\`s hide animation end.
            // }
        });
    }

    var getOpenWorkForms = function () {
        return new Promise(function (resolve, reject) {
            if (appUser.isAuthenticated) {
                fetch(appServerURL + 'workformapi/getr').then((response) => response.json()).then((responseJson) => {
                    if (responseJson.hasOwnProperty('err')) {
                        resolve({
                            status: 700,
                            message: "好像还木有登陆",
                            data: null
                        })
                    }
                    resolve({ status: 200, message: '', data: responseJson })
                }).catch((err) => {
                    console.log(err);
                    resolve({ status: 500, message: "Network request failed", data: [] })
                })
            } else {
                resolve({
                    status: 700,
                    message: "好像还木有登陆",
                    data: null
                })
            }

        })
    }

    const WorkFormLabel = {
        'company': "派工单位:",
        'requestId': '派工单号:',
        'creationtime': '派工时间:',
        'isSecurityTools': '领取安全工具:',
        'isSpareParts': '领取备品备件:',
        'planreturntime': '计划返回时间:',
        'requestStatus': '工单状态:',
        'requester': '派工人员:',
        'returntime': '实际返回时间:',
        'sanPiaoZhiXing': '三票执行:',
        'securityTools': '安全工具:',
        'spareParts': '备品备件:',
        'workCategory': '工作类别:',
        'workcomments': '工作备注:',
        'workdocument': '工作图片:',
        'workers': '工作人员:',
        'worker': '工作人员:',
        'workersnumber': '人员数量:',
        'workhour': '工 时:',
        'workitem': '工作内容:',
        'worklocation': '工作地点:',
        'requestwage': '总工额',
        'perhourwage': '单位工额',
        'chargerID': "负责人ID:",
        'chargerName': "负责人:"
    }

    const workformDataModel = {
        "requestId": "String",
        "company": "String",
        "requester": "String",
        "creationtime": "String",
        "workitem": "String",
        "workCategory": "String",
        "worklocation": "String",
        "workers": "Mixed",
        "workersnumber": "String",
        "workhour": "Number",
        "planreturntime": "String",
        "returntime": "String",
        "workcomments": "String",
        "workdocument": "Mixed",
        "requestStatus": "String",
        "isSecurityTools": "String",
        "securityTools": "Mixed",
        "isSpareParts": "String",
        "spareParts": "Mixed",
        "sanPiaoZhiXing": "String",
        "perhourwage": "Number",
        "requestwage": "Number",
        "chargerName": "String",
        "chargerID": "String"
    }

    /**
     * Save and Update exist Workform
     */

    var updateWorkForm = function (workFormData) {
        return new Promise(function (resolve, reject) {
            fetch(appServerURL + 'workformapi/save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'esrm.xianxian.com'
                },
                body: JSON.stringify({
                    data: workFormData
                })
            }).then((response) => response.json()).then((res) => {

                if (res.hasOwnProperty('err')) {
                    resolve({
                        status: 700,
                        message: "好像还木有登陆",
                        data: null
                    })
                }

                if (res.requestId) {
                    resolve({ "message": "保存成功", status: 200, data: res });
                } else {
                    resolve({ "message": res.message, status: 500, data: '' });

                }
            }).catch((err) => {
                showToast(err);
                throw err;
            })
        })
    }

    /**
     * Functions to upload image
     */

    var imageUpload = function (fileUrl, fileName, requestId, imgDescription) {
        return new Promise(function (resolve, reject) {
            let data = new FormData();
            data.append('file', {
                uri: fileUrl,
                name: fileName,
                type: 'image/jpeg'
            });
            data.append('requestId', String(requestId));
            data.append('description', String(imgDescription));

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'esrm.xianxian.com'
                },
                body: data
            };

            fetch(appServerURL + 'workformapi/upload', fetchOptions).then((response) => response.json()).then((res) => {

                if (res.hasOwnProperty('err')) {
                    resolve({
                        status: 700,
                        message: "好像还木有登陆",
                        data: null
                    })
                }

                if (res && res.length > 0) {
                    res = res[0];
                    resolve({
                        status: 200,
                        message: '上传成功',
                        data: res
                    })

                } else {
                    resolve({
                        status: 500,
                        message: res.message,
                        data: null
                    })
                }
            }).catch((err) => {
                showToast(err);
                throw err;
            })
        })
    }

    /**
     * Functions go get a new Request ID when create new Request
     */

    var newWFRequestId = function () {
        return new Promise(function (resolve, reject) {
            fetch(appServerURL + 'workformapi/requestid').then((response) => response.json()).then((res) => {

                if (res.hasOwnProperty('err')) {
                    resolve({
                        status: 700,
                        message: "好像还木有登陆",
                        data: ''
                    })
                }

                if (!res.requestId || !res.strtime) {
                    resolve({
                        status: 500,
                        message: "未能从服务器取得派工单编号",
                        data: ''
                    })
                } else {
                    resolve({
                        status: 200,
                        message: "",
                        data: {
                            requestId: res.requestId,
                            creationtime: res.strtime
                        }
                    })
                }
            }).catch((err) => {
                showToast(err);
                resolve({
                    status: 500,
                    message: "未能从服务器取得派工单编号",
                    data: ''
                })
            })
        })
    }

    /**
     * Query base on provided criteria
     */
    var queryByWorkForm = function (criteria) {
        return new Promise(function (resolve, reject) {
            let url = 'queryWorkForm/workform';
            queryWorkForm(criteria, url).then((res) => {
                workFormQueryResult = res;
                resolve(res);
            });
        })
    }
    var queryByWorkHistory = function (criteria) {
        return new Promise(function (resolve, reject) {
            let url = 'queryWorkForm/worker';
            queryWorkForm(criteria, url).then((res) => {
                workerWorkerQueryResult = res;
                resolve(res);
            });
        })

    }

    var queryWorkForm = function (criteria, url) {
        return new Promise(function (resolve, reject) {
            var self = this;
            fetch(appServerURL + url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'esrm.xianxian.com'
                },
                body: JSON.stringify({
                    data: criteria
                })
            }).then((response) => response.json()).then((res) => {

                if (res.hasOwnProperty('err')) {
                    resolve({
                        status: 700,
                        message: "好像还木有登陆",
                        data: ''
                    })
                }
                resolve({
                    status: 200,
                    message: '',
                    data: res
                })
            }).catch(function (err) {
                console.log(err);
                resolve({
                    status: 500,
                    message: err,
                    data: ''
                })
            })
        })
    }

    var workFormQueryResult = [];
    var workerWorkerQueryResult = [];

    var getWorkFormQueryResult = function () {
        return workFormQueryResult;
    }
    var getWorkerWorkFormQueryResult = function () {
        return workerWorkerQueryResult;
    }

    /**
     * ArrayToString
     */

    var ArrayToString = function (arr) {
        if (!(arr instanceof Array)) {
            return arr;
        }
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            if (str === '') {
                str = arr[i];
            } else {
                str += ' , ' + arr[i];
            }
        }
        return str;
    }

    /**
     * Variables to keep the Workform and Query navigator
     */
    var tabNavigations = {
        WorkForm: null,
        Query: null,
        Conf: null
    }
    var setTabNavigation = function (key, obj) {
        tabNavigations[key] = obj;
    }
    var getTabNavigation = function (key) {
        return tabNavigations[key]
    }

    /**
     * The functions to compare 2 date
     */
    var compareDate = function (date1, date2) {
        let daveValue1 = moment(date1).valueOf();
        let dateValue2 = moment(date2).valueOf();
        console.log(daveValue1);
        console.log(dateValue2);
        if (dateValue2 <= daveValue1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Functions to templaory store push notifications from Server
     */
    var pushNotifications = [];
    var getPushNotifications = function () {
        return pushNotifications;
    }
    var addPUshNotifications = function (message) {
        let timeLabel = moment().format("YYYY-MM-DD HH:mm");
        pushNotifications.push({
            timeLabel: timeLabel,
            data: message
        });
    }
    var clenNotifications = function () {
        pushNotifications = [];
    }

    /**
     * Functions to trigger offline message notifications
     */

    var checkOfflineNotifications = function () {
        fetch(appServerURL + 'login/notifications')
            .then((response) => response.json()).then((jsonRes) => {
                console.log(jsonRes);
            }).catch((err) => {
                showToast(err);
            })
    }

    /**
     * functions to make sure the seleted charge person have a id
     */

    var validateChargePerson = (condition) => {
        return new Promise(function (resolve, reject) {
            fetch(appServerURL + "esrvapi/queryuser", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'esrm.xianxian.com'
                },
                body: JSON.stringify({
                    condition: condition
                })
            }).then((response) => response.json()).then((res) => {

                resolve(res)
            }).catch((err) => {

                console.log(err);
                resolve({
                    status: 500,
                    message: err,
                    data: ''
                })
            })
        })
    }

    /**
     * Return the object will be export from App Utils
     */
    return {
        validateChargePerson: validateChargePerson,
        clenNotifications: clenNotifications,
        checkOfflineNotifications: checkOfflineNotifications,
        getPushNotifications: getPushNotifications,
        addPUshNotifications: addPUshNotifications,
        compareDate: compareDate,
        getTabNavigation: getTabNavigation,
        setTabNavigation: setTabNavigation,
        getFromAppStore: getFromAppStore,
        setToAppStore: setToAppStore,
        getUserProfile: getUserProfile,
        setUserProfile: setUserProfile,
        setUserIteam: setUserIteam,
        setConfigDoc: setConfigDoc,
        getConfigItem: getConfigItem,
        getAppServerURL: getAppServerURL,
        setAppServerURL: setAppServerURL,
        appLogin: AppLogin,
        AppForceLogout: AppForceLogout,
        isUserLoggedIn: isUserLoggedIn,
        showToast: showToast,
        getOpenWorkForms: getOpenWorkForms,
        loadingConfigData: loadingConfigData,
        WorkFormLabel: WorkFormLabel,
        updateWorkForm: updateWorkForm,
        workformDataModel: workformDataModel,
        imageUpload: imageUpload,
        newWFRequestId: newWFRequestId,
        setRootNavigation: setRootNavigation,
        getRootNavigation: getRootNavigation,
        getWorkFormQueryResult: getWorkFormQueryResult,
        getWorkerWorkFormQueryResult: getWorkerWorkFormQueryResult,
        queryByWorkHistory: queryByWorkHistory,
        queryByWorkForm: queryByWorkForm,
        ArrayToString: ArrayToString
    }

})()

export default AppUtils;