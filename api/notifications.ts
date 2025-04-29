import { AxiosError } from "axios";
import configApi from "./config";

export const getNotifications = async () => {
    try {
        const response = await configApi.get("/notifications");
        
        return response.data ;
      } catch (error: unknown) {
        console.log(error);
        console.log('Une erreur est survenue');
        
        const err = error as AxiosError;
        throw err.response?.data || new Error("Erreur lors de la récupération des");
      }
}