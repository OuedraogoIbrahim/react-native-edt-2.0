import { AxiosError } from "axios";
import configApi from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

interface FormData {
  role: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  tel: string;
  sexe: "M" | "F";
  date_naissance: string;
  filiere: string;
  niveau: string;
}

interface Login {
  email: string;
  password: string;
}

// Créez un hook personnalisé pour les opérations d'authentification
export function useAuth() {
  const { setUser, setToken, setIsConnected } = useContext(AuthContext);
  const router = useRouter();

  const register = async (formData: FormData , expoToken :string|undefined = "") => {
    
    try {
      const response = await configApi.post("/register", {
        ...formData,
        expo_token: expoToken
      });

      if (response.status == 200) {
        const data = response.data;
        const user = data.user;
        const token = data.token;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
        setIsConnected(true);
      }
    } catch (error) {
      const err = error as AxiosError;
      throw err.response?.data || new Error("Erreur lors de l'inscription");
    }
  };

  const login = async (formData: Login, expoToken :string|undefined = "") => {

    try {
      const response = await configApi.post("/login", {
        ...formData,
         expo_token: expoToken
        });

      if (response.status == 200) {
        const data = response.data;
        
        const token = data.token;
        const user = data.user;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
        setIsConnected(true);
      }
    } catch (error) {
      const err = error as AxiosError;
      throw err.response?.data || new Error("Erreur lors de la connexion");
      
    }
  };

  const logout = async () => {
    try {
      const response = await configApi.post("/logout");

      if (response.status == 200) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setToken("");
        setUser(null);
        setIsConnected(false);
      }
    } catch (error) {
      const err = error as AxiosError;
      throw err.response?.data || new Error("Erreur lors de la Deconnexion");
    }
  };

  return { register, login, logout };
}
