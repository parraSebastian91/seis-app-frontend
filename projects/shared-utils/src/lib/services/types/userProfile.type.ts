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
  avatar: {
    name: string;
    urls: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  cargo: string;
  telefono: string;
  ubicacion: string;
}