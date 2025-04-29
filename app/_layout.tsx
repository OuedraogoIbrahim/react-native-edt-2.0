import { AuthProvider } from "@/context/AuthContext";
import { AppContext } from "@/theme/AppContext";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const appContext = useMemo(() => {
    return { isDarkTheme, setIsDarkTheme };
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <PaperProvider>
        <AppContext.Provider value={appContext}>
          <Stack
            screenOptions={
              {
                // headerRight: () => (
                //   <Appbar.Action icon="refresh" onPress={handleRefresh} />
                // ),
              }
            }
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: true,
                title: "Page d'accuel",
              }}
            />

            <Stack.Screen
              name="register"
              options={{
                headerShown: true,
                title: "Inscription",
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: true,
                title: "Connexion",
              }}
            />
            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AppContext.Provider>
      </PaperProvider>
    </AuthProvider>
  );
}
