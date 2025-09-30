// src/screens/EditProfile.tsx
import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../config/config";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditProfileScreen() {
  const { user, updateProfile } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [pais, setPais] = useState(user?.pais || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateProfile({ nombre, email, telefono, pais });
      Alert.alert("✅ Perfil actualizado");
      // Ir a la pestaña Profile dentro de MainTabs
      navigation.navigate("MainTabs" as any, { screen: "Profile" } as any);
    } catch (error: any) {
      console.error("Error actualizando perfil:", error?.message || error);
      Alert.alert("❌ Error", "No se pudo actualizar el perfil. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}> ← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>  Editar Perfil</Text>
      </View>
      <View style={styles.content}>
        {["Nombre", "Email", "Teléfono", "País"].map((label, idx) => {
          const valueMap = [nombre, email, telefono, pais];
          const setterMap = [setNombre, setEmail, setTelefono, setPais];
          const keyboardTypeMap = ["default", "email-address", "phone-pad", "default"];
          return (
            <View style={styles.inputGroup} key={idx}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={valueMap[idx]}
                onChangeText={setterMap[idx]}
                keyboardType={keyboardTypeMap[idx] as any}
                autoCapitalize={idx === 1 ? "none" : "sentences"}
              />
            </View>
          );
        })}
        <TouchableOpacity style={[styles.saveButton, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? "Guardando..." : "  Guardar Cambios"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLORS.background, flexDirection: "row", alignItems: "center" },
  backBtn: { color: COLORS.primary, fontSize: 18, marginRight: 12 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
  content: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { color: COLORS.textSecondary, fontSize: 16, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, fontSize: 16, borderRadius: 12, padding: 12 },
  saveButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, marginTop: 20, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
