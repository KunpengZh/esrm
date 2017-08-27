import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default class RecentChatsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: <TouchableOpacity style={styles.topMenuContainer} onPress={() => navigation.goBack(null)}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    constructor(props) {
        super(props);
        this.state = {};
        this.state = props.navigation.state.params.data ? props.navigation.state.params.data : {
            company: '',
            worker: '',
            requester: '',
            workCategory: '',
            requestNum: 0,
            wageNum: 0,
            workhourNum: 0,
            returntime: "",
            requester: "",
            creationtime: ''
        };
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <FontAwesome name="address-card-o" style={styles.labelicon} />
                    <Text style={styles.longLabel}>派工单位:</Text>
                    <Text style={styles.contentText}>{this.state.company}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calculator" style={styles.labelicon} />
                    <Text style={styles.longLabel}>工单数量:</Text>
                    <Text style={styles.contentText}>{this.state.requestNum}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calendar" style={styles.labelicon} />
                    <Text style={styles.longLabel}>派工区间:</Text>
                    <Text style={styles.contentText}>{this.state.creationtime}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calendar" style={styles.labelicon} />
                    <Text style={styles.longLabel}>工单完成区间:</Text>
                    <Text style={styles.contentText}>{this.state.returntime}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calculator" style={styles.labelicon} />
                    <Text style={styles.longLabel}>工作总量:</Text>
                    <Text style={styles.contentText}>{this.state.workhourNum}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calculator" style={styles.labelicon} />
                    <Text style={styles.longLabel}>总工额:</Text>
                    <Text style={styles.contentText}>{this.state.wageNum}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="users" style={styles.labelicon} />
                    <Text style={styles.longLabel}>作业人员:</Text>
                    <Text style={styles.contentText}>{this.state.worker}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    longLabel: {
        fontSize: 12,
        width: 90,
        paddingRight: 5
    },
    labelicon: {
        fontSize: 16,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    contentText: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
        height: 50
    },
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D0C1',
        padding: 10,
        margin: 10,
        backgroundColor: "#FFF",
    }
})

