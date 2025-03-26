<script setup lang="ts">
import { ref, watch, computed } from "vue";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner"; // Importar el componente de carga
import * as Yup from "yup"; // Importar Yup para la validación
import { useMedicamentoStore } from "@/stores/medicamentoStore";
import { useConsultaStore } from "@/stores/useConsultaStore"; // Importar el store de consultas
import type { Consulta } from "@/services/ConsultaService";
import type { Mascota } from "@/interfaces/Mascota";

const props = defineProps<{
  visible: boolean;
  citaData?: Consulta;
  isEditing: boolean; // Importante para saber si estamos editando o creando
  mascotas: Mascota[];
  citasExistentes?: Consulta[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", cita: Consulta): void;
}>();

const medicamentoStore = useMedicamentoStore();
const consultaStore = useConsultaStore(); // Obtener el store de consultas
const medicamentosDisponibles = computed(() => medicamentoStore.medicamentos);

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

const formatearFecha = (fecha: Date) => fecha.toISOString().split("T")[0];

const horariosDisponibles = computed(() => {
  if (!cita.value.fecha) return generarHorarios();
  const fechaSeleccionada = formatearFecha(cita.value.fecha);
  const citasDelDia = (props.citasExistentes ?? []).filter(
    (c) => formatearFecha(new Date(c.fecha)) === fechaSeleccionada
  );
  const horariosOcupados = citasDelDia.map((c) => {
    const [hora, minutos] = c.hora.split(":");
    return `${hora.padStart(2, "0")}:${minutos}`;
  });
  return generarHorarios().filter((hora) => !horariosOcupados.includes(hora));
});

// Estado de carga
const isLoading = ref(false);

// Validación con Yup y regex para evitar etiquetas HTML
const removeHTMLTags = (str: string) => str.replace(/<[^>]*>/g, ''); // Elimina etiquetas HTML

const citaSchema = Yup.object().shape({
  motivo: Yup.string()
    .test("no-html", "El motivo no puede contener etiquetas HTML.", (value) => {
      if (value) {
        return !/<[^>]*>/g.test(value); // Detecta si hay etiquetas HTML
      }
      return true;
    })
    .required("El motivo es requerido"),
  fecha: Yup.date().required("La fecha es requerida"),
  hora: Yup.string().required("La hora es requerida"),
  mascotaId: Yup.number().required("Selecciona una mascota"),
  estatus: Yup.number().required("Selecciona un estatus"),
  medicamentosIds: Yup.array().of(Yup.number()).optional(),
});

const validateForm = async () => {
  try {
    await citaSchema.validate(cita.value, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const newErrors: Partial<Record<keyof Consulta, string>> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path as keyof Consulta] = error.message;
        }
      });
      return newErrors;
    }
    return {};
  }
};

watch(
  () => props.citaData,
  async (newData) => {
    if (newData) {
      cita.value = {
        ...newData,
        fecha: newData.fecha ? new Date(newData.fecha) : new Date(),
        medicamentosIds: [...(newData.medicamentosIds || [])], // Evita referencias directas
      };

      // Cargar medicamentos solo si estamos editando
      if (props.isEditing) {
        await medicamentoStore.fetchMedicamentos();
      }
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  // Limpiar el motivo de cualquier etiqueta HTML antes de enviar
  cita.value.motivo = removeHTMLTags(cita.value.motivo);

  const valid = await validateForm();
  if (valid) {
    const citaFormateada = {
      id: cita.value.id || 0,
      fecha: cita.value.fecha.toISOString(),
      hora: cita.value.hora,
      estatus: cita.value.estatus,
      motivo: cita.value.motivo,
      mascotaId: cita.value.mascotaId,
      veterinarioId: cita.value.veterinarioId,
      medicamentosIds: [...(cita.value.medicamentosIds || [])], // Asegura que siempre haya un array
    };

    // Si hay medicamentos asignados, asignarlos a la consulta
    if (cita.value.medicamentosIds.length > 0) {
      isLoading.value = true; // Activar el loading
      for (const medicamentoId of cita.value.medicamentosIds) {
        await consultaStore.assignMedicamento(cita.value.id, medicamentoId);
      }
      isLoading.value = false; // Desactivar el loading
    }

    emit("submit", citaFormateada);
    emit("update:visible", false);
  }
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
        <Calendar v-model="cita.fecha" dateFormat="yy-mm-dd" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Hora</label>
        <Dropdown v-model="cita.hora" :options="horariosDisponibles" class="w-full" required placeholder="Selecciona una hora" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Mascota</label>
        <Dropdown v-model="cita.mascotaId" :options="mascotas" optionLabel="nombre" optionValue="id" class="w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Estatus</label>
        <Dropdown v-model="cita.estatus" :options="estatusOpciones" optionLabel="label" optionValue="value" class="w-full" required />
      </div>

      <!-- Selector de Medicamentos (Solo en edición) -->
      <div class="mb-4" v-if="props.isEditing">
        <label class="block text-gray-700">Medicamentos</label>
        <MultiSelect
          v-model="cita.medicamentosIds"
          :options="medicamentosDisponibles"
          optionLabel="nombre"
          optionValue="id"
          class="w-full"
          placeholder="Selecciona los medicamentos"
        />
      </div>

      <!-- Indicador de Carga -->
      <div v-if="isLoading" class="absolute inset-0 flex justify-center items-center bg-[#fff] bg-opacity-50 z-50">
        <ProgressSpinner style="width: 50px; height: 50px;" />
      </div>

      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="$emit('update:visible', false)" />
        <Button :label="props.isEditing ? 'Actualizar' : 'Agregar'" type="submit" severity="primary" />
      </div>
    </form>
  </div>
</template>
