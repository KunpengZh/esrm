import CookieManager from "react-native-cookies";
import Toast from 'react-native-root-toast';

var AppUtils = (function () {
    /**
     * Define the Server URL
     * This can be changed from the Settings function
     */
    var appServerURL = "http://120.77.170.133/"

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
        securityTools: []
    }

    var setConfigDoc = function (key, value) {
        configDoc[key] = value;
    }
    var getConfigItem = function (key) {
        return configDoc[key];
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
        showToast: showToast
    }

})()

export default AppUtils;