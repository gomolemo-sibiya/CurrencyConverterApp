import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Pages/Login";
import Converter from "./Pages/Converter";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";

const Stack = createStackNavigator();

const CoreStack = createStackNavigator();

function CoreLayout() {
  return (
    <CoreStack.Navigator>
      <CoreStack.Screen
        name="Convertor"
        component={Converter}
        options={{ headerShown: false }}
      />
    </CoreStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Core"
            component={CoreLayout}
            options={{ headerShown: false }}
          />
         ) : ( 
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          /> 
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
