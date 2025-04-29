import React, { useState } from "react";
import { Button, Dialog, Portal, Text, Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Href, useRouter } from "expo-router";
import { cancelCourse } from "@/api/courses";

type MarkCourseUnavailableProps = {
  visible: boolean;
  id: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  //   screen: Href;
};

export default function CancelCourse({
  visible,
  setVisible,
  id,
}: //   screen,
MarkCourseUnavailableProps) {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const router = useRouter();

  const handleMarkUnavailable = async () => {
    try {
      await cancelCourse(id);
      setSuccessMessageVisible(true);
      setVisible(false);
      //   router.replace(screen);
    } catch (error) {
      console.error(
        "Erreur lors du marquage du cours comme indisponible",
        error
      );
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title style={styles.title}>
          Confirmer l'indisponibilité
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.message}>
            Êtes-vous sûr(e) de vouloir annuler ce cours ?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={styles.button} onPress={() => setVisible(false)}>
            Annuler
          </Button>
          <Button style={styles.button} onPress={handleMarkUnavailable}>
            Confirmer
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Snackbar
        visible={successMessageVisible}
        onDismiss={() => setSuccessMessageVisible(false)}
        duration={4000}
        action={{
          label: "Fermer",
          onPress: () => setSuccessMessageVisible(false),
        }}
        style={styles.snackbar}
      >
        Cours annuler avec succès !
      </Snackbar>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  message: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 20,
  },
  snackbar: {
    backgroundColor: "#4caf50",
  },
});
