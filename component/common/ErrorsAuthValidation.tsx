import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
interface Errors {
  errors: {
    [key: string]: string[];
  };
}

const ErrorsAuthValidation: React.FC<{
  errors: Errors;
  visible: boolean;
  setErrorMessage: Dispatch<SetStateAction<boolean>>;
}> = ({ errors, visible, setErrorMessage }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setErrorMessage(false)}
      duration={8000}
      action={{
        label: "Fermer",
        onPress: () => setErrorMessage(false),
        labelStyle: styles.closeButtonText,
      }}
      style={styles.snackbar}
    >
      <View style={styles.errorContainer}>
        {Object.entries(errors.errors).map(([field, errorMessages]) =>
          errorMessages.map((errorMsg, index) => (
            <View key={`${field}-${index}`} style={styles.errorRow}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color="#FFFFFF"
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>
                {`${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }: ${errorMsg}`}
              </Text>
            </View>
          ))
        )}
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: "#EF5350",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  errorContainer: {
    flex: 1,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export default ErrorsAuthValidation;
