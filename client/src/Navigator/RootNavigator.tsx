import { useState } from "react";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
