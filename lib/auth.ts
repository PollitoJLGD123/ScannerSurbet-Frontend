import api from './api';

type LoginData = { correo: string; password: string };
export type RegisterData = { nombres: string; apellidos: string; correo: string; password: string; pais: string; codPais: string; celular: string };

interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthPayload {
  token: string;
  user: unknown;
}

export async function login(data: LoginData): Promise<unknown> {
  const res = await api.post<AuthResponse<AuthPayload>>('/api/auth/login', data);
  localStorage.setItem('token', res.data.data.token);
  return res.data.data.user;
}

export async function register(data: RegisterData): Promise<unknown> {
  const res = await api.post<AuthResponse<AuthPayload>>('/api/auth/register', data);
  localStorage.setItem('token', res.data.data.token);
  return res.data.data.user;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
  localStorage.removeItem('token');
}
