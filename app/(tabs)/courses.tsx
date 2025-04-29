import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import EmptyElement from "@/component/common/EmptyElement";
import { SkeletonPage } from "@/component/common/skeletonPage";
import { FlatListCardCourse } from "@/component/flatListCard/FlatListCardCourse";
import useFetch from "@/hooks/useFetch";
import { getCourses } from "@/api/courses";
import { getFilieres } from "@/api/filieres";
import { CourseFilter } from "@/component/common/CourseFilter";
import { AuthContext } from "@/context/AuthContext";

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

export default function Courses() {
  const { user } = useContext(AuthContext);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const {
    data: initialResponse,
    loading: isLoading,
    error,
    refetch,
  } = useFetch<PaginatedResponse<CourseItem>>(getCourses, [1, 5, startDate]);

  // Récupération des filières et niveaux
  const {
    data: filieres,
    loading: filieresLoading,
    error: filieresError,
    refetch: refetchFiliere,
  } = useFetch<FiliereItem[]>(getFilieres);

  // État pour les cours filtrés
  const [filteredCourses, setFilteredCourses] =
    useState<PaginatedResponse<CourseItem> | null>(null);

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
      <View style={styles.container}>
        <EmptyElement message={`Erreur : ${error || filieresError}`} />
      </View>
    );
  }

  if (!filieres || filieres.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyElement message="Aucune filière disponible" />
      </View>
    );
  }

  if (!filteredCourses || filteredCourses.data.length === 0) {
    return (
      <View style={styles.container}>
        <CourseFilter
          filieres={filieres}
          initialCourses={initialResponse}
          setFilteredCourses={setFilteredCourses}
        />
        <EmptyElement message="Aucun cours pour cette sélection" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user.personne.role == "etudiant" ||
      user.personne.role == "delegue" ? null : (
        <CourseFilter
          filieres={filieres}
          initialCourses={initialResponse}
          setFilteredCourses={setFilteredCourses}
        />
      )}

      <FlatListCardCourse initialData={filteredCourses} refetch={refetch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
});
