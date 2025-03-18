export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  mascotas: { id: number; nombre: string }[];
  nombreCompleto: string;
}

export type ClienteCreateDto = Omit<Cliente, 'id' | 'mascotas' | 'nombreCompleto'>;

export type ClienteUpdateDto = Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion' | 'telefono'> & {
  mascotasIds: number[];
};
