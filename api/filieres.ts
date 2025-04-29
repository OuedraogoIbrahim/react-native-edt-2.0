import axios, { AxiosError } from "axios";
import configApi from "./config";


interface Filiere {
    id: number; 
    nom : string , 
    description : string,
    niveaux : {
        id : number , 
        nom : string,
        filiere_id : number
    }[]
}
export const getFilieres = async () => {
try {
    const response = await configApi.get("/filieres");
    return response.data as Filiere[];
} catch (error: unknown) {
    const err = error as AxiosError;
    throw err.response?.data || new Error("Erreur lors de la récupération des cours");
}
}