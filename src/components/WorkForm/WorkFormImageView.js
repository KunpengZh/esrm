import React from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import AppUtils from '../../Share/AppUtils'

import Dimensions from 'Dimensions';
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;

export default class WorkFormImageView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
        let unicKey = 1100;
        let workDocuments = props.workDocuments
        for (let i = 0; i < workDocuments.length; i++) {
            let key = 'img' + unicKey++;
            workDocuments[i]['key'] = key;
            workDocuments[i]['filename'] = workDocuments[i]['filename'].replace("public/", "");;
            this.state[key] = ScreenWidth * 0.8;
        }
        this.workDocuments = workDocuments;
        this.sizeImage(workDocuments);
    }
    sizeImage = (workDocuments) => {
        var self = this;
        let appServerURl = AppUtils.getAppServerURL();
        workDocuments.forEach(function (doc) {
            Image.getSize(appServerURl + doc.filename, (imgWidth, imgHeight) => {
                let obj = {};
                obj[doc.key] = ScreenWidth * 0.8 / imgWidth * imgHeight
                self.setState(obj)
            }, () => {
                doc.isError = true;
                let obj = {};
                obj[doc.key] = 200;
                self.setState(obj)
            });
        })
    }
    render() {
        let self = this;
        let workDocuments = this.workDocuments
        let images = [];
        let appServerURl = AppUtils.getAppServerURL();
        workDocuments.forEach(function (doc) {
            if (doc.isError) {
                images.push(
                    <Image source={require('../../images/placeholder1.png')} style={[styles.imageContainer, { height: self.state[doc.key] }]} key={doc.key} />
                )
            } else {
                images.push(
                    <Image source={{ uri: appServerURl + doc.filename }} style={[styles.imageContainer, { height: self.state[doc.key] }]} key={doc.key} />
                )
            }

        });

        return (
            <View style={styles.imagesViewContainer}>
                {images}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imagesViewContainer: {
        flex: 1,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    imageContainer: {
        margin: 10,
        borderWidth: 1,
        width: ScreenWidth * 0.8,
        borderColor: '#657383',
        borderRadius: 10
    }
})

