import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text as RNText } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import ErrorsAuthValidation from "@/component/common/ErrorsAuthValidation";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/api/auth";
import useFetch from "@/hooks/useFetch";
import { getFilieres } from "@/api/filieres";
import {
  Errors,
  FiliereItem,
  FormData,
} from "@/component/register_steps/types";
import Step1 from "@/component/register_steps/Step1";
import Step2 from "@/component/register_steps/Step2";
import Step3 from "@/component/register_steps/Step3";
import Step4 from "@/component/register_steps/Step4";
import Step5 from "@/component/register_steps/Step5";
import { RegisterForPushNotificationsAsync } from "@/services/notifications";

const sendWelcomeNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Bienvenue",
      body: "Votre compte a été créé avec succès !",
      data: { screen: "dashboard" },
    },
    trigger: null, // immédiat
  });
};

const step1Schema = Yup.object().shape({
  role: Yup.string().required("Le rôle est requis"),
});

const step2Schema = Yup.object().shape({
  nom: Yup.string().required("Le nom est requis"),
  prenom: Yup.string().required("Le prénom est requis"),
  email: Yup.string().email("Email invalide").required("L’email est requis"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis"),
  tel: Yup.string()
    .required("Le numéro de téléphone est requis")
    .matches(
      /^[0-9]{8}$/,
      "Le numéro de téléphone doit être composé de 8 chiffres"
    ),
  sexe: Yup.string()
    .oneOf(["M", "F"], "Le sexe doit être M ou F")
    .required("Le sexe est requis"),
  date_naissance: Yup.string()
    .required("La date de naissance est requise")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),
});

const step3Schema = Yup.object().shape({
  filiere: Yup.string().required("La filière est requise"),
});

const getStep4Schema = (filieres: FiliereItem[], filiereId: string) => {
  const selectedFiliere = filieres?.find((f) => String(f.id) === filiereId);
  const validNiveauIds = selectedFiliere
    ? selectedFiliere.niveaux.map((n) => String(n.id))
    : [];
  return Yup.object().shape({
    niveau: Yup.string()
      .required("Le niveau est requis")
      .oneOf(validNiveauIds, "Le niveau sélectionné est invalide"),
  });
};

const fullSchema = Yup.object().shape({
  role: Yup.string().required("Le rôle est requis"),
  nom: Yup.string().required("Le nom est requis"),
  prenom: Yup.string().required("Le prénom est requis"),
  email: Yup.string().email("Email invalide").required("L’email est requis"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis"),
  tel: Yup.string()
    .matches(
      /^[0-9]{8}$/,
      "Le numéro de téléphone doit être composé de 8 chiffres"
    )
    .required("Le numéro de téléphone est requis"),
  sexe: Yup.string()
    .oneOf(["M", "F"], "Le sexe doit être M ou F")
    .required("Le sexe est requis"),
  date_naissance: Yup.string().required("La date de naissance est requise"),
  filiere: Yup.string().required("La filière est requise"),
  niveau: Yup.string().required("Le niveau est requis"),
});

const Register = () => {
  const nav = useRouter();
  const { isConnected } = useContext(AuthContext);
  const { register } = useAuth();

  const [errors, setErrors] = useState<Errors>({ errors: {} });
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [filiereId, setFiliereId] = useState<string>("");

  const [expoToken, setExpoToken] = useState<string | undefined>("");

  useEffect(() => {
    if (isConnected) {
      nav.replace("/dashboard");
    }
    const getExpoToken = async () => {
      const token = await RegisterForPushNotificationsAsync();
      setExpoToken(token);
    };
    getExpoToken();
  }, []);

  const {
    data: filieres,
    loading: filieresLoading,
    error: filieresError,
    refetch: refetchFiliere,
  } = useFetch<FiliereItem[]>(getFilieres);

  const initialValues: FormData = {
    role: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    tel: "",
    sexe: "M" as "M" | "F",
    date_naissance: "",
    filiere: "",
    niveau: "",
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const StepIndicator: React.FC = () => (
    <View style={styles.stepContainer}>
      {[1, 2, 3, 4, 5].map((num) => (
        <View key={num} style={styles.stepCircleContainer}>
          <LinearGradient
            colors={
              step >= num ? ["#34acb4", "#2a8b92"] : ["#E0E0E0", "#B0B0B0"]
            }
            style={[styles.stepCircle, step > num && styles.completedStep]}
          >
            <RNText style={styles.stepNumber}>{num}</RNText>
          </LinearGradient>
          {num < 5 && <View style={styles.stepLine} />}
        </View>
      ))}
    </View>
  );

  const getValidationSchema = (currentStep: number, filiereId: string) => {
    switch (currentStep) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return getStep4Schema(filieres || [], filiereId);
      case 5:
        return fullSchema;
      default:
        return fullSchema;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(step, filiereId)}
      onSubmit={async (values) => {
        if (step < 5) {
          nextStep();
        } else {
          setSubmitted(true);
          try {
            setErrors({ errors: {} });
            setErrorMessage(false);
            await register(values, expoToken);
            await sendWelcomeNotification();
            nav.replace("/dashboard");
          } catch (error) {
            setErrors(error as Errors);
            setErrorMessage(true);
            setSubmitted(false);
          }
        }
      }}
    >
      {(formik) => (
        <ScrollView contentContainerStyle={styles.container}>
          {/* <StepIndicator /> */}
          <View style={styles.contentContainer}>
            {!submitted ? (
              <>
                {step === 1 && <Step1 formik={formik} styles={styles} />}
                {step === 2 && (
                  <Step2 formik={formik} prevStep={prevStep} styles={styles} />
                )}
                {step === 3 && (
                  <Step3
                    formik={formik}
                    filieres={filieres}
                    filieresLoading={filieresLoading}
                    filieresError={filieresError}
                    setFiliereId={setFiliereId}
                    prevStep={prevStep}
                    styles={styles}
                  />
                )}
                {step === 4 && (
                  <Step4
                    formik={formik}
                    filieres={filieres}
                    filieresLoading={filieresLoading}
                    prevStep={prevStep}
                    styles={styles}
                  />
                )}
                {step === 5 && (
                  <Step5
                    formik={formik}
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    prevStep={prevStep}
                    styles={styles}
                  />
                )}
                <View style={styles.signupPrompt}>
                  <RNText style={styles.signupText}>
                    Vous avez un compte ?{" "}
                    <RNText
                      style={styles.signupLink}
                      onPress={() => nav.navigate("/login")}
                    >
                      Se connecter
                    </RNText>
                  </RNText>
                </View>
              </>
            ) : (
              <View style={styles.pendingTreatment}>
                <ActivityIndicator
                  color="#34acb4"
                  size={32}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#1F2A44",
                  }}
                >
                  Vos données sont en cours de traitement...
                </Text>
              </View>
            )}
          </View>

          {errorMessage ? (
            <ErrorsAuthValidation
              errors={errors}
              visible={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          ) : null}
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F0F2F5",
  },
  contentContainer: {
    marginTop: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  stepCircleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  completedStep: {
    elevation: 8,
  },
  stepNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  customCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  cardInner: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleIcon: {
    marginRight: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  rnInput: {
    marginBottom: 10,
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "#34acb4",
    paddingHorizontal: 0,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderBottomColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  sexeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  sexeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    width: 90,
    alignItems: "center",
  },
  sexeButtonSelected: {
    backgroundColor: "#34acb4",
  },
  sexeText: {
    fontSize: 16,
    color: "#666",
  },
  sexeTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  optionsContainer: {
    marginVertical: 20,
  },
  optionButton: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  optionCard: {
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    width: "100%",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: "#34acb4",
    borderRadius: 12,
    paddingVertical: 5,
    elevation: 3,
    marginVertical: 10,
  },
  backButton: {
    borderRadius: 12,
    borderColor: "#34acb4",
    paddingVertical: 5,
    marginVertical: 10,
  },
  infoButton: {
    borderRadius: 12,
    borderColor: "#34acb4",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: "95%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInfo: {
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  modalButton: {
    backgroundColor: "#34acb4",
    borderRadius: 12,
    paddingVertical: 5,
  },
  signupPrompt: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#34acb4",
    fontWeight: "bold",
  },
  pendingTreatment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Register;
