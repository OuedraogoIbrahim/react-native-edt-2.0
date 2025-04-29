import React from "react";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons"; // Ajout pour les icônes
import { FormikProps } from "formik";
import { FiliereItem, FormData } from "./types";

interface Step3Props {
  formik: FormikProps<FormData>;
  filieres: FiliereItem[] | null;
  filieresLoading: boolean;
  filieresError: any;
  setFiliereId: (id: string) => void;
  prevStep: () => void;
  styles: any;
}

const OptionButton: React.FC<{
  label: string;
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
  styles: any;
  iconName: string; // Ajout pour l'icône de chaque filière
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
          size={30} // Taille augmentée pour visibilité
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

const Step3: React.FC<Step3Props> = ({
  formik,
  filieres,
  filieresLoading,
  filieresError,
  setFiliereId,
  prevStep,
  styles,
}) => (
  <View>
    <LinearGradient
      colors={["#34acb4", "#2a8b92"]}
      style={styles.titleContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <FontAwesome5
        name="book-open" // Icône pour représenter les filières (livres/éducation)
        size={28}
        color="#FFFFFF"
        style={styles.titleIcon}
      />
      <RNText style={styles.title}>Choix de la Filière</RNText>
    </LinearGradient>
    {filieresLoading ? (
      <ActivityIndicator color="#34acb4" size={32} style={{ margin: 20 }} />
    ) : filieresError ? (
      <RNText style={styles.errorText}>
        Erreur lors du chargement des filières
      </RNText>
    ) : !filieres || filieres.length === 0 ? (
      <RNText style={styles.errorText}>Aucune filière disponible</RNText>
    ) : (
      <View style={styles.optionsContainer}>
        {filieres.map((filiere) => (
          <OptionButton
            key={filiere.id}
            label={filiere.nom}
            value={String(filiere.id)}
            selectedValue={formik.values.filiere}
            onPress={(value) => {
              formik.setFieldValue("filiere", value);
              setFiliereId(value);
            }}
            styles={styles}
            iconName="book" // Icône par défaut (à personnaliser si besoin)
          />
        ))}
      </View>
    )}
    {formik.touched.filiere && formik.errors.filiere && (
      <RNText style={styles.errorText}>{formik.errors.filiere}</RNText>
    )}
    <View style={styles.buttonContainer}>
      <Button mode="outlined" onPress={prevStep} style={styles.backButton}>
        Précédent
      </Button>
      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        style={styles.nextButton}
        disabled={!formik.isValid || filieresLoading || !filieres}
      >
        Suivant
      </Button>
    </View>
  </View>
);

export default Step3;
