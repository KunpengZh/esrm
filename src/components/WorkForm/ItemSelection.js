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

export default class ItemSelection extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let label = navigation.state.params.itemName;
        if (AppUtils.WorkFormLabel.hasOwnProperty(navigation.state.params.itemName)) {
            label = AppUtils.WorkFormLabel[navigation.state.params.itemName];
            label = label.replace(":", "");
        }
        return ({
            headerTitle: '请选择 - ' + label,
        })
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
                    if (!res.status) {
                        AppUtils.showToast(res.message);
                        resolve([])
                    } else {
                        resolve(AppUtils.getConfigItem(itemName));
                    }
                })
            } else {
                resolve(configDataSource)
            }
        })
    }
    componentDidMount() {
        const itemName = this.props.navigation.state.params.itemName
        let itemSource = '';
        if (itemName === 'workers') {
            this.setState({ data: [], category: itemName });
        } else {
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
            }

            if (itemSource === '') {
                AppUtils.showToast("没有所需要的配置选项");
                return;
            }

            this._getConfigDataSource(itemSource).then((res) => {
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    res[i]['key'] = i;
                }
                
                this.setState({ data: res, category: itemName })
            })
        }
    }
    _onPressItem = (itemValue) => {
        this.props.navigation.goBack(null)
        this.props.navigation.state.params.onSelect({ value: itemValue, category: this.state.category });
    }
    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
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
        this.props.onPressItem(this.props.data.name);
    };
    render() {
        return (
            <TouchableOpacity onPress={this._onPress}>
                <Text style={styles.itemContent}>{this.props.data.name}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemContent: {
        height: 50,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E4E2',
        color: "#000"
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

})

