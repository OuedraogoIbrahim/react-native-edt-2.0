import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput as RNTextInput,
  Text as RNText,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons"; // Ajout pour l'icône du titre
import { FormikProps } from "formik";
import { FormData } from "./types";

interface Step2Props {
  formik: FormikProps<FormData>;
  prevStep: () => void;
  styles: any;
}

const Step2: React.FC<Step2Props> = ({ formik, prevStep, styles }) => (
  <View>
    <LinearGradient
      colors={["#34acb4", "#2a8b92"]}
      style={styles.titleContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <FontAwesome5
        name="user-edit" // Icône représentant l'édition d'infos personnelles
        size={28}
        color="#FFFFFF"
        style={styles.titleIcon}
      />
      <Text style={styles.title}>Informations Personnelles</Text>
    </LinearGradient>
    <LinearGradient colors={["#FFFFFF", "#F8F9FA"]} style={styles.customCard}>
      <View style={styles.cardInner}>
        <RNTextInput
          placeholder="Nom"
          value={formik.values.nom}
          onChangeText={formik.handleChange("nom")}
          onBlur={formik.handleBlur("nom")}
          style={[
            styles.rnInput,
            formik.touched.nom && formik.errors.nom && styles.inputError,
          ]}
        />
        {formik.touched.nom && formik.errors.nom && (
          <RNText style={styles.errorText}>{formik.errors.nom}</RNText>
        )}
        <RNTextInput
          placeholder="Prénom"
          value={formik.values.prenom}
          onChangeText={formik.handleChange("prenom")}
          onBlur={formik.handleBlur("prenom")}
          style={[
            styles.rnInput,
            formik.touched.prenom && formik.errors.prenom && styles.inputError,
          ]}
        />
        {formik.touched.prenom && formik.errors.prenom && (
          <RNText style={styles.errorText}>{formik.errors.prenom}</RNText>
        )}
        <RNTextInput
          placeholder="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          style={[
            styles.rnInput,
            formik.touched.email && formik.errors.email && styles.inputError,
          ]}
          keyboardType="email-address"
        />
        {formik.touched.email && formik.errors.email && (
          <RNText style={styles.errorText}>{formik.errors.email}</RNText>
        )}
        <RNTextInput
          placeholder="Mot de passe"
          value={formik.values.password}
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          style={[
            styles.rnInput,
            formik.touched.password &&
              formik.errors.password &&
              styles.inputError,
          ]}
          secureTextEntry={true}
        />
        {formik.touched.password && formik.errors.password && (
          <RNText style={styles.errorText}>{formik.errors.password}</RNText>
        )}
        <RNTextInput
          placeholder="Téléphone"
          value={formik.values.tel}
          onChangeText={formik.handleChange("tel")}
          onBlur={formik.handleBlur("tel")}
          style={[
            styles.rnInput,
            formik.touched.tel && formik.errors.tel && styles.inputError,
          ]}
          keyboardType="phone-pad"
        />
        {formik.touched.tel && formik.errors.tel && (
          <RNText style={styles.errorText}>{formik.errors.tel}</RNText>
        )}
        <View style={styles.sexeContainer}>
          <TouchableOpacity
            style={[
              styles.sexeButton,
              formik.values.sexe === "M" && styles.sexeButtonSelected,
            ]}
            onPress={() => formik.setFieldValue("sexe", "M")}
          >
            <RNText
              style={[
                styles.sexeText,
                formik.values.sexe === "M" && styles.sexeTextSelected,
              ]}
            >
              Masculin
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexeButton,
              formik.values.sexe === "F" && styles.sexeButtonSelected,
            ]}
            onPress={() => formik.setFieldValue("sexe", "F")}
          >
            <RNText
              style={[
                styles.sexeText,
                formik.values.sexe === "F" && styles.sexeTextSelected,
              ]}
            >
              Féminin
            </RNText>
          </TouchableOpacity>
        </View>
        {formik.touched.sexe && formik.errors.sexe && (
          <RNText style={styles.errorText}>{formik.errors.sexe}</RNText>
        )}
        <RNTextInput
          placeholder="Date de naissance (AAAA-MM-JJ)"
          value={formik.values.date_naissance}
          onChangeText={formik.handleChange("date_naissance")}
          onBlur={formik.handleBlur("date_naissance")}
          style={[
            styles.rnInput,
            formik.touched.date_naissance &&
              formik.errors.date_naissance &&
              styles.inputError,
          ]}
        />
        {formik.touched.date_naissance && formik.errors.date_naissance && (
          <RNText style={styles.errorText}>
            {formik.errors.date_naissance}
          </RNText>
        )}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={prevStep} style={styles.backButton}>
            Précédent
          </Button>
          <Button
            mode="contained"
            onPress={() => formik.handleSubmit()}
            style={styles.nextButton}
            disabled={!formik.isValid}
          >
            Suivant
          </Button>
        </View>
      </View>
    </LinearGradient>
  </View>
);

export default Step2;
