export interface UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles?: string[];
  consultasIds?: number[];
}
