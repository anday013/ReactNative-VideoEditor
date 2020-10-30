import React from 'react'
import { View, Text } from 'react-native'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import Filter from '../Filter'
import Timeline from '../Timeline'
import Home from '../Home'
const { Navigator, Screen } = createStackNavigator();
export default function index() {
    return (
        <NavigationContainer>
            <Navigator>
                <Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Screen name="FilterScreen" component={Filter} />
                <Screen name="TrimScreen" component={Timeline} />
            </Navigator>
        </NavigationContainer>
    )
}
