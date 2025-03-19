export interface Medicamento {
    id: number;
    nombre: string;
    descripcion: string;
    dosis: string;
    fechaVencimiento: string;
    stock: number;
    fechaCreacion: string;
    consultasIds: number[];
  }
  
  export type MedicamentoCreateDto = Omit<Medicamento, 'id' | 'fechaCreacion' | 'consultasIds'>;
  
  export type MedicamentoUpdateDto = Pick<Medicamento, 'id' | 'nombre' | 'descripcion' | 'dosis' | 'fechaVencimiento' | 'stock'>;