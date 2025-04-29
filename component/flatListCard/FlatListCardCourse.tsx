import React, { useState, useEffect, useContext } from "react";
import {
  SectionList,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, Card, IconButton, Text } from "react-native-paper";
import IMAGES from "@/assets/images";
import { Image } from "react-native";
import { getCourses } from "@/api/courses";
import CancelCourse from "../common/CancelCourse";
import AcceptCourse from "../common/AcceptCourse";
import { AuthContext } from "@/context/AuthContext";

type CourseItem = {
  id: number;
  heure_debut: string;
  heure_fin: string;
  date: string;
  statut: string;
  salle: { nom: string };
  matiere: { nom: string };
  filiere: { nom: string };
  niveau: { nom: string };
};

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

interface FlatListCardCourseProps {
  initialData: PaginatedResponse<CourseItem>;
  refetch: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const FlatListCardCourse: React.FC<FlatListCardCourseProps> = ({
  initialData,
  refetch,
  containerStyle,
}) => {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState<CourseItem[]>(initialData.data);
  const [currentPage, setCurrentPage] = useState(initialData.current_page);
  const [lastPage, setLastPage] = useState(initialData.last_page);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCancel, setVisibleCancel] = useState(false); // État pour CancelCourse
  const [visibleAccept, setVisibleAccept] = useState(false); // État pour AcceptCourse
  const [idCancel, setIdCancel] = useState<number>(0); // ID partagé pour les deux actions

  // Mettre à jour les données initiales si elles changent (par exemple, après un refetch)
  useEffect(() => {
    setCourses(initialData.data);
    setCurrentPage(initialData.current_page);
    setLastPage(initialData.last_page);
  }, [initialData]);

  const handleLoadMore = async () => {
    if (isLoadingMore || currentPage >= lastPage) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getCourses(nextPage, 5); // Charger la page suivante
      setCourses((prevCourses) => [...prevCourses, ...response.data]);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données supplémentaires :",
        error
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: CourseItem }) => {
    // Fonction pour formater la date manuellement
    const formatDateInFrench = (dateString: string) => {
      const date = new Date(dateString);
      const days = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ];
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${dayName} ${day} ${month} ${year}`;
    };

    const formattedDate = formatDateInFrench(item.date);

    return (
      <Card key={item.id} style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          {/* En-tête avec Filiere et Niveau */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>
              {item.filiere.nom} • {item.niveau.nom}
            </Text>
          </View>

          {/* Matiere (titre principal) */}
          <Text style={styles.cardModule}>{item.matiere.nom}</Text>

          {/* Date stylisée */}
          <View style={styles.cardDateContainer}>
            <Text style={styles.cardDate}>{formattedDate}</Text>
          </View>

          {/* Informations détaillées (Heure et Salle) */}
          <View style={styles.cardMain}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Heure</Text>
              <Text style={styles.infoValue}>
                {item.heure_debut} - {item.heure_fin}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Salle</Text>
              <Text style={styles.infoValue}>{item.salle.nom}</Text>
            </View>
          </View>

          {/* Boutons d'action */}
          {user.personne.role == "enseignant" ? (
            item.statut === "en attente" ? (
              <IconButton
                mode="contained"
                icon="cancel"
                size={22}
                iconColor="#FFFFFF"
                onPress={() => {
                  setVisibleCancel(true); // Ouvre la boîte de dialogue pour annuler
                  setIdCancel(item.id);
                }}
                style={styles.deleteButton}
              />
            ) : (
              <IconButton
                mode="contained"
                icon="calendar-check"
                size={22}
                iconColor="#FFFFFF"
                onPress={() => {
                  setVisibleAccept(true); // Ouvre la boîte de dialogue pour accepter/reprogrammer
                  setIdCancel(item.id);
                }}
                style={styles.deleteButton}
              />
            )
          ) : null}
        </Card.Content>
      </Card>
    );
  };

  const groupedCourses = courses?.reduce((acc, course) => {
    (acc[course.date] = acc[course.date] || []).push(course);
    return acc;
  }, {} as Record<string, CourseItem[]>);

  const sections = Object.keys(groupedCourses || {}).map((date) => ({
    title: date,
    data: groupedCourses![date],
  }));

  return (
    <View style={[styles.listContainer, containerStyle]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            {/* <Image source={IMAGES.CALENDAR} style={styles.calendarImage} />
            <Text style={styles.headerText}>{title}</Text> */}
          </View>
        )}
        renderItem={renderItem}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator size={24} color="blue" />
          ) : currentPage >= lastPage ? null : null
        }
        onRefresh={handleRefresh}
        refreshing={false}
        onEndReachedThreshold={0.8}
        onEndReached={handleLoadMore}
      />

      {/* Boîte de dialogue pour accepter/reprogrammer un cours */}
      <AcceptCourse
        id={idCancel}
        visible={visibleAccept}
        setVisible={setVisibleAccept}
      />

      {/* Boîte de dialogue pour annuler un cours */}
      <CancelCourse
        id={idCancel}
        visible={visibleCancel}
        setVisible={setVisibleCancel}
      />
    </View>
  );
};

// Styles (inchangés)
const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
  },
  calendarImage: {
    height: 80,
    width: 80,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: 300,
  },
  cardContent: {
    flexDirection: "column",
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardModule: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2A44",
    marginBottom: 12,
  },
  cardDateContainer: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardMain: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    width: 70,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2A44",
    flex: 1,
  },
  deleteButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  introContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: "#4A90E2",
    borderRadius: 50,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  courseImage: {
    height: 70,
    width: 70,
    resizeMode: "contain",
  },
  introText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2A44",
    letterSpacing: 0.5,
  },
});
