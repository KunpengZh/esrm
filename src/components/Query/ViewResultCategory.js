import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class MenuPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: <TouchableOpacity style={styles.topMenuContainer} onPress={() => navigation.goBack(null)}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    onItemPress(category) {
        switch (category) {
            case 'DetailList':
                this.props.navigation.navigate('DetailList', {
                    data: this.props.navigation.state.params.workFormsList,
                    formName: this.props.navigation.state.params.formName
                });
                break;
            case 'integrationCount':
                this.props.navigation.navigate('IntegrationCount', { data: this.props.navigation.state.params.integrationCount });
                break;
            case 'companyCount':
                this.props.navigation.navigate('CompanyCount', { data: this.props.navigation.state.params.companyCount });
                break;
            case 'workerCount':
                this.props.navigation.navigate('WorkerCount', { data: this.props.navigation.state.params.workerCount });
                break;
        }

    }
    render() {
        return (
            <ScrollView>
                <Text style={styles.funLabel}>查看详细查询结果</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.row} onPress={() => this.onItemPress('DetailList')}>
                        <FontAwesome name="sitemap" style={styles.labelicon} />
                        <Text style={styles.label}>查看详细清单</Text>
                        <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.funLabel}>综合汇总统计</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.row} onPress={() => this.onItemPress('integrationCount')}>
                        <FontAwesome name="building-o" style={styles.labelicon} />
                        <Text style={styles.label}>综合汇总统计</Text>
                        <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.funLabel}>按单位汇总统计</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.row} onPress={() => this.onItemPress('companyCount')}>
                        <FontAwesome name="vcard-o" style={styles.labelicon} />
                        <Text style={styles.label}>单位汇总统计</Text>
                        <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.funLabel}>按作业人员汇总统计</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.row} onPress={() => this.onItemPress('workerCount')}>
                        <FontAwesome name="user-o" style={styles.labelicon} />
                        <Text style={styles.label}>作业人员汇总统计</Text>
                        <FontAwesome name="angle-double-right" style={styles.rightArrorIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    contentText: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
        height: 50,
        flex: 1
    },
    labelicon: {
        fontSize: 16,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    label: {
        fontSize: 12,
        flex: 1,
        paddingRight: 5
    },
    longLabel: {
        fontSize: 12,
        width: 90,
        paddingRight: 5
    },
    touchableArea: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
    },
    rightArrorIcon: {
        fontSize: 16
    },
    topMenuButton: {
        color: "#3BB9FF",
        fontSize: 12,
        marginRight: 10
    },
    topMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    funLabel: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        marginTop: 10,
        fontSize: 12,
        color: '#848482'
    },
    container: {
        //flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        margin: 10,
        marginTop: 0,
        backgroundColor: "#FFF",
    },
    headericon: {
        fontSize: 22,
        //color: "#157DEC",
        paddingRight: 10,
        paddingLeft: 10,
        color: "#3BB9FF"
        //color:"#1589FF"
    },
    headerStyle: {
        //backgroundColor: "#98AFC7",
        height: 40,
    },
    headerTitleStyle: {
        fontSize: 12, // 文字大小
        color: "#666362"
    }
})


