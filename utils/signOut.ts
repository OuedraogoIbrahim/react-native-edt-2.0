import { Alert } from "react-native";
import { supabase } from "./supabase";

const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Erreur lors de la déconnexion");
    }
  };