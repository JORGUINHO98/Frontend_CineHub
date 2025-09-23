// App.tsx
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import SearchScreen from "./screens/Search";
import ProfileScreen from "./screens/Profile";
import { COLORS } from "./config/config";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS?.background ?? "#000",
      }}
    >
      <Text style={{ fontSize: 72, marginBottom: 16 }}>🎬</Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: COLORS?.primary ?? "#0f0",
          marginBottom: 20,
        }}
      >
        CineHub
      </Text>
      <ActivityIndicator color={COLORS?.primary ?? "#0f0"} size="large" />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
          tabBarLabel: "Inicio",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🔍</Text>,
          tabBarLabel: "Buscar",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>👤</Text>,
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

function AppNav() {
  const { user, loading } = useContext(AuthContext);

  // DEBUG: imprime el estado de auth para ver qué ocurre en tiempo real
  // (si usas Expo, verás esto en la consola Metro)
  // eslint-disable-next-line no-console
  console.log("[AppNav] auth state:", { loading, user });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
