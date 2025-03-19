import { type AxiosResponse } from 'axios'
import { apiRequest } from '@/utils/genericHttpRequest'

export interface Consulta {
  id: number
  fecha: string
  hora: string
  motivo: string
  mascotaId?: number
  veterinarioId?: number
  medicamentosIds: number[]
}

export interface ConsultaDto {
  id?: number
  fecha: string
  hora: string
  motivo: string
  mascotaId?: number
  veterinarioId?: number
  medicamentosIds: number[]
}

export const consultaService = {
  getAll: async (): Promise<AxiosResponse<Consulta[]>> => {
    return apiRequest<null, AxiosResponse<Consulta[]>>({ method: 'get', url: '/Consultas' })
  },

  getById: async (id: number): Promise<AxiosResponse<Consulta>> => {
    return apiRequest<null, AxiosResponse<Consulta>>({ method: 'get', url: `/Consultas/${id}` })
  },

  create: async (consultaDto: ConsultaDto): Promise<AxiosResponse<Consulta>> => {
    return apiRequest<ConsultaDto, AxiosResponse<Consulta>>({
      method: 'post',
      url: '/Consultas',
      data: consultaDto,
    })
  },

  update: async (id: number, consultaDto: ConsultaDto): Promise<AxiosResponse<void>> => {
    return apiRequest<ConsultaDto, AxiosResponse<void>>({
      method: 'put',
      url: `/Consultas/${id}`,
      data: consultaDto,
    })
  },

  delete: async (id: number): Promise<AxiosResponse<void>> => {
    return apiRequest<null, AxiosResponse<void>>({ method: 'delete', url: `/Consultas/${id}` })
  },

  assignMedicamento: async (
    consultaId: number,
    medicamentoId: number,
  ): Promise<AxiosResponse<void>> => {
    return apiRequest<null, AxiosResponse<void>>({
      method: 'post',
      url: `/Consultas/${consultaId}/medicamentos/${medicamentoId}`,
    })
  },

  getByVeterinario: async (veterinarioId: number): Promise<AxiosResponse<Consulta[]>> => {
    return apiRequest<null, AxiosResponse<Consulta[]>>({
      method: 'get',
      url: `/Consultas/veterinario/${veterinarioId}`,
    })
  },

  getByMascota: async (mascotaId: number): Promise<AxiosResponse<Consulta[]>> => {
    return apiRequest<null, AxiosResponse<Consulta[]>>({
      method: 'get',
      url: `/Consultas/mascota/${mascotaId}`,
    })
  },
}
