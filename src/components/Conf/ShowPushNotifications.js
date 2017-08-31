import React from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AppUtils from '../../Share/AppUtils'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ConfigView extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: <TouchableOpacity style={styles.topMenuContainer} onPress={() => navigation.goBack(null)}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    componentWillReceiveProps(newProps) {
        
    }
    render() {

        let blocks = [];
        let key = 2000;
        this.props.navigation.state.params.data.forEach(function (element) {
            blocks.push(
                <BlockMsg data={element.data} timeLabel={element.timeLabel} key={"B" + (key++)} />
            )
        })
        return (
            <ScrollView>
                {blocks}
            </ScrollView>
        )
    }
}
class BlockMsg extends React.Component {
    render() {
        let rows = [];
        let lKey = 1000;
        this.props.data.forEach(function (element) {
            
            rows.push(
                <Text key={'R' + (lKey++)}>{element}</Text>
            )
        });
        
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <FontAwesome name="id-card-o" style={styles.labelicon} />
                    <Text style={styles.title}>{this.props.timeLabel}</Text>
                </View>
                <View style={styles.content}>
                    {rows}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        //flex: 1,
        //justifyContent: "flex-start",
        //alignItems: 'flex-start',
        //height:800
    },
    row: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom:10
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight:'500'
    },
    labelicon: {
        fontSize: 24,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    topMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    container: {
        //flex: 1,
        padding: 20,
        margin: 20,
        backgroundColor: "#FFF",
    },
})

