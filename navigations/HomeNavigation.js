import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react'
import Home from '../screens/home';
import Settings from '../screens/settings';
import PillarsNavigator from './PillarsNavigation';
import { useAuth } from '../AuthContext';
import CompletedTasks from '../screens/completed_tasks';
import CalendarScreen from '../screens/CalendarScreen';
const Drawer = createDrawerNavigator();
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import CustomDrawerContent from '../CustomDrawerContent';
import Forum from '../screens/Forum';
export default function DrawerNavigator() {
    
    const {user} = useAuth();
    return (
        <Drawer.Navigator initialRouteName="Home" 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
            drawerLabelStyle: {
              fontFamily: 'Poppins_400Regular', 
              fontSize: 14
            },
            headerTitleStyle: {
                fontFamily: 'Poppins_400Regular', 
                fontSize: 15,
              },}}>
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: true,
                    headerTitle: 'Home',
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    
                    headerTintColor: '#05532b',
                    drawerActiveBackgroundColor: '#e1f4ea',
                    drawerActiveTintColor: 'black'
                }}/>

            <Drawer.Screen
                name="Upcoming Tasks"
                component={Settings}
                options={{
                    headerShown: true,
                    headerTitle: 'Upcoming Tasks',
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    
                    headerTintColor: '#05532b',
                    drawerActiveBackgroundColor: '#e1f4ea',
                    drawerActiveTintColor: 'black'

                }}/>
                <Drawer.Screen
                name="Completed Tasks"
                component={CompletedTasks}
                options={{
                    headerShown: true,
                    headerTitle: 'Completed Tasks',
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                   
                    headerTintColor: '#05532b',
                    drawerActiveBackgroundColor: '#e1f4ea',
                    drawerActiveTintColor: 'black'

                }}/>
                <Drawer.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Calendar',
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    
                    headerTintColor: '#05532b',
                    drawerActiveBackgroundColor: '#e1f4ea',
                    drawerActiveTintColor: 'black'

                }}/>
                
        </Drawer.Navigator>
    )
}
