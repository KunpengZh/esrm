import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import AppUtils from '../../Share/AppUtils'
import WorkFformList from '../WorkForm/WorkFormList'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default class DetailList extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: <TouchableOpacity style={styles.topMenuContainer} onPress={() => navigation.goBack(null)}>
                <FontAwesome name="arrow-circle-left" style={styles.headericon} />
            </TouchableOpacity>
        };
    };
    constructor(props){
        super(props);
        this.state={};
        this.state.workFormsList=props.navigation.state.params.data?props.navigation.state.params.data:[];
        
    }
   
    _onPressItem = (id) => {
        let self = this;
        let workForm = {};
        let find = false;
        for (let i = 0; i < this.state.workFormsList.length; i++) {
            if (this.state.workFormsList[i].requestId === id) {
                workForm = this.state.workFormsList[i];
                find = true;
                break;
            }
        }
        if (find) {
            console.log(id);
            // this.props.navigation.navigate('OpenWorkForm', {
            //     workFormData: workForm,
            //     formModel: 'EditModel',
            //     updateWorkFormList: self._updateWorkFormList,
            //     reLoadingWorkFormList: self._reLoadingWorkFormList
            // });
        }
    }
    render() {
        return (
            <View style={styles.ListViewContainer}>
                <WorkFformList data={this.state.workFormsList} onPressItem={this._onPressItem} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    ListViewContainer: {
        margin:5,
        backgroundColor:'#FFF',
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D0C1'
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
    }
})

