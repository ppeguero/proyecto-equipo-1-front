export interface UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles?: string[];
  consultasIds?: number[];
}

export type UsuarioCreateDto = Omit<UsuarioDto, 'id' | 'consultasIds'>;

export type UsuarioUpdateDto = Pick<UsuarioDto, 'id' | 'nombre' | 'apellido' | 'email'> & {
  roles: string[];
  consultasIds: number[];
};