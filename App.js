import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.js'
import LoginScreen from './screens/LoginScreen.js'
import ListScreen from './screens/ListScreen.js'
import AddScreen from './screens/AddScreen.js'
import RegisterScreen from './screens/RegisterScreen.js'
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig.js';
import { syncLocalPosts } from './NetInfo.js';
const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomeScreen" component={HomeScreen} options={{
        headerShown: false
      }}/>

      <InsideStack.Screen name="ListScreen" component={ListScreen} options={{
        headerTitleAlign: 'flex-start',
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTintColor: '#FA9248',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      
      }}/>
      <InsideStack.Screen name="AddScreen" component={AddScreen} options={{
        headerTitleAlign: 'flex-start',
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTintColor: '#FA9248',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      
      }}/>  
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    syncLocalPosts();
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, [])

  return (
    <NavigationContainer >
      <Stack.Navigator  initialRouteName='LoginScreen'>
       {user ? (
        <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown: false }} />
       ) : (
        <Stack.Group>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false }}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false }}/>
        </Stack.Group>
       )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}