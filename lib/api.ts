import axios from 'axios';
import { getAuthCookie, removeAuthCookie } from './cookies';

const api = axios.create({
  baseURL: process.env.API_URL_LOCAL,
});

// añadir token de autenticación a todas las peticiones
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && config.headers) {
    const token = getAuthCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// manejador para errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLogout = error.config.url?.includes('api/auth/logout');

      if (!isLogout && typeof window !== 'undefined') {
        removeAuthCookie();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
