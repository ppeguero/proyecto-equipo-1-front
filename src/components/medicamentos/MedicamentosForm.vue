<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localMedicamento.nombre"
        placeholder="Nombre de Medicamento"
        :class="{ 'p-invalid': errors.nombre }"
        class="custom-input"
      />
      <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localMedicamento.descripcion"
        placeholder="Descripción"
        :class="{ 'p-invalid': errors.descripcion }"
        class="custom-input"
      />
      <small v-if="errors.descripcion" class="p-error">{{ errors.descripcion }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localMedicamento.dosis"
        placeholder="Dosis Recomendada"
        :class="{ 'p-invalid': errors.dosis }"
        class="custom-input"
      />
      <small v-if="errors.dosis" class="p-error">{{ errors.dosis }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <label for="fechaVencimiento" class="font-semibold">Fecha de Vencimiento</label>
      <DatePicker
        v-model="localMedicamento.fechaVencimiento"
        placeholder="Fecha de Vencimiento"
        dateFormat="yy-mm-dd"
        :class="{ 'p-invalid': errors.fechaVencimiento }"
        class="custom-input"
      />
      <small v-if="errors.fechaVencimiento" class="p-error">{{ errors.fechaVencimiento }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputNumber
        v-model="localMedicamento.stock"
        placeholder="Stock"
        :class="{ 'p-invalid': errors.stock }"
        class="custom-input"
      />
      <small v-if="errors.stock" class="p-error">{{ errors.stock }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import InputNumber from "primevue/inputnumber";
import * as Yup from "yup";
import type { Medicamento } from "@/interfaces/Medicamento";

interface LocalMedicamento {
  nombre: string;
  descripcion: string;
  dosis: string;
  fechaVencimiento: string;
  stock: number;
}

const props = defineProps<{
  medicamento?: Partial<Medicamento>;
}>();

const localMedicamento = ref<LocalMedicamento>({
  nombre: "",
  descripcion: "",
  dosis: "",
  fechaVencimiento: "",
  stock: 0,
});

const errors = ref<Partial<Record<keyof LocalMedicamento, string>>>({});

const medicamentoSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  descripcion: Yup.string().required("La descripción es requerida"),
  dosis: Yup.string().required("La dosis es requerida"),
  fechaVencimiento: Yup.string().required("La fecha de vencimiento es requerida"),
  stock: Yup.number().required("El stock es requerido").min(0, "El stock no puede ser negativo"),
});

const validateForm = async (): Promise<boolean> => {
  try {
    await medicamentoSchema.validate(localMedicamento.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const newErrors: Partial<Record<keyof LocalMedicamento, string>> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path as keyof LocalMedicamento] = error.message;
        }
      });
      errors.value = newErrors;
      return false;
    }
    return false;
  }
};

watch(
  () => props.medicamento,
  (newMedicamento) => {
    if (newMedicamento) {
      localMedicamento.value = {
        nombre: newMedicamento.nombre || "",
        descripcion: newMedicamento.descripcion || "",
        dosis: newMedicamento.dosis || "",
        fechaVencimiento: newMedicamento.fechaVencimiento || "",
        stock: newMedicamento.stock || 0,
      };
    } else {
      localMedicamento.value = {
        nombre: "",
        descripcion: "",
        dosis: "",
        fechaVencimiento: "",
        stock: 0,
      };
    }
  },
  { immediate: true }
);

defineExpose({
  localMedicamento,
  validateForm,
});
</script>

<style scoped>
.custom-input {
  border: 1px solid #0052a5 !important;
  padding: 0.5rem;
  color: rgb(0, 0, 0);
}

.custom-input:focus {
  border-color: #003366 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 31, 63, 0.2) !important;
}

.p-invalid {
  border-color: #dc3545 !important;
}

.p-error {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>