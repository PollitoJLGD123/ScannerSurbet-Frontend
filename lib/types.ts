// perfil de usuario autenticado proveniente del backend
type UserProfile = {
  userId: number;
  correo: string;      // Correo electrónico del usuario
  nombres?: string;
  apellidos?: string;
  pais?: string;
  active?: boolean;
  iat?: number;
  exp?: number;
};

export default UserProfile;
