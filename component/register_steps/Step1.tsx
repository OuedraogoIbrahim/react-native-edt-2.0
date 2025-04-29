import React from "react";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import { Button, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FormikProps } from "formik";
import { FontAwesome5 } from "@expo/vector-icons"; // Icônes modernes et variées
import { FormData } from "./types";

interface Step1Props {
  formik: FormikProps<FormData>;
  styles: any; // À améliorer avec un type strict si nécessaire
}

const OptionButton: React.FC<{
  label: string;
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
  styles: any;
  iconName: string; // Nom de l'icône pour chaque rôle
}> = ({ label, value, selectedValue, onPress, styles, iconName }) => (
  <TouchableOpacity style={styles.optionButton} onPress={() => onPress(value)}>
    <LinearGradient
      colors={
        selectedValue === value
          ? ["#34acb4", "#2a8b92"]
          : ["#F8F9FA", "#E9ECEF"]
      }
      style={styles.optionCard}
    >
      <View style={styles.optionContent}>
        <FontAwesome5
          name={iconName}
          size={30} // Taille augmentée pour une meilleure visibilité
          color={selectedValue === value ? "#FFFFFF" : "#666"}
          style={styles.optionIcon}
        />
        <RNText
          style={[
            styles.optionText,
            selectedValue === value && styles.optionTextSelected,
          ]}
        >
          {label}
        </RNText>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const Step1: React.FC<Step1Props> = ({ formik, styles }) => (
  <View>
    <LinearGradient
      colors={["#34acb4", "#2a8b92"]}
      style={styles.titleContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <FontAwesome5
        name="user-graduate"
        size={28}
        color="#FFFFFF"
        style={styles.titleIcon}
      />
      <Text style={styles.title}>Choix du Rôle</Text>
    </LinearGradient>
    <View style={styles.optionsContainer}>
      {[
        // {
        //   label: "Enseignant",
        //   value: "enseignant",
        //   icon: "chalkboard-teacher",
        // },
        { label: "Parent", value: "parent", icon: "user-tie" },
        { label: "Étudiant", value: "etudiant", icon: "user-graduate" },
      ].map((item) => (
        <OptionButton
          key={item.value}
          label={item.label}
          value={item.value}
          selectedValue={formik.values.role}
          onPress={(value) => formik.setFieldValue("role", value)}
          styles={styles}
          iconName={item.icon}
        />
      ))}
    </View>
    {formik.touched.role && formik.errors.role && (
      <RNText style={styles.errorText}>{formik.errors.role}</RNText>
    )}
    <Button
      mode="contained"
      onPress={() => formik.handleSubmit()}
      style={styles.nextButton}
      disabled={!formik.isValid}
    >
      Suivant
    </Button>
  </View>
);

export default Step1;
