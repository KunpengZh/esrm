import CookieManager from "react-native-cookies";
import Toast from 'react-native-root-toast';

var AppUtils = (function () {
    /**
     * Define the Server URL
     * This can be changed from the Settings function
     */
    var appServerURL = "http://120.77.170.133/"
    //var appServerURL = "http://192.168.0.100/"

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
        isAuthenticated: false
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
        appUser.isAdmin = responseJson.isAdmin;
        appUser.company = responseJson.company;
        appUser.fullname = responseJson.fullname;
        appUser.isAuthenticated = true;
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
        CookieManager.clearAll().then((cookres) => {
            return true;
        }).catch((err) => {
            console.log(err);
            showToast(err);
            return false;
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
        'workersnumber': '人员数量:',
        'workhour': '工 时:',
        'workitem': '工作内容:',
        'worklocation': '工作地点:',
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
        "requestwage": "Number"
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
                        status: false,
                        message: "好像还木有登陆",
                        data: 700
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
     * Return the object will be export from App Utils
     */
    return {
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
        getRootNavigation: getRootNavigation
    }

})()

export default AppUtils;