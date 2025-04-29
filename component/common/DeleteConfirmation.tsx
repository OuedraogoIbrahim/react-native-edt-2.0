import React, { useState } from "react";
import { Button, Dialog, Portal, Text, Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Href, RelativePathString, useRouter } from "expo-router";

type DeleteConfirmationProps = {
  message: string;
  visible: boolean;
  id: number | string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  screen: Href;
};

export default function DeleteConfirmation({
  message,
  visible,
  setVisible,
  id,
  screen,
}: DeleteConfirmationProps) {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await wait(4000);

      setSuccessMessageVisible(true);
      setVisible(false);
      router.replace(screen);
    } catch (error) {
      console.error("Erreur de suppression", error);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title style={styles.title}>
          La suppression est définitive
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.message}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={styles.button} onPress={() => setVisible(false)}>
            Annuler
          </Button>
          <Button style={styles.button} onPress={handleDelete}>
            Confirmer
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Snackbar
        visible={successMessageVisible}
        onDismiss={() => setSuccessMessageVisible(false)}
        duration={3000}
        action={{
          label: "Fermer",
          onPress: () => setSuccessMessageVisible(false),
        }}
        style={styles.snackbar}
      >
        Élément supprimé avec succès !
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
