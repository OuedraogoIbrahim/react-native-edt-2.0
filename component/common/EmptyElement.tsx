import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface EmptyElementProps {
  message: string;
}

export default function EmptyElement({ message }: EmptyElementProps) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="information-circle-outline" size={48} color="#6b7280" />
      <Text variant="headlineSmall" style={styles.emptyText}>
        {message}
      </Text>
      <Text variant="bodyMedium" style={styles.subText}>
        Aucun élément à afficher pour le moment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  emptyText: {
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  subText: {
    marginTop: 8,
    color: "#6b7280",
    textAlign: "center",
    fontSize: 14,
  },
});
