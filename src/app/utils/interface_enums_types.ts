
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

export interface FamilyRelationship {
  _id: string;
  usuario: string;
  familiar: {
    _id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    tipoVinculacion: string;
    rolSistema: string;
    cargo: string;
    estado: string;
  };
  parentesco: string;
  fechaDeclaracion: string;
  fechaConflicto?: string | null;
}

export interface CreateFamilyRelationshipRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  parentesco: string;
}

export interface FamilyRelationshipsResponse {
  success: boolean;
  data: FamilyRelationship[];
}

export interface CreateFamilyRelationshipResponse {
  success: boolean;
  message: string;
  data: FamilyRelationship;
}

export interface DashboardStats {
  totalUsuarios: number,
  totalConflictos: number,
  conflictosAltoRiesgo: number,
  conflictosPendientes: number,
  tasaResolucion: number,
  tiempoPromedioResolucion: number
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export interface DetectConflictsResponse {
  success: boolean;
  total: number;
  data: unknown[];
}

export interface ConflictInvolved {
  userId: string;
  nombre: string;
  documento: string;
  tipo: string;
  rol: string;
  tipoVinculacion: string;
  correo: string;
  telefono: string;
  area?: string | null;
  empresa?: string | null;
  nit?: string | null;
}
export interface Conflict {
  _id: string;
  codigo: string;
  nivel: 'BAJO' | 'MEDIO' | 'ALTO';
  estado:
    | 'PENDIENTE'
    | 'EN_INVESTIGACION'
    | 'RESUELTO'
    | 'DESCARTADO'
    | 'ESCALADO';
  categoria: Categoria;
  fechaDeteccion: string;
  descripcion: string;
  involucrados: ConflictInvolved[];
}

export interface ConflictsResponse {
  success: boolean;
  data: Conflict[];
}

export type Categoria = 'EMPLEADO' | 'ADMINISTRATIVO' | 'DIRECTIVO' | 'PROVEEDOR'
