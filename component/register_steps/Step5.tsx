import React from "react";
import { View, Text as RNText } from "react-native";
import { Button, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { FormikProps } from "formik";
import { FormData } from "./types";

interface Step5Props {
  formik: FormikProps<FormData>;
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  prevStep: () => void;
  styles: any;
}

const InfoModal: React.FC<{
  values: FormData;
  styles: any;
  onClose: () => void;
}> = ({ values, styles, onClose }) => (
  <Modal
    isVisible={true}
    onBackdropPress={onClose}
    animationIn="zoomIn"
    animationOut="zoomOut"
    backdropOpacity={0.3}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#FFFFFF", "#F8F9FA"]}
        style={styles.modalContent}
      >
        <LinearGradient
          colors={["#34acb4", "#2a8b92"]}
          style={styles.titleContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <FontAwesome5
            name="info-circle"
            size={28}
            color="#FFFFFF"
            style={styles.titleIcon}
          />
          <Text style={styles.title}>Vos Informations</Text>
        </LinearGradient>
        <View style={styles.modalInfo}>
          {Object.entries(values).map(([key, value]) => (
            <RNText key={key} style={styles.modalText}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {value || "Non renseigné"}
            </RNText>
          ))}
        </View>
        <Button mode="contained" onPress={onClose} style={styles.modalButton}>
          Fermer
        </Button>
      </LinearGradient>
    </View>
  </Modal>
);

const Step5: React.FC<Step5Props> = ({
  formik,
  isModalVisible,
  setModalVisible,
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
        name="check-circle"
        size={28}
        color="#FFFFFF"
        style={styles.titleIcon}
      />
      <Text style={styles.title}>Confirmation</Text>
    </LinearGradient>
    <LinearGradient colors={["#FFFFFF", "#F8F9FA"]} style={styles.customCard}>
      <View style={styles.cardInner}>
        <Text style={styles.subtitle}>Vérifiez vos informations</Text>
        <Button
          mode="outlined"
          onPress={() => setModalVisible(true)}
          style={styles.infoButton}
        >
          Voir les informations
        </Button>
        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          style={styles.nextButton}
          disabled={!formik.isValid}
        >
          Soumettre
        </Button>
        <Button mode="outlined" onPress={prevStep} style={styles.backButton}>
          Précédent
        </Button>
        {isModalVisible && (
          <InfoModal
            values={formik.values}
            styles={styles}
            onClose={() => setModalVisible(false)}
          />
        )}
      </View>
    </LinearGradient>
  </View>
);

export default Step5;
