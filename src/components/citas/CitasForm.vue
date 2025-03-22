<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-gray-700">Motivo</label>
        <InputText v-model="cita.motivo" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Fecha</label>
        <Calendar v-model="cita.fecha" dateFormat="yy-mm-dd" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Hora</label>
        <InputText v-model="cita.hora" type="time" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Estatus</label>
        <Dropdown v-model="cita.estatus" :options="estatusOpciones" optionLabel="label" optionValue="value" class="w-full" required />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="$emit('update:visible', false)" />
        <Button :label="isEditing ? 'Actualizar' : 'Agregar'" type="submit" severity="primary" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type { Consulta } from "@/services/ConsultaService";

// Props y eventos
const props = defineProps<{
  visible: boolean;
  citaData?: Consulta;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", cita: Consulta): void;
}>();

const estatusOpciones = [
  { label: "Pendiente", value: 0 },
  { label: "En proceso", value: 1 },
  { label: "Completado", value: 2 },
  { label: "Cancelado", value: 3 },
];

const cita = ref<Consulta>({
  id: 0,
  fecha: "",
  hora: "",
  estatus: 0,
  motivo: "",
  mascotaId: undefined,
  veterinarioId: undefined,
  medicamentosIds: [],
});

watch(
  () => props.citaData,
  (newData) => {
    if (newData) {
      cita.value = { ...newData };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", { ...cita.value });
  emit("update:visible", false);
};
</script>
