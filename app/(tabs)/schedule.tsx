import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "@/hooks/useFetch";
import { getCoursesWeek } from "@/api/courses";
import { getFilieres } from "@/api/filieres";
import { SkeletonPage } from "@/component/common/skeletonPage";
import EmptyElement from "@/component/common/EmptyElement";
import { CourseFilter } from "@/component/common/CourseFilter";
import { AuthContext } from "@/context/AuthContext";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface CourseItem {
  id: string;
  heure_debut: string;
  heure_fin: string;
  date: string;
  matiere: {
    nom: string;
  };
  niveau: {
    nom: string;
    id: number;
  };
  filiere: {
    nom: string;
    id: number;
  };
  salle: {
    nom: string;
  };
}

interface FiliereItem {
  id: number;
  nom: string;
  description: string;
  niveaux: {
    id: number;
    nom: string;
    filiere_id: number;
  }[];
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

interface Personne {
  prenom: string;
  nom: string;
  date_naissance: string;
  sexe: "M" | "F";
  tel: string;
  role: "enseignant" | "etudiant";
  enseignant?: {
    matieres: {
      nom: string;
      niveau: { nom: string; filiere: { nom: string } };
    }[];
  };
  etudiant?: {
    filiere?: { nom: string; id: number };
    niveau?: { nom: string; id: number };
  };
}

interface User {
  email: string;
  provider?: string;
  personne: Personne;
}

interface AuthContextType {
  user: User | null;
}

const formatHour = (heure: any) => {
  if (!heure) return "";
  const [hours, minutes] = heure.split(":");
  return `${hours}h${minutes}`;
};

export default function CalendarScreen() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekRange, setCurrentWeekRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState<number | null>(null);

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    return {
      startDate: formatDate(startOfWeek),
      endDate: formatDate(endOfWeek),
    };
  };

  const { startDate, endDate } = getWeekRange(selectedDate);

  const {
    data: initialResponse,
    loading: isLoading,
    error,
    refetch,
  } = useFetch<CourseItem[]>(
    getCoursesWeek,
    currentWeekRange
      ? [
          currentWeekRange.startDate,
          currentWeekRange.endDate,
          user?.personne.role === "enseignant" ? selectedNiveauId : undefined,
        ]
      : [
          startDate,
          endDate,
          user?.personne.role === "enseignant" ? selectedNiveauId : undefined,
        ]
  );

  const {
    data: filieres,
    loading: filieresLoading,
    error: filieresError,
  } = useFetch<FiliereItem[]>(getFilieres);

  const initialCourses: PaginatedResponse<CourseItem> = {
    data: initialResponse || [],
    current_page: 1,
    last_page: 1,
    total: initialResponse?.length || 0,
  };

  useEffect(() => {
    const newWeekRange = getWeekRange(selectedDate);
    if (
      !currentWeekRange ||
      currentWeekRange.startDate !== newWeekRange.startDate ||
      currentWeekRange.endDate !== newWeekRange.endDate
    ) {
      setCurrentWeekRange(newWeekRange);
      refetch();
    }
  }, [selectedDate, refetch, currentWeekRange, selectedNiveauId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    return { days, firstDay };
  };

  const getWeekOfDate = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(
        day.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
        })
      );
    }
    return weekDays;
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const calendar: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-start-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        day
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();

      week.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.today,
            isSelected && styles.selected,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={[
              styles.dayText,
              isToday && styles.todayText,
              isSelected && styles.selectedText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );

      if ((firstDay + day) % 7 === 0 || day === days) {
        if (day === days && (firstDay + day) % 7 !== 0) {
          const remainingDays = 7 - ((firstDay + day) % 7);
          for (let i = 0; i < remainingDays; i++) {
            week.push(
              <View key={`empty-end-${i}`} style={styles.calendarDay} />
            );
          }
        }
        calendar.push(
          <View key={day} style={styles.calendarWeek}>
            {week}
          </View>
        );
        week = [];
      }
    }

    return calendar;
  };

  const weekDays = getWeekOfDate(selectedDate);

  const organizeScheduleData = (courses: CourseItem[] | null) => {
    const morning: CourseItem[] = [];
    const afternoon: CourseItem[] = [];

    for (let i = 0; i < 6; i++) {
      morning.push({
        id: "",
        heure_debut: "",
        heure_fin: "",
        date: "",
        matiere: { nom: "" },
        niveau: { nom: "", id: 0 },
        filiere: { nom: "", id: 0 },
        salle: { nom: "" },
      });
      afternoon.push({
        id: "",
        heure_debut: "",
        heure_fin: "",
        date: "",
        matiere: { nom: "" },
        niveau: { nom: "", id: 0 },
        filiere: { nom: "", id: 0 },
        salle: { nom: "" },
      });
    }

    if (!courses) return { morning, afternoon };

    courses.forEach((course) => {
      const courseDate = new Date(course.date);
      const dayIndex = (courseDate.getDay() + 6) % 7;

      if (dayIndex >= 0 && dayIndex < 6) {
        const startHour = parseInt(course.heure_debut.split(":")[0], 10);
        const slot = {
          id: course.id,
          heure_debut: course.heure_debut,
          heure_fin: course.heure_fin,
          date: course.date,
          matiere: { nom: course.matiere.nom },
          niveau: { nom: course.niveau.nom, id: course.niveau.id },
          filiere: { nom: course.filiere.nom, id: course.filiere.id },
          salle: { nom: course.salle.nom },
        };

        if (startHour < 14) {
          morning[dayIndex] = slot;
        } else {
          afternoon[dayIndex] = slot;
        }
      }
    });

    return { morning, afternoon };
  };

  const scheduleData = organizeScheduleData(initialResponse);

  const getSectionText = () => {
    if (!user) return "";

    if (user.personne.role === "etudiant") {
      const filiereNom = user.personne.etudiant?.filiere?.nom;
      const niveauNom = user.personne.etudiant?.niveau?.nom;
      if (filiereNom && niveauNom) {
        return `Section ${filiereNom} ${niveauNom}`;
      }
      return "";
    }

    if (user.personne.role === "enseignant") {
      if (!selectedNiveauId || !filieres) {
        return "Section Tous les niveaux";
      }
      const niveau = filieres
        .flatMap((f) => f.niveaux)
        .find((n) => n.id === selectedNiveauId);
      const filiere = filieres.find((f) => f.id === niveau?.filiere_id);
      if (filiere && niveau) {
        return `Section ${filiere.nom} ${niveau.nom}`;
      }
      return "Section Tous les niveaux";
    }

    return "";
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <EmptyElement message="Utilisateur non connecté" />
      </View>
    );
  }

  if (isLoading || filieresLoading) {
    return (
      <View style={styles.container}>
        <SkeletonPage />
        <SkeletonPage />
      </View>
    );
  }

  if (error || filieresError) {
    return (
      <View style={styles.errorContainer}>
        <EmptyElement message={`Erreur : ${error || filieresError}`} />
      </View>
    );
  }

  if (!filieres || filieres.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <EmptyElement message="Aucune filière disponible" />
      </View>
    );
  }

  if (!initialResponse || initialResponse.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <EmptyElement message="Aucun cours pour cette sélection" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user.personne.role === "enseignant" && (
        <View style={styles.filterContainer}>
          <CourseFilter
            filieres={filieres}
            initialCourses={initialCourses}
            onNiveauChange={(niveauId: number | null) => {
              setSelectedNiveauId(niveauId);
            }}
          />
        </View>
      )}

      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() - 1,
                  1
                )
              )
            }
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  1
                )
              )
            }
          >
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayHeader}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        {renderCalendar()}
      </View>

      <View style={styles.scheduleTableContainer}>
        <Text style={styles.sectionText}>{getSectionText()}</Text>
        <Text style={styles.scheduleTableTitle}>
          Semaine du {weekDays[0].split(". ")[1]}{" "}
          {selectedDate.toLocaleString("fr-FR", {
            month: "long",
            year: "numeric",
          })}{" "}
          au {weekDays[5].split(". ")[1]}{" "}
          {weekDays[5].split(". ")[0] === "Sam"
            ? selectedDate.toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              })
            : new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                1
              ).toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View
                style={[styles.tableCell, styles.headerCell, styles.timeColumn]}
              />
              {WEEKDAYS.slice(0, 6).map((day, index) => (
                <View key={index} style={[styles.tableCell, styles.headerCell]}>
                  <Text style={styles.headerText}>{day}</Text>
                  <Text style={styles.headerDate}>
                    {weekDays[index].split(". ")[1]}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              <View
                style={[styles.tableCell, styles.timeCell, styles.timeColumn]}
              >
                <Text style={styles.timeText}>Matin</Text>
              </View>
              {scheduleData.morning.map((slot, index) => (
                <View key={index} style={styles.tableCell}>
                  <Text style={styles.timeText}>
                    {slot.heure_debut && slot.heure_fin
                      ? `${formatHour(slot.heure_debut)} - ${formatHour(
                          slot.heure_fin
                        )}`
                      : ""}
                  </Text>
                  <Text style={styles.moduleText}>{slot.matiere.nom}</Text>
                  <Text style={styles.roomText}>{slot.salle.nom}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              <View
                style={[styles.tableCell, styles.timeCell, styles.timeColumn]}
              >
                <Text style={styles.timeText}>Soir</Text>
              </View>
              {scheduleData.afternoon.map((slot, index) => (
                <View key={index} style={styles.tableCell}>
                  <Text style={styles.timeText}>
                    {slot.heure_debut && slot.heure_fin
                      ? `${formatHour(slot.heure_debut)} - ${formatHour(
                          slot.heure_fin
                        )}`
                      : ""}
                  </Text>
                  <Text style={styles.moduleText}>{slot.matiere.nom}</Text>
                  <Text style={styles.roomText}>{slot.salle.nom}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  filterContainer: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontWeight: "500",
  },
  calendarWeek: {
    flexDirection: "row",
    marginBottom: 5,
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  today: {
    backgroundColor: "#1a8e2d15",
  },
  todayText: {
    color: "#1a8e2d",
    fontWeight: "600",
  },
  selected: {
    backgroundColor: "#4A90E2",
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  scheduleTableContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  scheduleTableTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableCell: {
    width: 120,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 100,
  },
  headerCell: {
    backgroundColor: "#F0F0F0",
    minHeight: 60,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  timeCell: {
    backgroundColor: "#F9FAFB",
  },
  timeColumn: {
    width: 80,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  moduleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  roomText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});
