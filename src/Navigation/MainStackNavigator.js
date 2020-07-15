import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Screens/Login.js';
import Home from '../Screens/Home.js';
import MyTrips from '../Screens/MyTrips.js';

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' 
        screenOptions={{
          gestureEnabled: true
        }}>
            <Stack.Screen name='Login' component={Login}
            options={{
                headerShown: false
            }}
            />
            <Stack.Screen name='Home' component={Home}
            options={{
                headerShown: false
            }}
            />
            <Stack.Screen name='My Trips' component={MyTrips}
            options={{
                headerShown: false
            }}
            />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator;