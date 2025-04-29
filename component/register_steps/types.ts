export interface FormData {
    role: string;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    tel: string;
    sexe: "M" | "F";
    date_naissance: string;
    filiere: string;
    niveau: string;
  }
  
  export interface FiliereItem {
    id: number;
    nom: string;
    description: string;
    niveaux: {
      id: number;
      nom: string;
      filiere_id: number;
    }[];
  }
  
  export interface Errors {
    errors: {
      [key: string]: string[];
    };
  }