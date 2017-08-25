import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
} from 'react-native';
import { StackNavigator } from 'react-navigation';


import AppUtils from '../../Share/AppUtils'
import FullScreenLoading from '../ShareComments/FullScreenLoading';
import ItemSelection from '../WorkForm/ItemSelection'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ViewResultCategory from './ViewResultCategory'


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
    constructor(props) {
        super(props)
        this.state = {
            requestId: '',
            workCategory: '',
            company: '',
            requester: '',
            workers: [],
            returntime1: '',
            returntime2: '',
            creationtime1: '',
            creationtime2: '',
            isDateTimePickerVisible: false,
            selectedItem: '',
            showFullScreenLoading: false
        }
    }
    _queyryByWorker = () => {
        console.log("query by worker")
    }
    componentDidMount() {
        this.props.navigation.setParams({
            queryByWorkForm: this._queryByWorkForm.bind(this),
            queyryByWorker: this._queyryByWorker.bind(this)
        });
    }
    onDateTimePickerPressed = (itemName) => {
        this.selectedItem = itemName;
        this.setState({ isDateTimePickerVisible: true });
    }
    onItemPress = (category) => {
        let filterValue = '';
        let filterFieldName = '';
        let filterable = false;
        let multiable = false;

        if (category === 'requester') {
            if (this.state.company === "") {
                AppUtils.showToast("请先选择工作单位");
                return;
            } else {
                filterValue = this.state.company;
                filterFieldName = 'attr';
                filterable = true;
            }
        }

        if (category === 'workers') {
            if (this.state.company === "") {
                AppUtils.showToast("请先选择工作单位");
                return;
            } else {
                filterValue = this.state.company;
                filterFieldName = 'attr';
                filterable = true;
                multiable = true;
            }
        }
        this.props.navigation.navigate('ItemSelection', {
            'itemName': category,
            'onSelect': this.onSelect,
            'multiable': multiable,
            'filterable': filterable,
            'toAddAll': true,
            'filter': {
                'filterValue': filterValue,
                'filterFieldName': filterFieldName
            }
        })
    }
    onSelect = (data) => {

        let nObj = {};
        if (data.category === 'company' && data.value != this.state.company) {
            nObj.requester = '';
            nObj.workers = [];
        }

        nObj[data.category] = data.value;

        this.setState(nObj);
    }
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    _handleDatePicked = (date) => {
        let newDate = moment(date).format("YYYY-MM-DD");
        let newState = {};
        newState[this.selectedItem] = newDate;
        this._hideDateTimePicker();
        this.setState(newState)
    }
    _queryByWorkForm() {
        let qcriteria = {};
        if (this.state.requestId !== "") {
            qcriteria.requestId = this.state.requestId;
        }
        if (this.state.company !== "" && this.state.company !== "All") {
            qcriteria.company = this.state.company;
        }
        if (this.state.requester !== "" && this.state.requester !== "All") {
            qcriteria.requester = this.state.requester;
        }
        if (this.state.workers.length > 0) {
            var needworks = true;
            var workers = this.state.workers;
            for (var i = 0; i < workers.length; i++) {
                if (workers[i] === "All") {
                    needworks = false;
                    break;
                }
            }
            if (needworks) {
                qcriteria.workers = this.state.workers;
            }
        }
        if (this.state.workCategory !== "" && this.state.workCategory !== "All") {
            qcriteria.workCategory = this.state.workCategory;
        }

        if ((this.state.creationtime1 !== "" && this.state.creationtime2 === "") || (this.state.creationtime1 === "" && this.state.creationtime2 !== "")) {
            AppUtils.showToast("派工日期必须成对选取!");
            return;
        }
        if (this.state.creationtime1 !== "") {
            let date1 = Date.parse(new Date(this.state.creationtime1)) / 1000 / 60;
            let date2 = Date.parse(new Date(this.state.creationtime2)) / 1000 / 60;

            if (date2 <= date1) {
                AppUtils.showToast("第二个日期不能早于第一个日期");
                return false;
            }

            qcriteria.creationtime = [];
            qcriteria.creationtime.push(this.state.creationtime1);
            qcriteria.creationtime.push(this.state.creationtime2);
        }

        if ((this.state.returntime1 !== "" && this.state.returntime2 === "") || (this.state.returntime1 === "" && this.state.returntime2 !== "")) {
            AppUtils.showToast("实际返回日期必须成对选取!");
            return;
        }
        if (this.state.returntime1 !== "") {
            let date1 = Date.parse(new Date(this.state.returntime1)) / 1000 / 60;
            let date2 = Date.parse(new Date(this.state.returntime2)) / 1000 / 60;

            if (date2 <= date1) {
                AppUtils.showToast("第二个日期不能早于第一个日期");
                return false;
            }

            qcriteria.returntime = [];
            qcriteria.returntime.push(this.state.returntime1);
            qcriteria.returntime.push(this.state.returntime2);
        }
        this.setState({ showFullScreenLoading: true });
        AppUtils.queryByWorkForm(qcriteria).then((res) => {
            this.setState({ showFullScreenLoading: false });
            if (res.status === 700) {
                this.setState({ showFullScreenLoading: false });
                AppUtils.showToast(res.message);
                AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false })
            } else if (res.status === 200) {
                this.props.navigation.navigate('ViewResultCategory')
            } else {
                AppUtils.showToast(res.message);
            }
        }).catch((err) => {
            this.setState({ showFullScreenLoading: false });
            AppUtils.showToast(err);
        })
    }

    render() {
        return (
            <ScrollView>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                <Text style={styles.funLabel}>输入工单编号查询</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="calendar-o" style={styles.labelicon} />
                        <Text style={styles.label}>工单编号:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textInput}
                            onChangeText={(requestId) => this.setState({ requestId: requestId })}
                            value={this.state.requestId}
                        />
                    </View>
                </View>
                <Text style={styles.funLabel}>按工作单位查询</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="tasks" style={styles.labelicon} />
                        <Text style={styles.label}>任务类别:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onItemPress('workCategory')}>
                            <Text style={styles.contentText}>{this.state.workCategory}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="address-card-o" style={styles.labelicon} />
                        <Text style={styles.label}>派工单位:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onItemPress('company')}>
                            <Text style={styles.contentText}>{this.state.company}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="user-circle" style={styles.labelicon} />
                        <Text style={styles.label}>派工人员:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onItemPress('requester')}>
                            <Text style={styles.contentText}>{this.state.requester}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="users" style={styles.labelicon} />
                        <Text style={styles.label}>工作人员:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onItemPress('workers')}>
                            <Text style={styles.contentText}>{this.state.workers}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.funLabel}>按派工日期区间查询</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="calendar-check-o" style={styles.labelicon} />
                        <Text style={styles.longLabel}>大于派工日期:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onDateTimePickerPressed('creationtime1')}>
                            <Text style={styles.contentText}>{this.state.creationtime1}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="calendar-plus-o" style={styles.labelicon} />
                        <Text style={styles.longLabel}>小于派工日期:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onDateTimePickerPressed('creationtime2')}>
                            <Text style={styles.contentText}>{this.state.creationtime2}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.funLabel}>按工单完成日期区间查询</Text>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <FontAwesome name="calendar-check-o" style={styles.labelicon} />
                        <Text style={styles.longLabel}>大于返回日期:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onDateTimePickerPressed('returntime1')}>
                            <Text style={styles.contentText}>{this.state.returntime1}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="calendar-plus-o" style={styles.labelicon} />
                        <Text style={styles.longLabel}>小于返回日期:</Text>
                        <TouchableOpacity style={styles.touchableArea} onPress={() => this.onDateTimePickerPressed('returntime2')}>
                            <Text style={styles.contentText}>{this.state.returntime2}</Text>
                            <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode='date'
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    contentText: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
        height: 50
    },
    labelicon: {
        fontSize: 16,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    label: {
        fontSize: 12,
        width: 70,
        paddingRight: 5
    },
    longLabel: {
        fontSize: 12,
        width: 90,
        paddingRight: 5
    },
    touchableArea: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
    },
    rightArrorIcon: {
        fontSize: 16
    },
    topMenuButton: {
        color: "#3BB9FF",
        fontSize: 12,
        marginRight: 10
    },
    topMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    funLabel: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        marginTop: 10,
        fontSize: 12,
        color: '#848482'
    },
    container: {
        //flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        margin: 10,
        marginTop: 0,
        backgroundColor: "#FFF",
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
        height: 40,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
        color:"#666362"
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
    ItemSelection: {
        screen: ItemSelection,
        navigationOptions: ({ navigation }) => ({
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },
    ViewResultCategory: {
        screen: ViewResultCategory,
        navigationOptions: ({ navigation }) => ({
            headerTitle: '选择查询结果',
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle
        }),
    },

}, {
        //headerMode: "none",

    })
