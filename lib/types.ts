// perfil de usuario autenticado proveniente del backend
type UserProfile = {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  pais: string;
  active?: boolean;
};

export default UserProfile;
