import React from "react";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons"; // Ajout pour les icônes
import { FormikProps } from "formik";
import { FiliereItem, FormData } from "./types";

interface Step4Props {
  formik: FormikProps<FormData>;
  filieres: FiliereItem[] | null;
  filieresLoading: boolean;
  prevStep: () => void;
  styles: any;
}

const OptionButton: React.FC<{
  label: string;
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
  styles: any;
  iconName: string; // Ajout pour l'icône de chaque niveau
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

const Step4: React.FC<Step4Props> = ({
  formik,
  filieres,
  filieresLoading,
  prevStep,
  styles,
}) => {
  const selectedFiliere = filieres?.find(
    (f) => String(f.id) === formik.values.filiere
  );
  const niveaux = selectedFiliere ? selectedFiliere.niveaux : [];

  return (
    <View>
      <LinearGradient
        colors={["#34acb4", "#2a8b92"]}
        style={styles.titleContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <FontAwesome5
          name="layer-group" // Icône pour représenter les niveaux (empilement)
          size={28}
          color="#FFFFFF"
          style={styles.titleIcon}
        />
        <RNText style={styles.title}>Choix du Niveau</RNText>
      </LinearGradient>
      {filieresLoading ? (
        <ActivityIndicator color="#34acb4" size={32} style={{ margin: 20 }} />
      ) : !selectedFiliere ? (
        <RNText style={styles.errorText}>
          Veuillez sélectionner une filière d'abord
        </RNText>
      ) : niveaux.length === 0 ? (
        <RNText style={styles.errorText}>
          Aucun niveau disponible pour cette filière
        </RNText>
      ) : (
        <View style={styles.optionsContainer}>
          {niveaux.map((niveau) => (
            <OptionButton
              key={niveau.id}
              label={niveau.nom}
              value={String(niveau.id)}
              selectedValue={formik.values.niveau}
              onPress={(value) => formik.setFieldValue("niveau", value)}
              styles={styles}
              iconName={getNiveauIcon(niveau.nom)} // Icône personnalisée
            />
          ))}
        </View>
      )}
      {formik.touched.niveau && formik.errors.niveau && (
        <RNText style={styles.errorText}>{formik.errors.niveau}</RNText>
      )}
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={prevStep} style={styles.backButton}>
          Précédent
        </Button>
        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          style={styles.nextButton}
          disabled={!formik.isValid || !selectedFiliere || niveaux.length === 0}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

// Fonction pour associer une icône à chaque niveau
const getNiveauIcon = (nom: string) => {
  switch (nom.toLowerCase()) {
    case "licence 1":
      return "graduation-cap"; // Niveau débutant
    case "licence 2":
      return "book-reader"; // Niveau intermédiaire
    case "licence 3":
      return "award"; // Niveau avancé
    case "master 1":
      return "chalkboard"; // Master 1
    case "master 2":
      return "trophy"; // Master 2
    default:
      return "layer-group"; // Icône par défaut pour niveaux
  }
};

export default Step4;
