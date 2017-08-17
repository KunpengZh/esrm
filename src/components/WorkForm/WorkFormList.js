import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

export default class FlatListBasics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
    }
    componentWillReceiveProps(newProps) {
        console.log("to setup data")
        this.setState({ data: newProps.data });
    }
    sepa() {
        console.log("separater");
        return (<View style={{ height: 1, backgroundColor: '#D1D0CE' }}></View>)
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ItemSeparatorComponent={this.sepa}
                    data={this.state.data}
                    renderItem={({ item }) => {
                        return (
                            <WorkForm data={item} />
                        )
                    }}
                />
            </View>
        );
    }
}
class WorkForm extends React.Component {
    render() {
        console.log("render");
        console.log(this.props)
        return (
            <View style={styles.WFItemContainer}>
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
                        <Text style={styles.WFItemLabel}>工作类别:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.workCategory}</Text>
                    </View>
                    <View style={styles.WFItemRow}>
                        <Text style={styles.WFItemLabel}>派工时间:</Text>
                        <Text style={styles.WFItemContent}>{this.props.data.creationtime}</Text>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    WFItemContent:{
        fontSize: 10,
        width:120
    },
    WFItemLabel:{
        width:50,
        paddingRight:5,
        fontSize: 10,
        //fontWeight:'500'
    },
    WFItemRow:{
        flex:1,
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
        paddingTop:10,
        paddingBottom:10,
        flex: 1,
        height: 90,
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