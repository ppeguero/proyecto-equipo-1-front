import { defineStore } from 'pinia';
import { usuarioService } from '@/services/UsuarioService';
import type { UsuarioDto } from '@/interfaces/UsuarioDto';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: null as UsuarioDto | null,
  }),

  actions: {
    async getUsuarioById(id: number) {
      try {
        this.usuario = await usuarioService.getById(id);
        return this.usuario;
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
      }
    },

    async updateUsuario(usuario: UsuarioDto) {
      try {
        await usuarioService.update(usuario);
        this.usuario = { ...usuario };
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
      }
    },

    async updatePassword(id: number, password: string) {
      try {
        await usuarioService.updatePassword(id, password);
      } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        throw error;
      }
    },
  },
});
