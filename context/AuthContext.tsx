import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  token: string | null;
  isConnected: boolean;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isConnected: true,
  setUser: () => {},
  setToken: () => {},
  setIsConnected: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken);
        setIsConnected(storedUser ? true : false);
      } catch (error) {
        console.error("Error lors de la récuperation des données:", error);
      }
    };

    getUserData();
  }, []);

  const values = {
    user,
    token,
    isConnected,
    setUser,
    setToken,
    setIsConnected,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
