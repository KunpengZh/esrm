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
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '请选择 - ' + navigation.state.params.itemName,
    });
    constructor(props) {
        super(props)
        this.state = {
            showFullScreenLoading: false,
            data: [],
            category:''
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
        let configDataSource;
        switch (itemName) {
            case 'company':
                this.setState({category:'company'})
                this._getConfigDataSource('companySource').then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        res[i]['key'] = i;
                    }
                    this.setState({ data: res })
                })
        }
    }
    _onPressItem = (itemName) => {
        this.props.navigation.goBack(null)
        this.props.navigation.state.params.onSelect({value:itemName,category:this.state.category});
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

