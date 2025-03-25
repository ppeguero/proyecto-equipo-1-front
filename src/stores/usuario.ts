import { defineStore } from "pinia";
import { usuarioService } from "@/services/UsuarioService";
import type { UsuarioDto } from "@/interfaces/UsuarioDto";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nameid?: string;
  role: string;
}

export const useUsuarioStore = defineStore("usuario", {
  state: () => ({
    usuario: null as UsuarioDto | null,
    usuarios: [] as UsuarioDto[],
    token: useStorage("token", ""), 
  }),

  actions: {
    getDecodedToken() {
      if (!this.token) return null;
      try {
        return jwtDecode<JwtPayload>(this.token);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    },
    async getAllUsuarios() {
      try {
        this.usuarios = await usuarioService.getAll();
        return this.usuarios;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    async getUsuarioById(id: number) {
      try {
        this.usuario = await usuarioService.getById(id);
        return this.usuario;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },

    async updateUsuario(usuario: UsuarioDto) {
      try {
        await usuarioService.update(usuario);
        this.usuario = { ...usuario };
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async updatePassword(id: number, password: string) {
      try {
        await usuarioService.updatePassword(id, password);
      } catch (error) {
        console.error("Error updating password:", error);
        throw error;
      }
    },
  },

  
});
