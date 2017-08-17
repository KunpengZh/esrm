import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default class FlatListBasics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
    }
    componentWillReceiveProps(upprops) {
        console.log("hi......")
        console.log(upprops);
        this.setState({ data: upprops.data });
    }
    render() {
        console.log("render list");
        console.log(this.state.data);
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => {
                        return (
                            <Text style={styles.workForm}>{item.requestId}</Text>
                        )
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    workForm: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})