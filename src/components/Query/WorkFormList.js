import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AppUtils from '../../Share/AppUtils'

export default class FlatListBasics extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        }
        this.key = 100000;
    }
    _onPressItem = (id) => {
        this.props.onPressItem(id);
    }
    _keyExtractor = (item, index) => this.key++;
    componentWillReceiveProps(newProps) {
        this.setState({ data: newProps.data });
    }
    sepa() {
        return (<View style={{ height: 1, backgroundColor: '#D1D0CE', marginLeft: 5, marginRight: 5 }}></View>)
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
                            <WorkForm
                                data={item}
                                formName={this.props.formName}
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
    constructor(props) {
        super(props);
        this.state = {};
        this.state.workers = AppUtils.ArrayToString(props.data.workers)
    }
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
                        <Text style={styles.WFItemLabel}>工作类别:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.workCategory}</Text>
                        <Text style={styles.WFItemLabel}>工作任务:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.workitem}</Text>
                    </View>
                    {/* <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>派工时间:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.creationtime}</Text>
                        <Text style={styles.WFItemLabel}>返回时间:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.returntime}</Text>
                    </View> */}
                    <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>工时:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.workhour}</Text>
                        <Text style={styles.WFItemLabel}>工额:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.requestwage}</Text>
                    </View>
                    {this.props.formName === 'WorkForm' ? (
                        <View style={styles.WFItemRow}>
                            <Text style={styles.WFItemLabel}>工作人员:</Text>
                            <Text style={styles.WFItemContentWorkers}>{this.state.workers}</Text>
                        </View>
                    ) : (
                            <View style={styles.WFItemRow}>
                                <Text style={styles.WFItemLabel}>工作人员:</Text>
                                <Text style={styles.WFItemContentWorkers}>{this.props.data.worker}</Text>
                            </View>
                        )}

                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    WFItemContentWorkers: {
        fontSize: 10,
        flex: 1
    },
    WFItemContent: {
        fontSize: 10,
        width: 120
    },
    WFItemLabel: {
        width: 50,
        paddingRight: 5,
        fontSize: 10,
        //fontWeight:'500'
    },
    WFItemRow: {
        flex: 1,
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
        height: 120,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    WFItemLogo: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    container: {
        flex: 1,
    },

})