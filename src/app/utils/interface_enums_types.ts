
export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  tipoVinculacion: string;
  cargo: string;
  empresaProveedora?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  tipoVinculacion: string;
  rolSistema: string;
  cargo: string;
  estado: string;
  type?: string;
    };
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    estado: string;
  };
}

export interface AuthUser {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  tipoVinculacion: string;
  rolSistema: string;
  cargo: string;
  estado: string;
}
