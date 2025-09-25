import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import MovieDetailScreen from "../screens/MovieDetail";
const Stack = createNativeStackNavigator();
import { RootStackParamList } from "../types";
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs principales */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Detalle de película */}
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
    </Stack.Navigator>
  );
}
