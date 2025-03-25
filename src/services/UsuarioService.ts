import { apiRequest } from '@/utils/genericHttpRequest';
import type { AxiosResponse } from 'axios';
import type { UsuarioDto } from '@/interfaces/UsuarioDto';

export const usuarioService = {
  getAll: async (): Promise<UsuarioDto[]> => {
    const response = await apiRequest<null, AxiosResponse<UsuarioDto[]>>({
      method: 'get',
      url: '/Usuarios',
      config: { addToken: true },
    });
    return response.data;
  },

  getById: async (id: number): Promise<UsuarioDto> => {
    const response = await apiRequest<null, AxiosResponse<UsuarioDto>>({
      method: 'get',
      url: `/Usuarios/${id}`,
      config: { addToken: true },
    });
    return response.data;
  },

  update: async (usuario: UsuarioDto): Promise<void> => {
    await apiRequest<UsuarioDto, AxiosResponse<void>>({
      method: 'put',
      url: `/Usuarios/${usuario.id}`,
      data: usuario,
      config: { addToken: true },
    });
  },

  updatePassword: async (id: number, password: string): Promise<void> => {
    await apiRequest<{ password: string }, AxiosResponse<void>>({
      method: 'post',
      url: `/Usuarios/${id}/password`,
      data: { password },
      config: { addToken: true },
    });
  },
};
