<script setup lang="ts">
import { ref, watch, computed } from "vue";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type { Consulta } from "@/services/ConsultaService";
import type { Mascota } from "@/interfaces/Mascota";


const props = defineProps<{
  visible: boolean;
  citaData?: Consulta;
  isEditing: boolean;
  mascotas: Mascota[];
  citasExistentes?: Consulta[];
}>();

console.log("CitasForm props:", props.citasExistentes);

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

const generarHorarios = () => {
  const horarios = [];
  let hora = 12;
  const minutos = "30";

  for (let i = 0; i < 9; i++) {
    horarios.push(`${hora.toString().padStart(2, "0")}:${minutos}`);
    hora++;
  }

  return horarios;
};

const cita = ref<Consulta>({
  id: 0,
  fecha: new Date(),
  hora: "",
  estatus: 0,
  motivo: "",
  mascotaId: undefined,
  veterinarioId: undefined,
  medicamentosIds: [],
});

const formatearFecha = (fecha: Date) => {
  return fecha.toISOString().split("T")[0];
};

const horariosDisponibles = computed(() => {
  if (!cita.value.fecha) return generarHorarios();
  const fechaSeleccionada = formatearFecha(cita.value.fecha);
  const citasDelDia = (props.citasExistentes ?? []).filter(
    (c) => formatearFecha(new Date(c.fecha)) === fechaSeleccionada
  );
  console.log("Citas del día:", citasDelDia);
  const horariosOcupados = citasDelDia.map((c) => {
    const [hora, minutos] = c.hora.split(':');
    return `${hora.padStart(2, '0')}:${minutos}`;
  });
  console.log("Horarios ocupados:", horariosOcupados);
  const disponibles = generarHorarios().filter((hora) => !horariosOcupados.includes(hora));
  console.log("Horarios disponibles:", disponibles);

  return disponibles;
});

watch(
  () => props.citaData,
  (newData) => {
    if (newData) {
      cita.value = {
        ...newData,
        fecha: newData.fecha ? new Date(newData.fecha) : new Date(),
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  const citaFormateada = {
    id: cita.value.id || 0,
    fecha: cita.value.fecha.toISOString(),
    hora: cita.value.hora,
    estatus: cita.value.estatus,
    motivo: cita.value.motivo,
    mascotaId: cita.value.mascotaId,
    veterinarioId: cita.value.veterinarioId,
    medicamentosIds: cita.value.medicamentosIds || [],
  };

  console.log("Enviando cita:", citaFormateada);
  emit("submit", citaFormateada);
  emit("update:visible", false);
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-gray-700">Motivo</label>
        <InputText v-model="cita.motivo" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Fecha</label>
        <Calendar
          v-model="cita.fecha"
          dateFormat="yy-mm-dd"
          class="w-full"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Hora</label>
        <Dropdown
          v-model="cita.hora"
          :options="horariosDisponibles"
          class="w-full"
          required
          placeholder="Selecciona una hora"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Mascota</label>
        <Dropdown
          v-model="cita.mascotaId"
          :options="mascotas"
          optionLabel="nombre"
          optionValue="id"
          class="w-full"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Estatus</label>
        <Dropdown
          v-model="cita.estatus"
          :options="estatusOpciones"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          required
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancelar"
          severity="secondary"
          @click="$emit('update:visible', false)"
        />
        <Button
          :label="isEditing ? 'Actualizar' : 'Agregar'"
          type="submit"
          severity="primary"
        />
      </div>
    </form>
  </div>
</template>
