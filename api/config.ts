import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const configApi = axios.create({
  baseURL: "http://192.168.11.100:8000/api", 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


configApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default configApi;
