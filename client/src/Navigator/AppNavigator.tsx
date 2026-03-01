import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screen/HomeScreen";
import DomeScreen from "../screen/DomeScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dome" component={DomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}