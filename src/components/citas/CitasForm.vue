<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import * as Yup from "yup";
import { useMedicamentoStore } from "@/stores/medicamentoStore";
import { useConsultaStore } from "@/stores/useConsultaStore";
import type { Consulta } from "@/services/ConsultaService";
import type { Mascota } from "@/interfaces/Mascota";
import { jwtDecode } from "jwt-decode";
import { useStorage } from "@vueuse/core";

const token = useStorage("token", "");
const userEmail = ref<string | null>(null);
const userRole = ref<string | null>(null);

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
}

const decodeToken = () => {
  if (token.value) {
    try {
      const decoded = jwtDecode<JwtPayload>(token.value);
      userEmail.value = decoded.email || null;
      userRole.value = decoded.role || null;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      userEmail.value = null;
      userRole.value = null;
    }
  }
};

const props = defineProps<{
  visible: boolean;
  citaData?: Consulta;
  isEditing: boolean;
  mascotas: Mascota[];
  citasExistentes?: Consulta[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", cita: Consulta): void;
}>();

const medicamentoStore = useMedicamentoStore();
const consultaStore = useConsultaStore();
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

const isLoading = ref(false);
const mostrarMedicamentos = computed(() => cita.value.estatus === 2);

const removeHTMLTags = (str: string) => str.replace(/<[^>]*>/g, '');

const citaSchema = Yup.object().shape({
  motivo: Yup.string()
    .test("no-html", "El motivo no puede contener etiquetas HTML.", (value) => {
      if (value) {
        return !/<[^>]*>/g.test(value);
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
        medicamentosIds: [...(newData.medicamentosIds || [])],
      };

      if (props.isEditing) {
        await medicamentoStore.fetchMedicamentos();
      }
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
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
      medicamentosIds: [...(cita.value.medicamentosIds || [])],
    };

    if (mostrarMedicamentos.value && cita.value.medicamentosIds.length > 0) {
      isLoading.value = true;
      for (const medicamentoId of cita.value.medicamentosIds) {
        await consultaStore.assignMedicamento(cita.value.id, medicamentoId);
      }
      isLoading.value = false;
    }

    emit("submit", citaFormateada);
    emit("update:visible", false);
  }
};

const isRecepcionista = computed(() => userRole.value === "Recepcionista");

onMounted(() => {
  decodeToken();
});
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

      <div class="mb-4" v-if="(mostrarMedicamentos &&  !isRecepcionista)">
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
