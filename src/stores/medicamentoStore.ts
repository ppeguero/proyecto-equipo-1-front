import { defineStore } from "pinia";
import { ref } from "vue";
import { medicamentoService } from "../services/MedicamentoService";
import type { Medicamento, MedicamentoCreateDto, MedicamentoUpdateDto } from "@/interfaces/Medicamento";

export const useMedicamentoStore = defineStore("medicamento", () => {
  const medicamentos = ref<Medicamento[]>([]);

  async function fetchMedicamentos() {
    try {
      medicamentos.value = await medicamentoService.getAll();
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
    }
  }

  async function addMedicamento(medicamento: MedicamentoCreateDto) {
    try {
      const nuevoMedicamento = await medicamentoService.create(medicamento);
      medicamentos.value.push(nuevoMedicamento);
    } catch (error) {
      console.error("Error al agregar medicamento:", error);
      throw error;
    }
  }

  async function updateMedicamento(id: number, medicamento: MedicamentoUpdateDto) {
    try {
      await medicamentoService.update(id, medicamento);
      const index = medicamentos.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        const updatedMedicamento = await medicamentoService.getById(id);
        medicamentos.value[index] = updatedMedicamento;
      }
    } catch (error) {
      console.error("Error al actualizar medicamento:", error);
      throw error;
    }
  }

  async function deleteMedicamento(id: number) {
    try {
      await medicamentoService.delete(id);
      medicamentos.value = medicamentos.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      throw error;
    }
  }

  return { medicamentos, fetchMedicamentos, addMedicamento, updateMedicamento, deleteMedicamento };
});