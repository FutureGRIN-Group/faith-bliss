import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const auth = getAuth();

api.interceptors.request.use(async (config) => {
  //Retrieve Access token form local storage and Inject into request before it is sent
  const accessToken = await auth.currentUser?.getIdToken(true);
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
