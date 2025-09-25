import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../config/config";
import { movieService } from "../services/api";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);

  // estados para estadísticas
  const [favCount, setFavCount] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const favs = await movieService.getFavorites();
        const seen = await movieService.getWatched();
        setFavCount(favs?.length || 0);
        setWatchedCount(seen?.length || 0);
      } catch (err) {
        console.error("Error cargando estadísticas de perfil:", err);
      }
    })();
  }, []);

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "?";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header con gradiente */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.nombre, user?.email)}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
          <Text style={styles.userEmail}>{user?.email || "—"}</Text>
        </View>
      </LinearGradient>

      {/* Información del perfil */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{user?.email || "—"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🆔 ID de Usuario</Text>
              <Text style={styles.infoValue}>{user?.id || "—"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Miembro desde</Text>
              <Text style={styles.infoValue}>
                {formatDate(user?.fecha_registro)}
              </Text>
            </View>

            {user?.telefono && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📱 Teléfono</Text>
                <Text style={styles.infoValue}>{user.telefono}</Text>
              </View>
            )}

            {user?.pais && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🌍 País</Text>
                <Text style={styles.infoValue}>{user.pais}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Suscripción */}
        {user?.suscripcion_activa && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suscripción Activa</Text>
            <View style={styles.subscriptionCard}>
              <Text style={styles.subscriptionPlan}>
                {user.suscripcion_activa.plan?.nombre || "Plan Básico"}
              </Text>
              <Text style={styles.subscriptionStatus}>
                Estado: {user.suscripcion_activa.estado || "Activa"}
              </Text>
            </View>
          </View>
        )}

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{favCount}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{watchedCount}</Text>
              <Text style={styles.statLabel}>Vistas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round((watchedCount * 2) / 60)}h
              </Text>
              <Text style={styles.statLabel}>Horas (estimado)</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️ Configuración</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center" as const,
  },
  avatarContainer: {
    alignItems: "center" as const,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold" as const,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500" as const,
    flex: 2,
    textAlign: "right" as const,
  },
  subscriptionCard: {
    backgroundColor: COLORS.primary + "20",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: COLORS.primary,
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: "center" as const,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  settingsButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
};
