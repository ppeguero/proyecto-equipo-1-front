import { defineStore } from "pinia";
import { rolService } from "@/services/RolService";
import type { RolDto } from "@/interfaces/RolDto";

export const useRolStore = defineStore("rol", {
  state: () => ({
    roles: [] as RolDto[],
  }),

  actions: {
    async fetchRoles() {
      try {
        this.roles = await rolService.getAll();
        return this.roles;
      } catch (error) {
        console.error("Error al obtener roles:", error);
        throw error;
      }
    },
  },
});