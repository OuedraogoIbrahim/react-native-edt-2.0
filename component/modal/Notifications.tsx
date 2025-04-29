import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";

interface Notification {
  created_at: string;
  data: {
    course_name: string;
    course_time: string;
    message: string;
    title: string;
  };
  id: string;
  notifiable_id: number;
}

export default function NotificationsModal({
  showNotifications,
  setShowNotifications,
  notifications,
  notificationLoading,
}: {
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: Notification[] | null;
  notificationLoading: boolean;
}) {
  return (
    <>
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.contenuModal}>
            <View style={styles.enTeteModal}>
              <Text style={styles.titreModal}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={styles.boutonFermer}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {notificationLoading ? (
                <ActivityIndicator size={32} color="black" />
              ) : (
                notifications?.map((notification) => (
                  <View
                    key={notification.id}
                    style={[
                      styles.elementNotification,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 15,
                        backgroundColor: "#ffffff",
                        borderRadius: 10,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: "#e0e0e0",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#4CAF50"
                      style={[
                        styles.iconeNotification,
                        {
                          marginRight: 15,
                          padding: 8,
                          backgroundColor: "#e8f5e9",
                          borderRadius: 8,
                        },
                      ]}
                    />
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={[
                          styles.titreNotification,
                          {
                            fontSize: 16,
                            fontWeight: "700",
                            color: "#1a1a1a",
                            marginBottom: 4,
                          },
                        ]}
                      >
                        {notification.data?.title}
                      </Text>
                      <Text
                        style={[
                          styles.messageNotification,
                          {
                            fontSize: 14,
                            color: "#555",
                            lineHeight: 20,
                            marginBottom: 4,
                          },
                        ]}
                      >
                        {notification.data?.message}
                      </Text>
                      {notification.data.course_name && (
                        <Text
                          style={[
                            styles.messageNotification,
                            {
                              fontSize: 14,
                              color: "#2196F3",
                              lineHeight: 20,
                              marginBottom: 4,
                            },
                          ]}
                        >
                          Course : {notification.data.course_name}
                        </Text>
                      )}
                      {notification.data.course_time && (
                        <Text
                          style={[
                            styles.messageNotification,
                            {
                              fontSize: 14,
                              color: "#2196F3",
                              lineHeight: 20,
                            },
                          ]}
                        >
                          Heure : {notification.data.course_time}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlayModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  contenuModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  enTeteModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titreModal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  boutonFermer: {
    padding: 5,
  },
  elementNotification: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  iconeNotification: {
    marginRight: 15,
  },
  titreNotification: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  messageNotification: {
    fontSize: 14,
    color: "#666",
  },
});
