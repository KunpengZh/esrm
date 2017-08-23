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



const WorkFormRenderItems = ['requestId', 'company', 'requester', 'creationtime', 'workers', 'workhour', 'planreturntime', 'workCategory'
    , 'workitem', 'workersnumber', 'isSecurityTools', 'isSpareParts', 'sanPiaoZhiXing', 'securityTools', 'spareParts', 'worklocation', 'returntime', 'workcomments'];

const EditModel = {
    'editable': ['workhour', 'worklocation', 'workcomments'],
    'selectable': [],
    'dateTime': ['returntime']
};


class WorkFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data.data,
        }
    }
    _onPress = () => {
        this.props.onPressItem(this.props.data.category)
    }
    _updateValue = (newValue) => {
        this.setState({ value: newValue });
        this.props.updateFormModel(this.props.data.category, newValue);
    }
    _showDateTimePicker = () => {
        this.props.showDateTimePicker(this.props.data.category)
    }
    render() {
        switch (this.props.formModel) {
            case "EditModel":
                if (EditModel.editable.indexOf(this.props.data.category) >= 0) {
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
                } else if (EditModel.selectable.indexOf(this.props.data.category) >= 0) {
                    return (
                        <TouchableOpacity style={styles.row} onPress={this._onPress} >
                            <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                            <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                        </TouchableOpacity>
                    )
                } else if (EditModel.dateTime.indexOf(this.props.data.category) >= 0) {
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
                break;
            default:
                return (
                    <View style={styles.row} >
                        <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
                    </View>
                )
        }
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
        this.props.navigation.navigate('ItemSelection', { 'itemName': category, 'onSelect': this.onSelect })
    }
    onSelect = (data) => {
        switch (data.category) {
            case 'company':
                this.setState({ 'company': data.value })
                break
        }
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
    validateWorkForm(workFormData) {
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
                    <TouchableOpacity onPress={this._saveWorkForm.bind(this)} style={styles.actionButtonContainer}>
                        <Text style={styles.actionButtonText}>完成工单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._goBack} style={styles.actionButtonContainer}>
                        <Text style={styles.actionButtonText}>上传照片</Text>
                    </TouchableOpacity>
                </View>
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

