import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class FlatListBasics extends React.PureComponent {
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
        this.state = {
            data: props.navigation.state.params.data ? props.navigation.state.params.data : []
        };
        this.key = 2001;
    }
    _keyExtractor = () => this.key++
    componentWillReceiveProps(newProps) {
        this.setState({ data: newProps.data });
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) => {
                        return (
                            <WorkForm
                                data={item}
                            />
                        )
                    }}
                />
            </View>
        );
    }
}
class WorkForm extends React.Component {
    render() {
        let nKey=3600;
        let comments = [];
        this.props.data.refComments.forEach(function (comment) {
            comments.push(
                <Text style={styles.commentstext} key={nKey++}>{comment}</Text>
            )
        })
        return (
            <View style={styles.blockContainer}>
                 <View style={styles.row}>
                    <FontAwesome name="users" style={styles.labelicon} />
                    <Text style={[styles.longLabel,styles.markTitle]}>作业人员:</Text>
                    <Text style={[styles.contentText,styles.markTitle]}>{this.props.data.worker}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="address-card-o" style={styles.labelicon} />
                    <Text style={styles.longLabel}>派工单位:</Text>
                    <Text style={styles.contentText}>{this.props.data.company}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calculator" style={styles.labelicon} />
                    <Text style={styles.longLabel}>工单数量:</Text>
                    <Text style={styles.contentText}>{this.props.data.requestNum}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="users" style={styles.labelicon} />
                    <Text style={styles.longLabel}>派工人员:</Text>
                    <Text style={styles.contentText}>{this.props.data.requester}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="film" style={styles.labelicon} />
                    <Text style={styles.longLabel}>工作类别:</Text>
                    <Text style={styles.contentText}>{this.props.data.workCategory}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="calendar-plus-o" style={styles.labelicon} />
                    <Text style={styles.longLabel}>总工时:</Text>
                    <Text style={styles.contentText}>{this.props.data.workhourNum}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome name="plus-square" style={styles.labelicon} />
                    <Text style={styles.longLabel}>总工额:</Text>
                    <Text style={styles.contentText}>{this.props.data.wageNum}</Text>
                </View>
                <View style={styles.comments}>
                    <Text style={styles.longLabel}>备注参考:</Text>
                    <View style={{ height: 1, backgroundColor: '#D1D0CE', marginTop:5, marginBottom:5 }}></View>
                    {comments}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    markTitle:{
        fontWeight:'700',
        //color:"#000"
    },
    commentstext: {
        fontSize: 9,
        paddingTop:3,
        paddingBottom:3
    },
    comments: {
        paddingTop:15,
        paddingLeft:15
        // padding: 10,
        // margin: 10,
        // backgroundColor: "#FFF",
        // borderWidth: 1,
        // borderColor: '#D1D0C1',
    },
    longLabel: {
        fontSize: 12,
        width: 90,
        paddingRight: 5
    },
    labelicon: {
        fontSize: 12,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        //color: "#3BB9FF"
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
        paddingTop:5,
        paddingBottom:5,
        // borderBottomColor: '#E5E4E2',
        // borderBottomWidth: 1,
        //height: 30
    },
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    contenticon: {
        fontSize: 16,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        //color: "#3BB9FF"
        //color:"#1589FF"
    },
    container: {
        flex: 1
    },
    blockContainer: {
        flex: 1,
        //flexDirection: 'row',
        //justifyContent: "space-around",
        //alignItems: 'center',
        padding: 10,
        margin: 10,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#D1D0C1',
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 50
    }

})