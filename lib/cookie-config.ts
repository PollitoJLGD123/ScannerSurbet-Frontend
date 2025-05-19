// Configuraciones para las cookies en Next.js
export const cookieConfig = {
  // duración
  maxAge: 24 * 60 * 60,
  // solo http, sin javascritpt
  httpOnly: true,
  // conexiones https en produccion
  secure: process.env.NODE_ENV === 'production',
  // cookies solo para este origen (evita CSRF)
  sameSite: 'strict' as const,
  // path donde la cookie si es válida
  path: '/',
};
