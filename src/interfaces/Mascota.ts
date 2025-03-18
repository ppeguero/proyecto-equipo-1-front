export interface Mascota {
  id: number;
  nombre: string;
  fechaRegistro: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  urlImagen: string | null;
  clienteId: number | null;
  consultasIds: number[];
}

export type MascotaCreateDto = Omit<Mascota, 'id' | 'fechaRegistro' | 'urlImagen' | 'consultasIds' | 'clienteId'> & {
  clienteId: number;
  imagenFile?: File;
};

export type MascotaUpdateDto = Pick<Mascota, 'id' | 'nombre' | 'especie' | 'raza' | 'fechaNacimiento' | 'clienteId'> & {
  urlImagen?: string;
  imagenFile?: File;
};
