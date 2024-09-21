import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/login';
import Register from '../screens/register';
import recoveryFocus from '../screens/recovery-focus';
const Stack = createStackNavigator();
import Home from '../screens/home';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
export default function PillarsNavigator() {
    
    return (
        <Stack.Navigator
            initialRouteName="home"
            screenOptions={{
                headerTitle: '',
                headerTintColor: '#05532b',
                headerBackTitleVisible: false,
                    
                    headerTitleStyle: {
                        fontFamily: 'Poppins_400Regular', // Custom font for header title
                        fontSize: 15,
                      },
                
            }}>
            <Stack.Screen name="recoveryFocus" component={recoveryFocus}/>
            <Stack.Screen name="home" component={Home}/>

        </Stack.Navigator>
    )
}
