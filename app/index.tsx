import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "@/context/AuthContext";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (isConnected) {
          setTimeout(() => {
            router.replace("/dashboard");
          }, 6000);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router, isConnected]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color="#10b981" />
        </Animatable.View>
        <Text style={styles.loaderText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (isConnected) {
    return (
      <SafeAreaView style={styles.redirectSafeArea}>
        <View style={styles.redirectContainer}>
          <Animatable.Text animation="fadeInDown" style={styles.redirectTitle}>
            Bienvenue sur Planify !
          </Animatable.Text>
          <Text style={styles.redirectText}>
            Vous êtes connecté. Redirection vers votre tableau de bord...
          </Text>
          <Text style={styles.redirectSubtext}>
            Préparez-vous à organiser vos emplois du temps avec efficacité et
            simplicité.
          </Text>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.loaderContainer}
          >
            <ActivityIndicator size="large" color="#10b981" />
          </Animatable.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
          <Text style={styles.title}>Bienvenue dans Planify</Text>
          <Text style={styles.subtitle}>
            Gérez vos emplois du temps avec simplicité
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.Text
          animation="fadeIn"
          delay={400}
          style={styles.footerText}
        >
          Planify © 2025 - Organisez votre temps
        </Animatable.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1f2937",
  },
  redirectSafeArea: {
    flex: 1,
    backgroundColor: "#0f766e", // Softer dark teal for a more pleasant look
  },
  loaderContainer: {
    marginBottom: 16,
    marginTop: 24,
  },
  loaderText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  redirectContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  redirectTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  redirectText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  redirectSubtext: {
    color: "#d1d5db",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 18,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  registerButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  loginButtonText: {
    color: "#10b981",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 16,
  },
});
