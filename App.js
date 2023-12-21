import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/auth/LoginScreen.js";
import RegisterScreen from "./screens/auth/RegisterScreen.js";
import HomeScreen from "./screens/HomeScreen.js";
import ListScreen from "./screens/ListScreen.js";
import AddScreen from "./screens/AddScreen.js";
import ConditionScreen from "./screens/ConditionScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import StockScreen from "./screens/StockScreen.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/Firebase.jsx";

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

import CustomHeader from "./atoms/CustomHeader.js";

function InsideLayout({ navigation }) {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <InsideStack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{
          header: ({ navigation }) => (
            <CustomHeader title="Alle Donaties" navigation={navigation} />
          ),
        }}
      />
      <InsideStack.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          header: ({ navigation }) => (
            <CustomHeader title="Donatie Aanmaken" navigation={navigation} />
          ),
        }}
        />
      <InsideStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          header: ({ navigation }) => (
            <CustomHeader title="Profiel" navigation={navigation} />
          ),
        }}
      />
      <InsideStack.Screen
        name="ConditionScreen"
        component={ConditionScreen}
        options={{
          header: ({ navigation }) => (
            <CustomHeader title="Voorwaarden" navigation={navigation} />
          ),
        }}
      />
      <InsideStack.Screen
        name="StockScreen"
        component={StockScreen}
        options={{
          header: ({ navigation }) => (
            <CustomHeader title="Magazijn" navigation={navigation} />
          ),
        }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        )}

        {/* <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
