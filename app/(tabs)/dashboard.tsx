import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef, useContext } from "react";
import Svg, { Circle } from "react-native-svg";
import {
  getCourses,
  getPendingValidationCourses,
  acceptCourse,
  markCourseDone,
} from "@/api/courses";
import useFetch from "@/hooks/useFetch";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Snackbar,
} from "react-native-paper";
import { getNotifications } from "@/api/notifications";
import NotificationsModal from "@/component/modal/Notifications";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

// Créer le composant cercle animé
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function ProgressionCirculaire() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const taille = 160;
  const epaisseurTrait = 10;
  const rayon = (taille - epaisseurTrait) / 2;
  const circonference = 2 * Math.PI * rayon;

  const progression = 0.4;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progression,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const decalageTrait = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circonference, 0],
  });

  return (
    <View style={styles.progressionContainer}>
      <View style={styles.progressionTexteContainer}>
        <Text style={styles.progressionPourcentage}>
          {Math.round(progression * 100)}%
        </Text>
        <Text style={styles.progressionDetails}>2/5 effectués</Text>
      </View>
      <Svg width={taille} height={taille}>
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={epaisseurTrait}
          fill="none"
        />
        <AnimatedCircle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke="white"
          strokeWidth={epaisseurTrait}
          fill="none"
          strokeDasharray={circonference}
          strokeDashoffset={decalageTrait}
          strokeLinecap="round"
          transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
        />
      </Svg>
    </View>
  );
}

type CourseItem = {
  id: number;
  heure_debut: string;
  heure_fin: string;
  date: string;
  statut: string;
  salle: { nom: string };
  matiere: { nom: string };
  filiere: { nom: string; id: number };
  niveau: { nom: string; id: number };
};

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

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

// Composant de confirmation pour marquer un cours comme effectué
type MarkCourseDoneProps = {
  visible: boolean;
  courseId: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
};

function MarkCourseDone({
  visible,
  courseId,
  setVisible,
  onSuccess,
}: MarkCourseDoneProps) {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const handleMarkDone = async () => {
    try {
      await markCourseDone(courseId);
      setSuccessMessageVisible(true);
      setVisible(false);
      onSuccess(); // Déclenche le refetch des cours en attente
    } catch (error) {
      console.error("Erreur lors du marquage du cours comme effectué", error);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title style={styles.dialogTitle}>
          Confirmer le marquage comme effectué
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogMessage}>
            Êtes-vous sûr(e) de vouloir marquer ce cours comme effectué ?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={styles.dialogButton} onPress={() => setVisible(false)}>
            Annuler
          </Button>
          <Button style={styles.dialogButton} onPress={handleMarkDone}>
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
        Cours marqué comme effectué avec succès !
      </Snackbar>
    </Portal>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const {
    data: todayCourses,
    loading: isLoading,
    error,
    refetch: refetchTodayCourses,
  } = useFetch<PaginatedResponse<CourseItem> | null>(getCourses, [
    1,
    5,
    null,
    true,
  ]);

  const {
    data: pendingCourses,
    loading: pendingLoading,
    refetch: refetchPendingCourses,
  } = useFetch<CourseItem[] | null>(getPendingValidationCourses);

  const { data: notifications, loading: notificationLoading } = useFetch<
    Notification[] | []
  >(getNotifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMarkDoneDialog, setShowMarkDoneDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleMarkCourseDone = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowMarkDoneDialog(true);
  };

  const nav = useRouter();

  return (
    <ScrollView style={styles.conteneur}>
      <LinearGradient colors={["#1a8e2d", "#146922"]} style={styles.enTete}>
        <View style={styles.contenuEnTete}>
          <View style={styles.hautEnTete}>
            <Text style={styles.titreEnTete}>Tableau de bord IBAM</Text>
            <TouchableOpacity
              style={styles.boutonNotification}
              onPress={() => setShowNotifications(true)}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.badgeNotification}>
                <Text style={styles.compteurNotification}>
                  {notifications?.length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <ProgressionCirculaire />
          <Text style={styles.sousTitreEnTete}>
            Cours effectués cette semaine
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.contenuPrincipal}>
        <View style={styles.conteneurProchainCours}>
          <Text style={styles.titreSection}>Cours d'aujourd'hui</Text>
          {isLoading ? (
            <ActivityIndicator size={32} color="black" />
          ) : todayCourses?.data.length === 0 ? (
            <View style={styles.aucunCoursContainer}>
              <Ionicons name="calendar-outline" size={40} color="#666" />
              <Text style={styles.aucunCoursTexte}>
                Aucun cours prévu aujourd'hui
              </Text>
            </View>
          ) : (
            todayCourses?.data.map((course) => (
              <View style={styles.carteProchainCours} key={course.id}>
                <Ionicons
                  name="alarm-outline"
                  size={32}
                  color="#2196F3"
                  style={styles.iconeProchainCours}
                />
                <View>
                  <Text style={styles.titreProchainCours}>
                    Cours : {course.matiere.nom}
                  </Text>
                  <Text style={styles.detailsProchainCours}>
                    Salle {course.salle.nom} - {course.filiere.nom}
                  </Text>
                  <Text style={styles.heureProchainCours}>
                    {course.heure_debut} - {course.heure_fin}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.conteneurCoursAEffectuer}>
          <Text style={styles.titreSection}>
            Cours à marquer comme effectués
          </Text>
          {pendingLoading ? (
            <ActivityIndicator size={32} color="black" />
          ) : pendingCourses?.length === 0 ? (
            <View style={styles.aucunCoursContainer}>
              <Ionicons name="checkmark-done-outline" size={40} color="#666" />
              <Text style={styles.aucunCoursTexte}>
                Aucun cours à marquer comme effectué
              </Text>
            </View>
          ) : (
            pendingCourses?.map((course) => (
              <View key={course.id} style={styles.carteCoursEnAttente}>
                <View style={styles.contenuCoursEnAttente}>
                  <Ionicons
                    name="checkbox-outline"
                    size={24}
                    color="#FF5722"
                    style={styles.iconeCoursEnAttente}
                  />
                  <View style={styles.infoCoursEnAttente}>
                    <Text style={styles.titreCoursEnAttente}>
                      {course.matiere.nom}
                    </Text>
                    <Text style={styles.detailsCoursEnAttente}>
                      {course.date} • {course.heure_debut} - {course.heure_fin}
                    </Text>
                    <Text style={styles.filiereCoursEnAttente}>
                      {course.filiere.nom}
                    </Text>
                  </View>
                  {user?.personne?.role === "delegue" && (
                    <TouchableOpacity
                      onPress={() => handleMarkCourseDone(course.id)}
                      style={styles.markDoneButton}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="#4CAF50"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity onPress={() => nav.push("/test")}>
          <Text>Test</Text>
        </TouchableOpacity>
      </View>

      <NotificationsModal
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationLoading={notificationLoading}
      />

      {selectedCourseId && (
        <MarkCourseDone
          visible={showMarkDoneDialog}
          courseId={selectedCourseId}
          setVisible={setShowMarkDoneDialog}
          onSuccess={() => {
            refetchPendingCourses(); // Recharge les cours en attente
            refetchTodayCourses(); // Optionnel : recharge les cours du jour si nécessaire
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  enTete: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  contenuEnTete: {
    alignItems: "center",
  },
  hautEnTete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  titreEnTete: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  sousTitreEnTete: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 10,
  },
  boutonNotification: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
  },
  badgeNotification: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF5252",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#146922",
  },
  compteurNotification: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  progressionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressionTexteContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressionPourcentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  progressionDetails: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  contenuPrincipal: {
    padding: 20,
  },
  titreSection: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 15,
  },
  conteneurProchainCours: {
    marginBottom: 20,
  },
  carteProchainCours: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconeProchainCours: {
    marginRight: 15,
  },
  titreProchainCours: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  detailsProchainCours: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  heureProchainCours: {
    fontSize: 14,
    color: "#2196F3",
    marginTop: 2,
  },
  conteneurCoursAEffectuer: {
    marginBottom: 20,
  },
  carteCoursEnAttente: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contenuCoursEnAttente: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconeCoursEnAttente: {
    marginRight: 12,
  },
  infoCoursEnAttente: {
    flex: 1,
  },
  titreCoursEnAttente: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  detailsCoursEnAttente: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  filiereCoursEnAttente: {
    fontSize: 13,
    color: "#FF5722",
    marginTop: 2,
  },
  aucunCoursContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aucunCoursTexte: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  markDoneButton: {
    padding: 8,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  dialogMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  dialogButton: {
    paddingHorizontal: 20,
  },
  snackbar: {
    backgroundColor: "#4caf50",
  },
});
