import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import Login from './screens/Login.js'
import List from './screens/List.js'
import Add from './screens/Add.js'
import Register from './screens/Register.js'
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig.js';
import { syncLocalPosts } from './NetInfo.js';
const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="List" component={List} options={{
        headerTitleAlign: 'flex-start',
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTintColor: '#FA9248',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      
      }}/>
      <InsideStack.Screen name="Add" component={Add} options={{
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
       {user ? (
        <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown: false }} />
       ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false }}/>
          <Stack.Screen name="Register" component={Register} options={{headerShown: false }}/>

        </Stack.Group>
       )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
