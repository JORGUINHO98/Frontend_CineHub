// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import AppNavigator from "./navegation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </MovieProvider>
    </AuthProvider>
  );
}
