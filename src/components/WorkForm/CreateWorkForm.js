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



const WorkFormRenderItems = ['requestId', 'company', 'requester', 'creationtime', 'workers', 'workhour', 'planreturntime', 'workCategory'
    , 'workitem', 'workersnumber', 'isSecurityTools', 'isSpareParts', 'sanPiaoZhiXing', 'securityTools', 'spareParts', 'worklocation', 'returntime', 'workcomments'];

const EditModel = {
    'editable': ['workhour', 'worklocation', 'returntime', 'workcomments'],
    'selectable': ['company']
};


class TouchableFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data.data
        }
    }
    _onPress = () => {
        this.props.onPressItem(this.props.data.category)
    }
    _updateValue = (newValue) => {
        this.setState({ value: newValue });
        this.props.updateFormModel(this.props.data.category, newValue);
    }
    render() {
        switch (this.props.formModel) {
            case "EditModel":
                if (EditModel.editable.indexOf(this.props.data.category) >= 0) {
                    return (
                        <TouchableOpacity style={styles.row} >
                            <Text style={styles.WFItemLabel}>{this.props.data.label}</Text>
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={styles.textInput}
                                onChangeText={(text) => this._updateValue(text)}
                                value={this.state.value}
                            />
                        </TouchableOpacity>
                    )
                } else if (EditModel.selectable.indexOf(this.props.data.category) >= 0) {
                    return (
                        <TouchableOpacity style={styles.row} onPress={this._onPress} >
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
        this.sectedItem = '';
        this.formModel = this.props.navigation.state.params.formModel;
        this.updatedFormModel = {};
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
    updateFormModel = (key, value) => {
        this.updatedFormModel[key] = value;
    }
    _saveWorkForm() {
        console.log("to save work form")
    }
    _goBack(){
        this.props.navigation.goBack(null);
    }
    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this._saveWorkForm.bind(this), goBack: this._goBack.bind(this) });
    }
    render() {
        let self = this;
        const WorkFormLabel = AppUtils.WorkFormLabel;
        var items = [];
        let unicKey = 100;
        WorkFormRenderItems.forEach(function (item) {
            items.push(
                <TouchableFormItem
                    onPressItem={self._onPress}
                    key={unicKey++}
                    data={{ 'label': WorkFormLabel[item], 'category': item, 'data': self.state[item] }}
                    formModel={self.formModel}
                    updateFormModel={self.updateFormModel}
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
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight:10,
        paddingLeft:10
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
    buttonSave:{
        fontSize: 12,
        fontWeight:"900",
        paddingRight:10,
        color: "#000",
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

