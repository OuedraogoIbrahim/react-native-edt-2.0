import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { COLORS, FONTS } from "@/constants";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[styles.spinnerContainer, { transform: [{ rotate: spin }] }]}
        >
          <ActivityIndicator size={50} color={COLORS.ORANGE} />
        </Animated.View>
        <Text style={styles.text}>Connexion en cours...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spinnerContainer: {
    marginBottom: 15,
  },
  text: {
    fontFamily: FONTS.MONTSERRAT_SEMI_BOLD,
    fontSize: 18,
    color: COLORS.ORANGE,
  },
});

export default LoadingOverlay;
