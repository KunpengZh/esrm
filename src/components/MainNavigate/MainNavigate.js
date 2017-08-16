import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import {TabNavigator } from 'react-navigation';

import WorkForm from '../WorkForm/WorkForm'
import Query from '../Query/Query'
import Conf from '../Conf/Conf'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default TabNavigator(
    {
        WorkForm: {
            screen: WorkForm,
            navigationOptions: {  // 也可以写在组件的static navigationOptions内
                tabBarLabel: '派工',
                tabBarIcon: ({ tintColor, focused }) => {
                    return (
                        focused ? <FontAwesome name="user-circle" style={styles.activeicon} /> : <FontAwesome name="user-circle-o" style={styles.deactiveicon} />
                    )
                }
            }
        },
        Query: {
            screen: Query,
            navigationOptions: {
                tabBarLabel: '查询',
                tabBarIcon: ({ tintColor, focused }) => {
                    return (
                        focused ? <FontAwesome name="list" style={styles.activeicon} /> : <FontAwesome name="list-alt" style={styles.deactiveicon} />
                    )
                }
            }
        },
        Conf: {
            screen: Conf,
            navigationOptions: {
                tabBarLabel: '配置',
                tabBarIcon: ({ tintColor, focused }) => {
                    return (
                        focused ? <FontAwesome name="cog" style={styles.activeicon} /> : <FontAwesome name="gear" style={styles.deactiveicon} />
                    )
                }
            }
        },
    },
    {
        animationEnabled: true, // 切换页面时是否有动画效果
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
        swipeEnabled: true, // 是否可以左右滑动切换tab
        backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
        tabBarOptions: {
            activeTintColor: '#4F8EF7', // 文字和图片选中颜色
            inactiveTintColor: '#7f8c8d', // 文字和图片未选中颜色
            showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
            indicatorStyle: {
                height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
            },
            style: {
                backgroundColor: '#ecf0f1', // TabBar 背景色
                height: 58
            },
            labelStyle: {
                fontSize: 10, // 文字大小
            },
        },
    }
);

const styles = StyleSheet.create({
    activeicon: {
        fontSize: 22,
        color: "#157DEC"
        //color:"#1589FF"
    },
    deactiveicon: {
        fontSize: 22,
        color: "gray"
    },
});
