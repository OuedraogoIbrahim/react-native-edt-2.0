import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text, Button, Divider, IconButton } from "react-native-paper";

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

interface CourseFilterProps {
  filieres: FiliereItem[];
  initialCourses: PaginatedResponse<CourseItem> | null;
  setFilteredCourses?: (filtered: PaginatedResponse<CourseItem> | null) => void;
  onNiveauChange?: (niveauId: number | null) => void;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  filieres,
  initialCourses,
  setFilteredCourses,
  onNiveauChange,
}) => {
  const [selectedFiliere, setSelectedFiliere] = useState<number | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<number | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [availableNiveaux, setAvailableNiveaux] = useState<
    { label: string; value: number }[]
  >([]);

  // Mettre à jour les niveaux disponibles
  useEffect(() => {
    if (selectedFiliere && filieres) {
      const selectedFiliereData = filieres.find(
        (filiere) => filiere.id === selectedFiliere
      );
      if (selectedFiliereData && selectedFiliereData.niveaux) {
        const niveaux = selectedFiliereData.niveaux.map((niveau) => ({
          label: niveau.nom,
          value: niveau.id,
        }));
        setAvailableNiveaux(niveaux);
      } else {
        setAvailableNiveaux([]);
      }
      setSelectedNiveau(null);
    } else {
      setAvailableNiveaux([]);
      setSelectedNiveau(null);
    }
  }, [selectedFiliere, filieres]);

  // Filtrer les cours localement (pour les autres usages)
  useEffect(() => {
    if (setFilteredCourses && initialCourses && filieres) {
      const filtered: PaginatedResponse<CourseItem> = {
        ...initialCourses,
        data: initialCourses.data.filter((course) => {
          if (!selectedFiliere) return true;
          if (course.filiere.id !== selectedFiliere) return false;
          if (!selectedNiveau) return true;
          return course.niveau.id === selectedNiveau;
        }),
      };
      setFilteredCourses(filtered);
    } else if (setFilteredCourses) {
      setFilteredCourses(initialCourses);
    }
  }, [
    selectedFiliere,
    selectedNiveau,
    initialCourses,
    filieres,
    setFilteredCourses,
  ]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedFiliere(null);
    setSelectedNiveau(null);
    setAvailableNiveaux([]);
    setIsFilterVisible(false);
    if (onNiveauChange) onNiveauChange(null);
    if (setFilteredCourses) setFilteredCourses(initialCourses);
  };

  // Appliquer le filtre (pour CalendarScreen)
  const applyFilter = () => {
    if (onNiveauChange) {
      onNiveauChange(selectedNiveau);
      setIsFilterVisible(false);
    }
  };

  const handleFiliereSelect = (filiereId: number) => {
    setSelectedFiliere(filiereId);
  };

  const handleNiveauSelect = (niveauId: number) => {
    setSelectedNiveau(niveauId);
  };

  return (
    <View style={styles.filterSection}>
      {!isFilterVisible && (
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filtrer les cours</Text>
          <IconButton
            icon="filter"
            size={24}
            onPress={() => setIsFilterVisible(true)}
            style={styles.filterIcon}
          />
        </View>
      )}

      {isFilterVisible && (
        <>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtrer les cours</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setIsFilterVisible(false)}
              style={styles.filterIcon}
            />
          </View>
          <Divider style={styles.divider} />

          <Text style={styles.filterSubtitle}>Filières</Text>
          <View style={styles.chipContainer}>
            {filieres.map((filiere) => (
              <Chip
                key={filiere.id}
                onPress={() => handleFiliereSelect(filiere.id)}
                selected={selectedFiliere === filiere.id}
                style={[
                  styles.chip,
                  selectedFiliere === filiere.id && styles.selectedChip,
                ]}
                textStyle={styles.chipText}
                mode="outlined"
              >
                {filiere.nom}
              </Chip>
            ))}
          </View>

          {selectedFiliere && availableNiveaux.length > 0 && (
            <>
              <Text style={styles.filterSubtitle}>Niveaux</Text>
              <View style={styles.chipContainer}>
                {availableNiveaux.map((niveau) => (
                  <Chip
                    key={niveau.value}
                    onPress={() => handleNiveauSelect(niveau.value)}
                    selected={selectedNiveau === niveau.value}
                    style={[
                      styles.chip,
                      selectedNiveau === niveau.value && styles.selectedChip,
                    ]}
                    textStyle={styles.chipText}
                    mode="outlined"
                  >
                    {niveau.label}
                  </Chip>
                ))}
              </View>
            </>
          )}

          <Divider style={styles.divider} />
          <View style={styles.buttonContainer}>
            {(selectedFiliere || selectedNiveau) && (
              <Button
                mode="outlined"
                onPress={resetFilters}
                style={[styles.button, styles.resetButton]}
                labelStyle={styles.resetButtonText}
              >
                Réinitialiser
              </Button>
            )}
            {selectedNiveau && onNiveauChange && (
              <Button
                mode="contained"
                onPress={applyFilter}
                style={[styles.button, styles.applyButton]}
                labelStyle={styles.applyButtonText}
              >
                Appliquer
              </Button>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2A44",
    marginBottom: 10,
  },
  filterIcon: {
    marginBottom: 10,
  },
  filterSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  selectedChip: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  chipText: {
    color: "#1F2A44",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 10,
    backgroundColor: "#E5E7EB",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  resetButton: {
    borderColor: "#FF6B6B",
  },
  resetButtonText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#4A90E2",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
