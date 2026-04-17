import { UserImageProfile } from "./imageProfile.type";

export interface UserProfile {
  username: string;
  nombreCompleto: string;
  nombre: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  datosContacto: {
    tipoContacto: string;
    correo: string;
    telefono: string;
    ubicacion: string;
    documento: {
      tipo: string;
      numero: string;
    }
  };
  rrss: {
    tipo: string;
    enlace: string;
  }[];
  assets: UserImageProfile;
  cargo: string;
  telefono: string;
  ubicacion: string;
}