// filepath: lib/cookies.ts
import { Cookies } from 'react-cookie';
import { CookieSetOptions } from 'universal-cookie';
import { cookieConfig } from './cookie-config';

const cookies = new Cookies();

// nombre de la cookie de autenticación
const AUTH_TOKEN_NAME = 'auth_token';

// opciones por defecto para la cookie de autenticación
const defaultOptions: CookieSetOptions = {
  path: cookieConfig.path,
  sameSite: cookieConfig.sameSite,
  secure: cookieConfig.secure,
  maxAge: cookieConfig.maxAge,
};

/**
 * Guarda el token JWT en una cookie
 */
export function setAuthCookie(token: string, options?: CookieSetOptions): void {
  cookies.set(AUTH_TOKEN_NAME, token, { ...defaultOptions, ...options });
}

/**
 * Obtiene el token JWT de la cookie
 */
export function getAuthCookie(): string | undefined {
  const token = cookies.get(AUTH_TOKEN_NAME);
  // verificar que el valor de la cookie es una cadena
  return typeof token === 'string' ? token : undefined;
}

/**
 * Elimina la cookie de autenticación
 */
export function removeAuthCookie(): void {
  cookies.remove(AUTH_TOKEN_NAME, { path: '/' });
}

/**
 * Verifica si existe una cookie de autenticación
 */
export function hasAuthCookie(): boolean {
  return !!getAuthCookie();
}
