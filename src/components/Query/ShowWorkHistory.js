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


import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const WorkFormRenderItems = ['requestId', 'company', 'requester', 'creationtime', 'worker', 'workCategory'
    , 'workitem', 'workhour', 'perhourwage', 'requestwage', 'returntime'];


class WorkFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data.data ? props.data.data : '',
        }
    }
    render() {
        return (
            <View style={styles.row} >
                <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                <Text style={styles.WFItemContent}>{this.props.data.data}</Text>
            </View>
        )
    }
}

export default class WorkHistory extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerLeft: <TouchableOpacity onPress={() => params.goBack(null)}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    constructor(props) {
        super(props);
        this.state = this.props.navigation.state.params.workFormData;
        this.state.workers = AppUtils.ArrayToString(this.state.workers);
    }

    _goBack() {
        this.props.navigation.goBack(null);
    }
    componentDidMount() {
        this.props.navigation.setParams({ goBack: this._goBack.bind(this) });
    }
    render() {
        let self = this;
        const WorkFormLabel = AppUtils.WorkFormLabel;
        var items = [];
        let unicKey = 100;
        WorkFormRenderItems.forEach(function (item) {
            items.push(
                <WorkFormItem
                    key={unicKey++}
                    data={{ 'label': WorkFormLabel[item], 'category': item, 'data': self.state[item] }}
                />
            )
        })
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {items}
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
        flex: 1,
        fontSize: 12,
        color: "#000"
    },
    rightArrorIcon: {
        fontSize: 16
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
        backgroundColor: 'white',
        margin: 5
    },
    headerStyle: {
        height: 40,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
    }

})
