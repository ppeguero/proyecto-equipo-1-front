<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localCliente.nombre"
        placeholder="Nombre"
        :class="{ 'p-invalid': errors.nombre }"
        class="custom-input"
      />
      <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localCliente.apellido"
        placeholder="Apellido"
        :class="{ 'p-invalid': errors.apellido }"
        class="custom-input"
      />
      <small v-if="errors.apellido" class="p-error">{{ errors.apellido }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localCliente.direccion"
        placeholder="Dirección"
        :class="{ 'p-invalid': errors.direccion }"
        class="custom-input"
      />
      <small v-if="errors.direccion" class="p-error">{{ errors.direccion }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localCliente.telefono"
        placeholder="Teléfono"
        :class="{ 'p-invalid': errors.telefono }"
        class="custom-input"
      />
      <small v-if="errors.telefono" class="p-error">{{ errors.telefono }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <label class="font-semibold">Mascotas</label>
      <div v-if="localCliente.mascotas && localCliente.mascotas.length > 0" class="flex flex-col gap-2">
        <div v-for="mascota in localCliente.mascotas" :key="mascota.id" class="flex items-center gap-2">
          <Button
          :value="mascota.nombre"
          severity="info"
          :label="mascota.nombre"
          variant="outlined"
          style="border-radius: 20px; font-size: .8em; height: 1vh;"
          />
          <Button
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-danger"
            @click="removeMascota(mascota.id)"
          />
        </div>
      </div>
      <small v-else class="text-gray-500">No hay mascotas asociadas</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import * as Yup from "yup";
import type { Cliente } from "@/interfaces/Cliente";

interface ClienteForm {
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  mascotas: { id: number; nombre: string }[];
}

const props = defineProps<{
  cliente?: Partial<Cliente>;
}>();

const localCliente = ref<ClienteForm>({
  nombre: "",
  apellido: "",
  direccion: "",
  telefono: "",
  mascotas: [],
});

const errors = ref<Partial<Record<keyof ClienteForm, string>>>({});

const clienteSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  apellido: Yup.string().required("El apellido es requerido"),
  direccion: Yup.string().required("La dirección es requerida"),
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^\d+$/, "El teléfono debe ser numérico"),
});

const validateForm = async (): Promise<boolean> => {
  try {
    await clienteSchema.validate(localCliente.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const newErrors: Partial<Record<keyof ClienteForm, string>> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path as keyof ClienteForm] = error.message;
        }
      });
      errors.value = newErrors;
      return false;
    }
    return false;
  }
};

const removeMascota = (mascotaId: number) => {
  localCliente.value.mascotas = localCliente.value.mascotas.filter((m) => m.id !== mascotaId);
};

watch(
  () => props.cliente,
  (newCliente) => {
    if (newCliente) {
      localCliente.value = {
        nombre: newCliente.nombre || "",
        apellido: newCliente.apellido || "",
        direccion: newCliente.direccion || "",
        telefono: newCliente.telefono || "",
        mascotas: newCliente.mascotas?.map(m => ({ id: m.id, nombre: m.nombre || "" })) || [],
      };
    } else {
      localCliente.value = {
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        mascotas: [],
      };
    }
  },
  { immediate: true }
);

defineExpose({
  localCliente,
  validateForm,
});
</script>
