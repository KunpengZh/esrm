import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import ItemSelection from './ItemSelection'
import AppUtils from '../../Share/AppUtils'

class CreateWorkForm extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'WorkForm - ' + navigation.state.params.workFormData.requestId,
    });
    constructor(props) {
        super(props);
        this.state = this.props.navigation.state.params.workFormData;
        this.sectedItem = '';
    }
    _onPress = () => {
        this.props.navigation.navigate('ItemSelection', { 'itemName': 'company' })
    };
    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>派工单号:</Text>
                    <Text style={styles.WFItemContent}>{this.state.requestId}</Text>
                    {/* <Text style={styles.WFItemLabel}>工单状态:</Text>
                    <Text style={styles.WFItemContent}>{this.state.requestStatus}</Text> */}
                </View>
                <TouchableOpacity style={styles.row} onPress={this._onPress} >
                    <Text style={styles.WFItemLabel}>派工单位:</Text>
                    <Text style={styles.WFItemContent}>{this.state.company}</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>派工人员:</Text>
                    <Text style={styles.WFItemContent}>{this.state.requester}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>派工时间:</Text>
                    <Text style={styles.WFItemContent}>{this.state.creationtime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>作业人员:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workers}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>工作数量:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workhour}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>计划返回时间:</Text>
                    <Text style={styles.WFItemContent}>{this.state.planreturntime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>任务类别:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workCategory}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>工作任务:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workitem}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>工作人数:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workersnumber}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>领取安全工具:</Text>
                    <Text style={styles.WFItemContent}>{this.state.isSecurityTools}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>领取备品备件:</Text>
                    <Text style={styles.WFItemContent}>{this.state.isSpareParts}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>三票执行:</Text>
                    <Text style={styles.WFItemContent}>{this.state.sanPiaoZhiXing}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>安全工具:</Text>
                    <Text style={styles.WFItemContent}>{this.state.securityTools}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>备品备件:</Text>
                    <Text style={styles.WFItemContent}>{this.state.spareParts}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>工作地点:</Text>
                    <Text style={styles.WFItemContent}>{this.state.worklocation}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>实际返回时间:</Text>
                    <Text style={styles.WFItemContent}>{this.state.returntime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.WFItemLabel}>工作备注:</Text>
                    <Text style={styles.WFItemContent}>{this.state.workcomments}</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    WFItemContent: {
        fontSize: 10,
        color: "#000"
    },
    WFItemLabel: {
        width: 70,
        paddingRight: 5,
        fontSize: 10,
        color: "#000",
        fontWeight: '500'
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
        backgroundColor:'white'
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
})

