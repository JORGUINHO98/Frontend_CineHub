// src/screens/Settings.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../config/config";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const handleClearCache = () => {
    Alert.alert("🧹 Limpieza", "La caché ha sido limpiada con éxito.");
  };

  const handleHelp = () => {
    Alert.alert("ℹ️ Ayuda", "Aquí puedes agregar enlaces o soporte.");
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}> ← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Configuración</Text>
      </View>

      <TouchableOpacity style={styles.option} onPress={handleClearCache}>
        <Text style={styles.optionText}> Limpiar caché</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleHelp}>
        <Text style={styles.optionText}>  Ayuda</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, styles.logoutButton]}
        onPress={signOut}
      >
        <Text style={[styles.optionText, { color: "#fff" }]}>
            Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { color: COLORS.primary, fontSize: 18, marginRight: 12 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: COLORS.primary },

  option: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  optionText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  logoutButton: { backgroundColor: COLORS.error, borderWidth: 0 },
});
