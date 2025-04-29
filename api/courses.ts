import configApi from "./config";
import { AxiosError } from "axios"; // Si tu utilises axios

// Typage de l'interface (ajusté selon ton backend)
interface Cours {
  id: number;
  heure_debut: string;
  heure_fin: string;
  date: string;
  statut : string;

  salle: { nom: string };
  matiere: { nom: string };
  filiere: { nom: string; id: number };
  niveau: { nom: string; id: number };
}

// Interface pour la réponse paginée
interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

// Récupérer tous les cours
export const getCourses = async (page: number = 1, perPage: number = 5, startDate = null , isToday = null): Promise<PaginatedResponse<Cours>> => {
  try {
    const response = await configApi.get("/courses", {
      params: {
        page,
        per_page: perPage,
        start_date : startDate,
        isToday : isToday
      },
    });
    
    return response.data as PaginatedResponse<Cours>;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la récupération des cours");
  }
};


// Récupérer tous les cours de la semaine
// export const getCoursesWeek = async (startDate : string , endDate : string): Promise<Cours> => {
//   try {
//     const response = await configApi.get("/week/courses", {
//       params: {
//         startDate : startDate,
//         endDate: endDate,
//       },
//     });
//     return response.data as Cours;
//   } catch (error: unknown) {
//     const err = error as AxiosError;
//     throw err.response?.data || new Error("Erreur lors de la récupération des cours de la semaine");
//   }
// };

// Récupérer tous les cours de la semaine
export const getCoursesWeek = async (
  startDate: string,
  endDate: string,
  niveauId?: number
): Promise<Cours> => {
  try {
    const response = await configApi.get("/week/courses", {
      params: {
        startDate,
        endDate,
        ...(niveauId && { niveau_id: niveauId }),
      },
    });
    return response.data as Cours;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la récupération des cours de la semaine");
  }
};

// Récupérer tous les cours en attente de validation
export const getPendingValidationCourses = async (): Promise<Cours[]> => {
  try {
    const response = await configApi.get("/pending-validation/courses" );
    return response.data as Cours[];
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la récupération des cours");
  }
};


// Anuller un cours spécifique
export const cancelCourse = async (id: number): Promise<string> => {
  if (!id) throw new Error("L'ID du cours est requis");
  try {
    const response = await configApi.put(`/cancel/courses/${id}`);
    return response.data ;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error(`Erreur lors de la récupération du cours ${id}`);
  }
}

// Accepter un cours spécifique
export const acceptCourse = async (id: number): Promise<string> => {
  if (!id) throw new Error("L'ID du cours est requis");
  try {
    const response = await configApi.put(`/accept/courses/${id}`);
    return response.data ;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error(`Erreur lors de la récupération du cours ${id}`);
  }
}

//Mettre un cours comme faire
export const markCourseDone = async (courseId: number): Promise<void> => {
  try {
    const response = await configApi.put(`/complete/courses/${courseId}`);
    return ; ;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error(`Erreur lors du marquage du cours ${courseId}`);
  }
};

// Récupérer un cours spécifique
export const getCourse = async (id: string): Promise<Cours> => {
  if (!id) throw new Error("L'ID du cours est requis");
  try {
    const response = await configApi.get(`/courses/${id}`);
    return response.data as Cours;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error(`Erreur lors de la récupération du cours ${id}`);
  }
};

// Ajouter un cours
export const addCourse = async (cours: Cours): Promise<Cours> => {
  try {
    const response = await configApi.post("/courses", cours);
    return response.data as Cours;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de l'ajout du cours");
  }
};

// Mettre à jour un cours
export const updateCourse = async (id: string, cours: Cours): Promise<Cours> => {
  if (!id) throw new Error("L'ID du cours est requis");
  try {
    const response = await configApi.put(`/courses/${id}`, cours);
    return response.data as Cours;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la mise à jour du cours");
  }
};

// Supprimer un cours
export const deleteCourse = async (id: string): Promise<void> => {
  if (!id) throw new Error("L'ID du cours est requis");
  try {
    await configApi.delete(`/courses/${id}`);
    // Pas de return si l'API renvoie 204 No Content
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la suppression du cours");
  }
};