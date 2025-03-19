<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1">
      <label for="imagen" class="font-semibold">Imagen del paciente</label>
      <div class="card">
        <FileUpload
          name="imagenFile"
          :multiple="false"
          accept="image/*"
          :maxFileSize="1000000"
          @select="onSelectedFiles"
        >
          <template #header="{ chooseCallback, files }">
            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
              <div class="flex gap-2">
                <Button
                  @click="chooseCallback()"
                  icon="pi pi-images"
                  rounded
                  outlined
                  severity="secondary"
                />
                <Button
                  icon="pi pi-times"
                  rounded
                  outlined
                  severity="danger"
                  :disabled="!files || files.length === 0"
                  @click="clearFiles"
                />
              </div>
            </div>
          </template>
          <template #content="{ files }">
            <div v-if="files.length > 0" class="flex flex-col gap-4">
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="(file, index) of files"
                  :key="file.name + file.type + file.size"
                  class="p-4 rounded-border flex flex-col border border-surface items-center gap-2"
                >
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    width="100"
                    height="50"
                  />
                  <span
                    class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                  >
                    {{ file.name }}
                  </span>
                  <Button
                    icon="pi pi-times"
                    @click="removeFile(index)"
                    outlined
                    rounded
                    severity="danger"
                  />
                </div>
              </div>
            </div>
            <div v-else-if="localPet.urlImagen" class="flex justify-center">
              <img
                :src="localPet.urlImagen"
                alt="Imagen actual"
                width="100"
                height="50"
                class="object-cover"
              />
            </div>
          </template>
          <template #empty>
            <div class="flex items-center justify-center flex-col">
              <i
                class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
              />
              <p class="mt-6 mb-0">Arrastra y suelta una imagen aquí para cargar.</p>
            </div>
          </template>
        </FileUpload>
      </div>
      <small v-if="errors.imagenFile" class="p-error">{{ errors.imagenFile }}</small>
    </div>

    <div class="flex flex-col gap-1">
            <label class="font-semibold">Nombre del paciente</label>
      <InputText
        v-model="localPet.nombre"
        placeholder="Ingrese nombre del paciente"
        :class="{ 'p-invalid': errors.nombre }"
        class="custom-input"
      />
      <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
    </div>
    <div class="flex flex-col gap-1">
     <label  class="font-semibold">Raza</label>

      <InputText
        v-model="localPet.raza"
        placeholder="Ingrese nombre de la raza"
        :class="{ 'p-invalid': errors.raza }"
        class="custom-input"
      />
      <small v-if="errors.raza" class="p-error">{{ errors.raza }}</small>
    </div>
    <div class="flex flex-col gap-1">
           <label  class="font-semibold">Especie</label>

      <InputText
        v-model="localPet.especie"
        placeholder="Ingrese nombre de la especie"
        :class="{ 'p-invalid': errors.especie }"
        class="custom-input"
      />
      <small v-if="errors.especie" class="p-error">{{ errors.especie }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <label for="fechaNacimiento" class="font-semibold">Fecha de Nacimiento</label>
      <DatePicker
        v-model="localPet.fechaNacimiento"
        placeholder="Eliga fecha de nacimiento"
        dateFormat="yy-mm-dd"
        :class="{ 'p-invalid': errors.fechaNacimiento }"
        class="custom-input"
      />
      <small v-if="errors.fechaNacimiento" class="p-error">{{ errors.fechaNacimiento }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <label for="clienteId" class="font-semibold">Cliente</label>
      <Select
        v-model="localPet.clienteId"
        :options="clientes"
        optionLabel="nombreCompleto"
        optionValue="id"
        placeholder="Seleccione el cliente"
        :class="{ 'p-invalid': errors.clienteId }"
        class="custom-input"
      />
      <small v-if="errors.clienteId" class="p-error">{{ errors.clienteId }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import * as Yup from "yup";
import type { Cliente } from "@/interfaces/Cliente";
import type { Mascota } from "@/interfaces/Mascota";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";

interface Pet {
  nombre: string;
  raza: string;
  especie: string;
  fechaNacimiento: string;
  clienteId: number;
  urlImagen?: string;
}

const props = defineProps<{
  pet?: Partial<Mascota>;
  clientes: Cliente[];
}>();

const localPet = ref<Pet>({
  nombre: "",
  raza: "",
  especie: "",
  fechaNacimiento: "",
  clienteId: 0,
  urlImagen: "",
});

const errors = ref<Partial<Record<keyof Pet, string>>>({});
const files = ref<File[]>([]);

const petSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  raza: Yup.string().required("La raza es requerida"),
  especie: Yup.string().required("La especie es requerida"),
  fechaNacimiento: Yup.string().required("La fecha de nacimiento es requerida"),
  clienteId: Yup.number().required("El cliente es requerido").min(1, "Debe seleccionar un cliente"),
});

const validateForm = async (): Promise<boolean> => {
  try {
    await petSchema.validate(localPet.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const newErrors: Partial<Record<keyof Pet, string>> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path as keyof Pet] = error.message;
        }
      });
      errors.value = newErrors;
      return false;
    }
    return false;
  }
};

const onSelectedFiles = (event: any) => {
  files.value = event.files;
  if (files.value.length > 0) {
    localPet.value.urlImagen = URL.createObjectURL(files.value[0]);
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  if (files.value.length === 0 && !props.pet?.urlImagen) {
    localPet.value.urlImagen = "";
  }
};

const clearFiles = () => {
  files.value = [];
  if (!props.pet?.urlImagen) {
    localPet.value.urlImagen = "";
  }
};

watch(
  () => props.pet,
  (newPet) => {
    if (newPet) {
      localPet.value = {
        nombre: newPet.nombre || "",
        raza: newPet.raza || "",
        especie: newPet.especie || "",
        fechaNacimiento: newPet.fechaNacimiento || "",
        clienteId: newPet.clienteId || 0,
        urlImagen: newPet.urlImagen || "",
      };
      files.value = [];
    } else {
      localPet.value = {
        nombre: "",
        raza: "",
        especie: "",
        fechaNacimiento: "",
        clienteId: 0,
        urlImagen: "",
      };
      files.value = [];
    }
  },
  { immediate: true }
);

defineExpose({
  localPet,
  files,
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

.card {
  border: 1px solid #0052a5;
  padding: 1rem;
  border-radius: 4px;
}
</style>
