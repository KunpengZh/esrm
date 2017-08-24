import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import ItemSelection from './ItemSelection'
import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FullScreenLoading from '../ShareComments/FullScreenLoading';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import WorkFormImageView from './WorkFormImageView'



const WorkFormRenderItems = ['requestId', 'company', 'requester', 'creationtime', 'workers', 'workhour', 'planreturntime', 'workCategory'
    , 'workitem', 'workersnumber', 'isSecurityTools', 'isSpareParts', 'sanPiaoZhiXing', 'securityTools', 'spareParts', 'worklocation', 'returntime', 'workcomments'];

const EditModel = {
    'adminSelectable': [],
    'editable': ['worklocation', 'workcomments'],
    'selectable': [],
    'numberonly': ['workhour'],
    'dateTime': ['returntime']
};
const CreateModel = {
    'adminSelectable': ['company', 'requester'],
    'editable': ['worklocation', 'workcomments'],
    'selectable': ['workCategory', 'workitem', 'isSecurityTools', 'isSpareParts', 'sanPiaoZhiXing', 'securityTools', 'spareParts', 'workers'],
    'numberonly': ['workhour'],
    'dateTime': ['planreturntime', 'returntime']
};



class WorkFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data.data ? props.data.data : '',
        }
    }
    _onPress = () => {
        this.props.onPressItem(this.props.data.category)
    }
    _updateValue = (newValue) => {
        this.setState({ value: newValue });
        this.props.updateFormModel(this.props.data.category, newValue);
    }
    _validateOnlyNumber(text) {
        let numbers = '0123456789.';
        let validate = true;
        for (var i = 0; i < text.length && validate; i++) {
            if (numbers.indexOf(text[i]) < 0) {
                AppUtils.showToast("工作数量只能输入数值");
                validate = false;
                break;
            }
        }
        return validate;
    }
    _updateNumberValue = (newValue) => {
        if (this._validateOnlyNumber(newValue)) {
            this.setState({ value: newValue });
            this.props.updateFormModel(this.props.data.category, newValue);
        } else {
            if (!this._validateOnlyNumber(this.state.value)) {
                this.setState({ value: '' });
                this.props.updateFormModel(this.props.data.category, '');
            }
        }

    }
    _showDateTimePicker = () => {
        this.props.showDateTimePicker(this.props.data.category)
    }
    render() {

        let curModel = EditModel;
        if (this.props.formModel === "EditModel") {
            curModel = EditModel;
        } else if (this.props.formModel === "CreateModel") {
            curModel = CreateModel;
        }

        if (curModel.editable.indexOf(this.props.data.category) >= 0) {

            return (
                <View style={styles.row} >
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.textInput}
                        onChangeText={(text) => this._updateValue(text)}
                        value={this.state.value + ''}
                    />
                </View>
            )
        } else if (curModel.numberonly.indexOf(this.props.data.category) >= 0) {
            return (
                <View style={styles.row} >
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        style={styles.textInput}
                        onChangeText={(text) => this._updateNumberValue(text)}
                        value={this.state.value + ''}
                    />
                </View>
            )
        } else if (curModel.adminSelectable.indexOf(this.props.data.category) >= 0) {

            return (
                <TouchableOpacity style={styles.row} onPress={this._onPress} >
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                </TouchableOpacity>
            )
        } else if (curModel.selectable.indexOf(this.props.data.category) >= 0) {

            return (
                <TouchableOpacity style={styles.row} onPress={this._onPress} >
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                </TouchableOpacity>
            )
        } else if (curModel.dateTime.indexOf(this.props.data.category) >= 0) {
            return (
                <TouchableOpacity style={styles.row} onPress={this._showDateTimePicker}>
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View style={styles.row} >
                    <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                    <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                </View>
            )
        };

    }
}

class CreateWorkForm extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: <TouchableOpacity onPress={() => params.handleSave()}>
                <FontAwesome name="save" style={styles.headericon} />
            </TouchableOpacity>,
            headerLeft: <TouchableOpacity onPress={() => params.goBack()}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    constructor(props) {
        super(props);
        this.state = this.props.navigation.state.params.workFormData;
        this.formModel = this.props.navigation.state.params.formModel;
        this.updatedFormModel = {};
        this.state.showFullScreenLoading = false;
        this.state.isDateTimePickerVisible = false;
        this.selectedItem = null;
    }
    _onPress = (category) => {
       
        //['workCategory', 'workitem', 'isSecurityTools', 'isSpareParts', 'sanPiaoZhiXing', 'securityTools', 'spareParts', 'workers'],
        let filterValue = '';
        let filterFieldName = '';
        let filterable = false;
        let multiable=false;

        if (category === 'requester') {
            if(this.state.company === ""){
                AppUtils.showToast("请先选择工作单位");
                return;
            }else{
                filterValue = this.state.company;
                filterFieldName = 'attr';
                filterable = true;
            }
        } 

        if (category === 'workers') {
            if(this.state.company === ""){
                AppUtils.showToast("请先选择工作单位");
                return;
            }else{
                filterValue = this.state.company;
                filterFieldName = 'attr';
                filterable = true;
                multiable=true;
            }
        } 

        if (category === 'workitem') {
            if(this.state.workCategory === ""){
                AppUtils.showToast("请先选择工作类别");
                return;
            }else{
                filterValue = this.state.workCategory;
                filterFieldName = 'workCategory';
                filterable = true;
            }
        } 
    
        if (category === 'securityTools' && (this.state.isSecurityTools === "" || this.state.isSecurityTools === "否")) {
            AppUtils.showToast("请先选择需要安全工具");
            return;
        }
        if (category === 'spareParts' && (this.state.isSpareParts === "" || this.state.isSpareParts === "否")) {
            AppUtils.showToast("请先选择需要备品备件");
            return;
        }
       
        this.props.navigation.navigate('ItemSelection', {
            'itemName': category,
            'onSelect': this.onSelect,
            'multiable': multiable,
            'filterable': filterable,
            'filter': {
                'filterValue': filterValue,
                'filterFieldName': filterFieldName
            }
        })
    }
    onSelect = (data) => {
        let nObj = {};
        if (data.category === 'workCategory' && data.value != this.state.workCategory) {
            nObj.workitem = '';
        }
        if (data.category === 'isSecurityTools' && data.value != this.state.isSecurityTools) {
            nObj.securityTools = '';
        }
        if (data.category === 'isSpareParts' && data.value != this.state.isSpareParts) {
            nObj.spareParts = '';
        }

        if (data.category === 'company' && data.value != this.state.company) {
            nObj.requester = '';
            nObj.workers = [];
        }

        nObj[data.category] = data.value;
        this.setState(nObj);
    }
    _updateFormModel = (key, value) => {
        this.updatedFormModel[key] = value;
    }
    _saveWorkForm() {
        if (JSON.stringify(this.updatedFormModel) !== "{}") {
            let workFormData = {};
            /**
             * To clean workform data base on the data model defined in AppUtils
             */
            for (let key in AppUtils.workformDataModel) {
                if (this.state.hasOwnProperty(key)) {
                    workFormData[key] = this.state[key]
                }
            }
            for (let key in this.updatedFormModel) {
                workFormData[key] = this.updatedFormModel[key];
            }
            if (this.validateWorkForm(workFormData)) {
                this.setState({ showFullScreenLoading: true });
                AppUtils.updateWorkForm(workFormData).then((res) => {
                    this.setState({ showFullScreenLoading: false });
                    AppUtils.showToast(res.message);
                    if (res.status === 200) {
                        this.props.navigation.state.params.updateWorkFormList(res.data);
                        this._goBack();
                    }
                }).catch((err) => {
                    this.setState({ showFullScreenLoading: false });
                    AppUtils.showToast(err);
                })
            }
        } else {
            AppUtils.showToast("没有数据更新")
        }
    }
    _completeRequestForm() {
        let workFormData = {};
        /**
         * To clean workform data base on the data model defined in AppUtils
         */
        for (let key in AppUtils.workformDataModel) {
            if (this.state.hasOwnProperty(key)) {
                workFormData[key] = this.state[key]
            }
        }
        if (JSON.stringify(this.updatedFormModel) !== "{}") {
            for (let key in this.updatedFormModel) {
                workFormData[key] = this.updatedFormModel[key];
            }
        }


        if (!this.validateWorkForm(workFormData)) {
            return;
        }
        if (workFormData.workhour === null || workFormData.workhour === "") {
            AppUtils.showToast("工作数量不能为空");
            return false;
        }
        if (workFormData.returntime === "") {
            AppUtils.showToast("请填写返回时间");
            return;
        }
        workFormData.requestStatus = "Closed";
        this.setState({ showFullScreenLoading: true });
        AppUtils.updateWorkForm(workFormData).then((res) => {
            this.setState({ showFullScreenLoading: false });
            AppUtils.showToast(res.message);
            if (res.status === 200) {
                this.props.navigation.state.params.reLoadingWorkFormList();
                this._goBack();
            }
        }).catch((err) => {
            this.setState({ showFullScreenLoading: false });
            AppUtils.showToast(err);
        })
    }
    validateWorkForm(workFormData) {
        if (workFormData.company === "") {
            AppUtils.showToast("派工单位不能为空");
            return false;
        }
        if (workFormData.requester === "") {
            AppUtils.showToast("派工人员不能为空");
            return false;
        }
        if (workFormData.workitem === "") {
            AppUtils.showToast("工作任务不能为空");
            return false;
        }
        if (workFormData.worklocation === "") {
            AppUtils.showToast("工作地点不能为空");
            return false;
        }
        if (workFormData.workers.length <= 0) {
            AppUtils.showToast("作业人员不能为空");
            return false;
        }
        if (workFormData.workCategory === "") {
            AppUtils.showToast("任务类别不能为空");
            return false;
        }
        if (workFormData.planreturntime === "") {
            AppUtils.showToast("计划返回时间不能为空");
            return false;
        }
        if (this.formModel === 'CreateModel') {
            var planreturntime = workFormData.planreturntime;
            var planreturntimestamp = Date.parse(new Date(planreturntime)) / 1000 / 60;
            var createtimestamp = Date.parse(new Date(workFormData.creationtime)) / 1000 / 60;
            if (planreturntimestamp <= createtimestamp) {
                AppUtils.showToast("计划返回时间不能早于派工时间");
                return false;
            }
        }

        if (this.formModel === "EditModel") {
            var returntime = workFormData.returntime;
            if (returntime !== "") {
                var returntimestamp = Date.parse(new Date(returntime)) / 1000 / 60;
                var createtimestamp = Date.parse(new Date(workFormData.creationtime)) / 1000 / 60;
                if (returntimestamp <= createtimestamp) {
                    AppUtils.showToast("返回时间不能早于派工时间");
                    return false;
                }
            }
        }
        return true;
    }
    _goBack() {
        this.props.navigation.goBack(null);
    }
    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this._saveWorkForm.bind(this), goBack: this._goBack.bind(this) });
    }
    _showDateTimePicker = (itemName) => {
        this.selectedItem = itemName;
        this.setState({ isDateTimePickerVisible: true });
    }
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let newDate = moment(date).format("YYYY-MM-DD HH:mm");
        let newState = {};
        newState[this.selectedItem] = newDate;

        this._updateFormModel(this.selectedItem, newDate);
        this._hideDateTimePicker();

        this.setState(newState)
    };
    _selectImagesToUpload = () => {
        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '图片库',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 600,
            aspectX: 2,
            aspectY: 1,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            var self = this;
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            }
            else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                this.setState({ showFullScreenLoading: true });
                AppUtils.imageUpload(response.uri, response.fileName, this.state.requestId, "").then((res) => {
                    this.setState({ showFullScreenLoading: false });
                    AppUtils.showToast(res.message);
                    if (res.status === 200) {
                        this.props.navigation.state.params.updateWorkFormList(res.data);
                        this.setState(res.data);
                        //this._goBack();
                    }
                }).catch((err) => {
                    this.setState({ showFullScreenLoading: false });
                })
            }
        });
    }
    render() {
        let self = this;
        const WorkFormLabel = AppUtils.WorkFormLabel;
        var items = [];
        let unicKey = 100;
        WorkFormRenderItems.forEach(function (item) {
            items.push(
                <WorkFormItem
                    onPressItem={self._onPress}
                    key={unicKey++}
                    data={{ 'label': WorkFormLabel[item], 'category': item, 'data': self.state[item] }}
                    formModel={self.formModel}
                    updateFormModel={self._updateFormModel}
                    showDateTimePicker={self._showDateTimePicker}
                />
            )
        })
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                {items}
                <View style={styles.ButtonContainer}>
                    <TouchableOpacity onPress={this._completeRequestForm.bind(this)} style={styles.actionButtonContainer}>
                        <Text style={styles.actionButtonText}>完成工单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._selectImagesToUpload} style={styles.actionButtonContainer}>
                        <Text style={styles.actionButtonText}>上传照片</Text>
                    </TouchableOpacity>
                </View>
                <WorkFormImageView workDocuments={this.state.workdocument} />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode='datetime'
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({


    actionButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '700'
    },
    actionButtonContainer: {
        backgroundColor: "#3BB9FF",
        flex: 1,
        padding: 8,
        margin: 10,
        borderRadius: 3
    },
    ButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        height: 80
    },

    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    textInput: {
        height: 40,
        flex: 1,
        //backgroundColor: 'rgba(255,255,255,0.2)',
        //marginBottom: 20,
        //color: '#FFF',
        paddingHorizontal: 10,
        fontSize: 12,
        color: "#000"
    },
    WFItemContent: {
        fontSize: 12,
        color: "#000"
    },
    WFItemLabel: {
        width: 90,
        paddingRight: 5,
        fontSize: 12,
        color: "#000",
        //fontWeight: '500'
    },
    row: {
        height: 40,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E4E2',
        paddingBottom: 10,
        paddingTop: 15
    },
    container: {
        padding: 10,
        backgroundColor: 'white'
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
    CreateWorkForm: {
        screen: CreateWorkForm,
        navigationOptions: ({ navigation }) => ({
            //headerMode: "none"
            //headerTitle: 'Create New WorkForm',
            // headerStyle: styles.headerStyle,
            // headerTitleStyle: styles.headerTitleStyle
        }),
    },
    ItemSelection: {
        screen: ItemSelection,
        navigationOptions: ({ navigation }) => ({
            //headerTitle: 'Create New WorkForm',
            // headerStyle: styles.headerStyle,
            // headerTitleStyle: styles.headerTitleStyle
        }),
    },
}, {
        headerMode: 'none',
        mode: 'modal',
    })

