import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "./supabase";
import { Alert } from "react-native";

// Fonction pour extraire les paramètres du fragment
const parseFragmentParams = (url: string) => {
  const fragment = url.split("#")[1];
  if (!fragment) return {};

  const params: { [key: string]: string } = {};
  fragment.split("&").forEach((param) => {
    const [key, value] = param.split("=");
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });
  return params;
};

// Fonction générique pour se connecter avec un fournisseur OAuth
export const signInWithProvider = async (
  provider: "google" | "facebook" | "github" ,
  userId? : number | null
): Promise<{ token: string; user: any }> => {
  try {
    // Créer l'URI de redirection pour l'authentification
    const redirectUri = makeRedirectUri({
      scheme: "myapp",
      path: "auth",
    });
    console.log("Redirect URI:", redirectUri);

    // Lancer le processus d'authentification OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.error("Erreur signInWithOAuth:", error);
      throw error;
    }

    // Ouvrir le navigateur pour l'authentification
    const result = await WebBrowser.openAuthSessionAsync(data.url!, redirectUri);
    // console.log("WebBrowser result:", result);

    // Gérer le résultat de l'authentification
    if (result.type === "success") {
      const params = parseFragmentParams(result.url);
      // console.log("Fragment params:", params);

      if (params.access_token && params.refresh_token) {
        // Définir la session avec les tokens reçus
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        if (sessionError) {
          console.error("Erreur setSession:", sessionError);
          throw sessionError;
        }

        // Récupérer les informations de l'utilisateur
        const { user } = sessionData.session!;
        console.log("User data:", user );

        // Vérifier que provider_id existe
        if (!user.user_metadata.provider_id) {
          throw new Error("provider_id manquant dans user_metadata");
        }

        // Envoyer les données au backend Laravel
        const response = await fetch(
          "http://192.168.11.113:8000/api/auth/provider",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: provider || user.app_metadata.provider,
              provider_id: user.user_metadata.provider_id,
              device: "mobile",
              userId : userId
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur backend:", errorData);
          throw new Error(
            errorData.message ||
              "Authentification echouée"
          );
        }

        const responseData = await response.json();

        // Vérifier que la réponse contient token et user
        if (!responseData.token || !responseData.user) {
          throw new Error("Token ou données utilisateur manquants dans la réponse");
        }

        return {
          token: responseData.token,
          user: responseData.user,
        };
      } else {
        throw new Error("Tokens d'authentification manquants dans l'URL");
      }
    } else {
      throw new Error("Authentification annulée ou échouée");
    }
  } catch (error: any) {
    console.error(`Erreur lors de la connexion avec ${provider}:`, error);
    Alert.alert(
      "Erreur",
      error.message || `Une erreur est survenue lors de la connexion avec ${provider}`
    );
    throw error;
  }
};