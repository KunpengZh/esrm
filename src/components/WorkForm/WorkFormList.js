import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default class FlatListBasics extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        }
    }
    _onPressItem = (id) => {
        this.props.onPressItem(id);
    }
    _keyExtractor = (item, index) => item.requestId;
    componentWillReceiveProps(newProps) {
        this.setState({ data: newProps.data });
    }
    sepa() {
        return (<View style={{ height: 1, backgroundColor: '#D1D0CE', marginLeft:5, marginRight:5}}></View>)
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ItemSeparatorComponent={this.sepa}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) => {
                        return (
                            <WorkForm data={item}
                                onPressItem={this._onPressItem}
                            />
                        )
                    }}
                />
            </View>
        );
    }
}
class WorkForm extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.data.requestId);
    };
    render() {
        return (
            <TouchableOpacity style={styles.WFItemContainer} onPress={this._onPress}>
                <Image source={require('../../images/document.png')} style={styles.WFItemLogo} />
                <View style={styles.WFItemBody} >
                    <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>派工单号:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.requestId}</Text>
                        <Text style={styles.WFItemLabel}>派工单位:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.company}</Text>
                    </View>
                    <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>派工人员:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.requester}</Text>
                        <Text style={styles.WFItemLabel}>负责人:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.chargerName}</Text>
                    </View>
                    <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>派工时间:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.creationtime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    WFItemContent: {
        fontSize: 10,
        width: 90
    },
    WFItemLabel: {
        width: 50,
        paddingRight: 5,
        fontSize: 10,
        //fontWeight:'500'
    },
    WFItemRow: {
        flex: 1,
        paddingTop:3,
        paddingBottom:3,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    WFItemBody: {
        flex: 1,
        marginLeft: 15,
    },
    WFItemContainer: {
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        //height: 90,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    WFItemLogo: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    container: {
        flex: 1,
    },

})