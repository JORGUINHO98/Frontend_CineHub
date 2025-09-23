// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ nuevo import
import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import MovieDetailScreen from "../screens/MovieDetail";

const Stack = createNativeStackNavigator(); // ✅ en vez de createStackNavigator

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
    </Stack.Navigator>
  );
}
