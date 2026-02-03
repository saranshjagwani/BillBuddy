// src/app/App.tsx
 
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import AppRouter from "../router/AppRouter";


export default function App() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <AppRouter />
    </>
  );
}
