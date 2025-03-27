import { defineStore } from "pinia";
import { rolService } from "@/services/RolService";
import type { RolDto } from "@/interfaces/RolDto";
import { ref } from "vue";

export const useRolStore = defineStore("rol", () => {
  const roles = ref<RolDto[]>([]);

  const fetchRoles = async () => {
    try {
      roles.value = await rolService.getAll();
      return roles.value;
    } catch (error) {
      // console.error("Error al obtener roles:", error);
      throw error;
    }
  };

  return {
    roles,
    fetchRoles,
  };
});
