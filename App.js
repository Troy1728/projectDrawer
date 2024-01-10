import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./components/Firebase.jsx";

import LoginScreen from "./screens/auth/LoginScreen.js";
import RegisterScreen from "./screens/auth/RegisterScreen.js";

import ListScreen from "./screens/donations/ListScreen.js";
import AddScreen from "./screens/donations/AddScreen.js";
import EditScreen from "./screens/donations/EditScreen.js";
import AcceptenceScreen from "./screens/donations/AcceptenceScreen.js";

import StockScreen from "./screens/stock/StockScreen.js";

import ConditionScreen from "./screens/rules/ConditionScreen.js";

import ProfileScreen from "./screens/profile/ProfileScreen.js";

const Stack = createStackNavigator();
const ListStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{
          headerShown: true,
          headerTitle: "DONATOR",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          headerShown: true,
          headerTitle: "TOEVOEGEN",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name="EditScreen"
        component={EditScreen}
        options={{
          headerShown: true,
          headerTitle: "BEWERKEN",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name="AcceptenceScreen"
        component={AcceptenceScreen}
        options={{
          headerShown: true,
          headerTitle: "ACCEPTEREN",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ConditionStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConditionScreen"
        component={ConditionScreen}
        options={{
          headerShown: true,
          headerTitle: "VOORWAARDEN",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const StockStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StockScreen"
        component={StockScreen}
        options={{
          headerShown: true,
          headerTitle: "VOORRAAD",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "PROFIEL",
          headerTitleAlign: "center",
          headerTintColor: "#FA9248",
          headerStyle: {
            backgroundColor: "#F1F1F1",
            shadowColor: "#fff",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const Bottom = createMaterialBottomTabNavigator();
const InsideApp = () => {
  return (
    <Bottom.Navigator>
      <Bottom.Screen name="Donaties" component={ListStackScreen} />
      <Bottom.Screen name="Voorwaarden" component={ConditionStackScreen} />
      <Bottom.Screen name="Voorraad" component={StockStackScreen} />
      <Bottom.Screen name="Profile" component={ProfileStackScreen} />
    </Bottom.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      //console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      {user ? <InsideApp /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);
