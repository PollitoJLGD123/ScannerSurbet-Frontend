import api from './api';
import UserProfile from './types';
import { setAuthCookie, removeAuthCookie, hasAuthCookie } from './cookies';

type LoginData = { correo: string; password: string };
export type RegisterData = { nombres: string; apellidos: string; correo: string; password: string; pais: string; codPais: string; celular: string };

interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthPayload {
  token: string;
  user: UserProfile;
}

export async function login(data: LoginData): Promise<UserProfile> {
  const res = await api.post<AuthResponse<AuthPayload>>('api/auth/login', data);
  setAuthCookie(res.data.data.token);
  return res.data.data.user;
}

export async function register(data: RegisterData): Promise<UserProfile> {
  const res = await api.post<AuthResponse<AuthPayload>>('api/auth/register', data);
  setAuthCookie(res.data.data.token);
  return res.data.data.user;
}

export async function logout(): Promise<void> {
  try {
    if (hasAuthCookie()) {
      await api.post('api/auth/logout');
    }
  } finally {
    removeAuthCookie();
    window.location.href = '/login'; 
  }
}

export async function getCurrentUser(): Promise<UserProfile> {
  if (!hasAuthCookie()) {
    throw new Error('No hay sesión activa');
  }
  const res = await api.get<AuthResponse<UserProfile>>('api/user/me');
  
  return res.data.data;
}

export function isAuthenticated(): boolean {
  return hasAuthCookie();
}
