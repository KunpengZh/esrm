import React from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import FullScreenLoading from '../ShareComments/FullScreenLoading'
import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ItemSelection extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let label = navigation.state.params.itemName;
        if (AppUtils.WorkFormLabel.hasOwnProperty(navigation.state.params.itemName)) {
            label = AppUtils.WorkFormLabel[navigation.state.params.itemName];
            label = label.replace(":", "");
        }
        if (navigation.state.params.multiable) {
            return ({
                headerTitle: '请选择 - ' + label,
                headerRight: <TouchableOpacity onPress={() => params.onMultiSelectionConfirm(navigation)}>
                    <FontAwesome name="check-circle" style={styles.headericon} />
                </TouchableOpacity>,
                headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}>
                    <FontAwesome name="arrow-circle-left" style={styles.headericon} />
                </TouchableOpacity>

            })
        } else {
            return ({
                headerTitle: '请选择 - ' + label,
                headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}>
                    <FontAwesome name="arrow-circle-left" style={styles.headericon} />
                </TouchableOpacity>

            })
        }

    };
    constructor(props) {
        super(props)
        this.state = {
            showFullScreenLoading: false,
            data: [],
            category: ''
        }
    }

    _getConfigDataSource(itemName) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let configDataSource = AppUtils.getConfigItem(itemName);
            if (configDataSource.length <= 0) {
                self.setState({ showFullScreenLoading: true });
                AppUtils.loadingConfigData().then((res) => {
                    self.setState({ showFullScreenLoading: false });
                    if (res.status === 200) {
                        resolve(AppUtils.getConfigItem(itemName));
                    } else if (res.status === 700) {
                        AppUtils.showToast(res.message);
                        AppUtils.getRootNavigation().navigate('Login', { isMainLogin: false })
                        resolve([])
                    }
                })
            } else {
                resolve(configDataSource)
            }
        })
    }
    _onMultiSelectionConfirm = () => {
        let selectedItems = [];
        let oState = this.state.data;
        for (let i = 0; i < oState.length; i++) {
            if (oState[i].selected) {
                selectedItems.push(oState[i].name);
            }
        }
        this.props.navigation.goBack(null);
        this.props.navigation.state.params.onSelect({ value: selectedItems, category: this.state.category });
    }
    componentDidMount() {
        this.props.navigation.setParams({
            onMultiSelectionConfirm: this._onMultiSelectionConfirm.bind(this),
        });

        const itemName = this.props.navigation.state.params.itemName;
        const filterable = this.props.navigation.state.params.filterable;
        const filter = this.props.navigation.state.params.filter;

        let itemSource = '';

        switch (itemName) {
            case 'company':
                itemSource = 'companySource';
                break;
            case 'workCategory':
                itemSource = 'workCategory';
                break;
            case 'workitem':
                itemSource = 'workItem';
                break;
            case 'isSecurityTools':
                itemSource = 'isSecurityTools';
                break;
            case 'isSpareParts':
                itemSource = 'isSpareParts';
                break;
            case 'sanPiaoZhiXing':
                itemSource = 'sanPiaoZhiXing';
                break;
            case 'securityTools':
                itemSource = 'securityTools';
                break;
            case 'spareParts':
                itemSource = 'spareParts';
                break;
            case 'requester':
                itemSource = 'companyAdmin'
                break;
            case 'workers':
                itemSource = 'companyEmployee'
                break;
        }

        if (itemSource === '') {
            AppUtils.showToast("没有所需要的配置选项");
            return;
        }

        this._getConfigDataSource(itemSource).then((res) => {
            let dataSource = [];
            if (filterable) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i][filter.filterFieldName] === filter.filterValue) {
                        let obj = res[i];
                        obj.key = i;
                        obj.selected = false;
                        dataSource.push(obj);
                    }
                }
            } else {
                for (let i = 0; i < res.length; i++) {
                    dataSource.push(res[i]);
                }
                for (let i = 0; i < dataSource.length; i++) {
                    dataSource[i]['key'] = i;
                    dataSource[i]['selected'] = false;
                }
            }

            if (this.props.navigation.state.params.toAddAll) {
                dataSource.push({
                    name: 'All',
                    key: res.length,
                    selected: false
                })
            }
            this.setState({ data: dataSource, category: itemName })
        })

    }
    _onPressItem = (itemValue, itemKey) => {
        if (this.props.navigation.state.params.multiable) {

            let newState = this.state.data;
            for (let i = 0; i < newState.length; i++) {

                if (newState[i]['key'] === itemKey) {
                    newState[i]['selected'] = !newState[i]['selected'];
                }
            }
            this.setState({ data: newState });
        } else {
            this.props.navigation.goBack(null)
            this.props.navigation.state.params.onSelect({ value: itemValue, category: this.state.category });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <FullScreenLoading showLoading={this.state.showFullScreenLoading} />
                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={({ item }) => {
                        return (
                            <SelectableItem data={item} onPressItem={this._onPressItem} />
                        )
                    }}
                />
            </View>
        )
    }
}

class SelectableItem extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.data.name, this.props.data.key);
    };
    render() {
        if (this.props.data.selected) {
            return (
                <TouchableOpacity onPress={this._onPress}>
                    <Text style={styles.itemContentSelected}>{this.props.data.name}</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={this._onPress}>
                    <Text style={styles.itemContent}>{this.props.data.name}</Text>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    itemContentSelected: {
        height: 50,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E4E2',
        backgroundColor: '#4863A0',
        color: "#FFF",
        fontSize: 12,
    },
    itemContent: {
        height: 50,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E4E2',
        color: "#000",
        fontSize: 12,
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

})

