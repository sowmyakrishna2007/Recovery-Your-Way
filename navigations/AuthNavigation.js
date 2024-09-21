import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/login';
import Register from '../screens/register';
import BottomNavigator from './HomeNavigation';
import DrawerNavigator from './HomeNavigation';
import Reset from '../screens/reset';
const Stack = createStackNavigator();
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import MoreInfo from '../screens/MoreInfo';
export default function AuthNavigator() {
    
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                
                headerTintColor: '#05532b',
                gestureEnabled: false,
                headerBackTitleVisible: false,
                headerTitleStyle: {
                    fontFamily: 'Poppins_400Regular', // Custom font for header title
                    fontSize: 15,
                  },
            }}>
            <Stack.Screen name="Login" component={Login} options={{
                headerTitle: 'Login',
                headerShown: false,
            }}/>

<Stack.Screen name="Reset" component={Reset} options={{
    headerTitle: 'Reset Password',
            }}/>
            <Stack.Screen name="Register" component={Register} options={{headerTitle: 'Register',}}/>
            <Stack.Screen name="More Info" component={MoreInfo} options={{headerTitle: 'More Info',}}/>

            

        </Stack.Navigator>
    )
}
