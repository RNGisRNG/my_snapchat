import React from 'react';
import MainPage from './src/Views/Main';
import {StyleSheet} from 'react-native';
import Register from './src/Views/Register';
import LoginPage from './src/Views/Login';
import AllUsers from './src/Views/AllUsers';
import Friends from './src/Views/Friends';
import SnapReceive from './src/Views/SnapReceive';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={MainPage} />
        <Stack.Screen name="AllUsers" component={AllUsers} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="SnapReceived" component={SnapReceive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
