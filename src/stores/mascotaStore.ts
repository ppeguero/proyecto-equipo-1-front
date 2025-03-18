import { defineStore } from "pinia";
import { ref } from "vue";
import { mascotaService } from "../services/MascotaService";
import type { Mascota, MascotaCreateDto, MascotaUpdateDto } from "@/interfaces/Mascota";

export const useMascotaStore = defineStore("mascota", () => {
  const mascotas = ref<Mascota[]>([]);

  async function fetchMascotas() {
    try {
      mascotas.value = await mascotaService.getAll();
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    }
  }

  async function fetchMascotasByCliente(clienteId: number) {
    try {
      mascotas.value = await mascotaService.getByCliente(clienteId);
    } catch (error) {
      console.error("Error al obtener mascotas por cliente:", error);
    }
  }

  async function addMascota(mascota: MascotaCreateDto) {
    try {
      const nuevaMascota = await mascotaService.create(mascota);
      mascotas.value.push(nuevaMascota);
    } catch (error) {
      console.error("Error al agregar mascota:", error);
      throw error;
    }
  }

  async function updateMascota(id: number, mascota: MascotaUpdateDto) {
    try {
      await mascotaService.update(id, mascota);
      const index = mascotas.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        const updatedMascota = await mascotaService.getById(id);
        mascotas.value[index] = updatedMascota;
      }
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      throw error;
    }
  }

  async function deleteMascota(id: number) {
    try {
      await mascotaService.delete(id);
      mascotas.value = mascotas.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      throw error;
    }
  }

  return { mascotas, fetchMascotas, fetchMascotasByCliente, addMascota, updateMascota, deleteMascota };
});
