import { defineStore } from "pinia";
import { usuarioService } from "@/services/UsuarioService";
import type { UsuarioDto } from "@/interfaces/UsuarioDto";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import { ref } from "vue";

interface JwtPayload {
  nameid?: string;
  role: string;
}

export const useUsuarioStore = defineStore("usuario", () => {
  const usuario = ref<UsuarioDto | null>(null);
  const usuarios = ref<UsuarioDto[]>([]);
  const token = useStorage("token", "");

  function getDecodedToken() {
    if (!token.value) return null;
    try {
      return jwtDecode<JwtPayload>(token.value);
    } catch (error) {
      // console.error("Error decoding token:", error);
      return null;
    }
  }

  async function getAllUsuarios() {
    try {
      usuarios.value = await usuarioService.getAll();
      return usuarios.value;
    } catch (error) {
      // console.error("Error fetching users:", error);
      throw error;
    }
  }

  async function getUsuarioById(id: number) {
    try {
      usuario.value = await usuarioService.getById(id);
      return usuario.value;
    } catch (error) {
      // console.error("Error fetching user:", error);
      throw error;
    }
  }

  async function updateUsuario(updatedUsuario: UsuarioDto) {
    try {
      await usuarioService.update(updatedUsuario);
      usuario.value = { ...updatedUsuario };
    } catch (error) {
      // console.error("Error updating user:", error);
      throw error;
    }
  }

  async function updatePassword(id: number, password: string) {
    try {
      await usuarioService.updatePassword(id, password);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  async function deleteUsuario(id: number) {
    try {
      await usuarioService.delete(id);
      usuario.value = null;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async function updateUserAdmin(id: number, usuario: UsuarioDto) {
    try {
      await usuarioService.updateAdmin(id, usuario);
    } catch (error) {
      console.error("Error updating user admin:", error);
      throw error;
    }
  }

  async function addUser(usuario: UsuarioDto) {
    try {
      await usuarioService.create(usuario);
      usuarios.value.push(usuario);
    } catch (error) {
      // console.error("Error adding user:", error);
      throw error;
    }
  }

  return {
    usuario,
    usuarios,
    token,
    getDecodedToken,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    updatePassword,
    deleteUsuario,
    updateUserAdmin,
    addUser,
  };
});
