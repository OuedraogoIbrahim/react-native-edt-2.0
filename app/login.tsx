import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import IMAGES from "@/assets/images";
import { COLORS, FONTS } from "@/constants";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/api/auth";
import { AuthContext } from "@/context/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import ErrorsAuthValidation from "@/component/common/ErrorsAuthValidation";
import { signInWithProvider } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterForPushNotificationsAsync } from "@/services/notifications";
import * as Notifications from "expo-notifications";

interface Errors {
  errors: {
    [key: string]: string[];
  };
}

const sendWelcomeNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Bienvenue",
      body: "Heureux de vous revoir parmi nous !",
      data: { screen: "dashboard" },
    },
    trigger: null, // immédiat
  });
};

const LoginScreen = () => {
  const { colors } = useTheme();
  const { isConnected, setUser, setToken, setIsConnected } =
    useContext(AuthContext);
  const { login } = useAuth();
  const navigation = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({
    errors: {},
  });
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [expoToken, setExpoToken] = useState<string | undefined>("");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("L'email n'est pas valide")
      .required("L'email est requis"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .required("Le mot de passe est requis"),
  });

  useEffect(() => {
    if (isConnected) {
      navigation.replace("/dashboard");
    }

    const getExpoToken = async () => {
      const token = await RegisterForPushNotificationsAsync();
      setExpoToken(token);
    };
    getExpoToken();
  }, []);

  const handleOAuthSignIn = async (
    provider: "google" | "facebook" | "github"
  ) => {
    try {
      const { token, user } = await signInWithProvider(provider);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsConnected(true);

      navigation.replace("/dashboard");
    } catch (error) {
      console.error(`Erreur dans handleOAuthSignIn (${provider}):`, error);
    }
  };

  return (
    <ScrollView>
      <View style={{ marginHorizontal: 20 }}>
        <View></View>
        <Text
          style={{
            marginTop: 100,
            textAlign: "center",
            fontFamily: FONTS.MONTSERRAT_BOLD,
            fontSize: 24,
            color: colors.text,
          }}
        >
          Hello Again!
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: FONTS.MONTSERRAT,
            fontSize: 20,
            marginTop: 20,
            marginHorizontal: 70,
            color: colors.text,
          }}
        >
          Welcome back you've been missed!
        </Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              setLoading(true);
              setErrors({ errors: {} });
              setErrorMessage(false);
              await login(values, expoToken);
              await sendWelcomeNotification();

              navigation.replace("/dashboard");
            } catch (error) {
              console.log(error);

              setErrors(error as Errors);
              setErrorMessage(true);
            } finally {
              setLoading(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <TextInput
                style={{
                  backgroundColor: COLORS.WHITE,
                  height: 50,
                  maxHeight: 50,
                  minHeight: 50,
                  fontSize: 16,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  marginTop: 50,
                  fontFamily: FONTS.MONTSERRAT,
                }}
                placeholder="Email"
                placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
                cursorColor={COLORS.ORANGE}
                selectionColor={COLORS.ORANGE}
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
                value={values.email}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={{ marginTop: 5, marginStart: 5, color: "red" }}>
                  {errors.email}
                </Text>
              )}
              <TextInput
                style={{
                  backgroundColor: COLORS.WHITE,
                  height: 50,
                  maxHeight: 50,
                  minHeight: 50,
                  fontSize: 16,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  marginTop: 20,
                  fontFamily: FONTS.MONTSERRAT,
                }}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
                cursorColor={COLORS.ORANGE}
                selectionColor={COLORS.ORANGE}
                onBlur={handleBlur("password")}
                onChangeText={handleChange("password")}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={{ marginTop: 5, marginStart: 5, color: "red" }}>
                  {errors.password}
                </Text>
              )}
              <Text
                style={{
                  fontFamily: FONTS.MONTSERRAT,
                  textAlign: "right",
                  marginTop: 20,
                  color: colors.text,
                }}
              >
                Mot de passe oublié?
              </Text>
              <TouchableOpacity
                style={{
                  height: 50,
                  backgroundColor: COLORS.ORANGE,
                  marginTop: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text
                  style={{
                    fontFamily: FONTS.MONTSERRAT_SEMI_BOLD,
                    color: COLORS.WHITE,
                    fontSize: 16,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#34acb4"
                      size={32}
                      style={{ marginRight: 12 }}
                    />
                  ) : (
                    "Se connecter"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {errorMessage ? (
          <ErrorsAuthValidation
            errors={errors}
            visible={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        ) : null}

        <View
          style={{
            marginTop: 50,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{ flex: 0.5, height: 2, backgroundColor: COLORS.GRAY_LIGHT }}
          />
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: FONTS.MONTSERRAT,
              color: colors.text,
            }}
          >
            Se connecter avec
          </Text>
          <View
            style={{ flex: 0.5, height: 2, backgroundColor: COLORS.GRAY_LIGHT }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 50,
          }}
        >
          <TouchableOpacity
            style={{
              height: 70,
              width: 100,
              borderWidth: 3,
              borderRadius: 10,
              borderColor: COLORS.WHITE,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handleOAuthSignIn("google")}
          >
            <Image source={IMAGES.GOOGLE} style={{ height: 40, width: 40 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 70,
              width: 100,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: COLORS.WHITE,
              justifyContent: "center",
              alignItems: "center",
            }}
            // Pas de onPress pour Apple (non implémenté)
          >
            <Image source={IMAGES.APPLE} style={{ height: 40, width: 40 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 70,
              width: 100,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: COLORS.WHITE,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handleOAuthSignIn("facebook")}
          >
            <Image source={IMAGES.FACEBOOK} style={{ height: 40, width: 40 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text
            style={{ fontFamily: FONTS.MONTSERRAT_MEDIUM, color: colors.text }}
          >
            Pas de compte ?
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("/register")}
          >
            <Text
              style={{
                marginStart: 5,
                fontFamily: FONTS.MONTSERRAT_SEMI_BOLD,
                color: "orange",
              }}
            >
              S'inscrire
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
