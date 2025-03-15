<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1">
      <label for="imagen" class="font-semibold">Imagen de la Mascota</label>
      <div class="card">
        <FileUpload name="demo[]" :multiple="false" accept="image/*" :maxFileSize="1000000"
          @select="onSelectedFiles">
          <template #header="{ chooseCallback, files }">
            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
              <div class="flex gap-2">
                <Button @click="chooseCallback()"
                  icon="pi pi-images" rounded outlined severity="secondary"/>
                <Button icon="pi pi-times" rounded outlined severity="danger"
                  :disabled="!files || files.length === 0" @click="clearFiles" />
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
                  <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">
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
          </template>
          <template #empty>
            <div class="flex items-center justify-center flex-col">
              <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
              <p class="mt-6 mb-0">Arrastra y suelta una imagen aquí para cargar.</p>
            </div>
          </template>
        </FileUpload>
      </div>
      <small v-if="errors.imagen" class="p-error">{{ errors.imagen }}</small>
    </div>

    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.nombreMascota"
        placeholder="Nombre de la mascota"
        :class="{ 'p-invalid': errors.nombreMascota }"
        class="custom-input"
      />
      <small v-if="errors.nombreMascota" class="p-error">{{ errors.nombreMascota }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.raza"
        placeholder="Raza"
        :class="{ 'p-invalid': errors.raza }"
        class="custom-input"
      />
      <small v-if="errors.raza" class="p-error">{{ errors.raza }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.especie"
        placeholder="Especie"
        :class="{ 'p-invalid': errors.especie }"
        class="custom-input"
      />
      <small v-if="errors.especie" class="p-error">{{ errors.especie }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.fechaNacimiento"
        type="date"
        placeholder="Fecha de Nacimiento"
        :class="{ 'p-invalid': errors.fechaNacimiento }"
        class="custom-input"
      />
      <small v-if="errors.fechaNacimiento" class="p-error">{{ errors.fechaNacimiento }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.edad"
        placeholder="Edad"
        :class="{ 'p-invalid': errors.edad }"
        class="custom-input"
      />
      <small v-if="errors.edad" class="p-error">{{ errors.edad }}</small>
    </div>
    <div class="flex flex-col gap-1">
      <InputText
        v-model="localPet.dueno"
        placeholder="Dueño"
        :class="{ 'p-invalid': errors.dueno }"
        class="custom-input"
      />
      <small v-if="errors.dueno" class="p-error">{{ errors.dueno }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import * as Yup from 'yup';

interface Pet {
  nombreMascota: string;
  raza: string;
  especie: string;
  fechaNacimiento: string;
  edad: string;
  dueno: string;
  imagen?: string;
}

const props = defineProps<{
  pet?: Pet;
}>();

const localPet = ref<Pet>({
  nombreMascota: '',
  raza: '',
  especie: '',
  fechaNacimiento: '',
  edad: '',
  dueno: '',
  imagen: '',
});

const errors = ref<Partial<Record<keyof Pet, string>>>({});
const files = ref<File[]>([]);

const petSchema = Yup.object().shape({
  nombreMascota: Yup.string().required('El nombre es requerido'),
  raza: Yup.string().required('La raza es requerida'),
  especie: Yup.string().required('La especie es requerida'),
  fechaNacimiento: Yup.string().required('La fecha de nacimiento es requerida'),
  edad: Yup.string()
    .required('La edad es requerida')
    .matches(/^\d+$/, 'La edad debe ser un número entero')
    .test('positive', 'La edad debe ser positiva', (value) => parseInt(value, 10) > 0),
  dueno: Yup.string().required('El dueño es requerido'),
  imagen: Yup.string().required('La imagen es requerida'),
});

const validateForm = async (): Promise<boolean> => {
  try {
    await petSchema.validate(
      { ...localPet.value, imagen: files.value.length > 0 || localPet.value.imagen ? 'selected' : '' },
      { abortEarly: false }
    );
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
    localPet.value.imagen = URL.createObjectURL(files.value[0]);
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  if (files.value.length === 0) {
    localPet.value.imagen = '';
  }
};

const clearFiles = () => {
  files.value = [];
  localPet.value.imagen = '';
};

watch(
  () => props.pet,
  (newPet) => {
    if (newPet) {
      localPet.value = { ...newPet };
      files.value = [];
    } else {
      localPet.value = {
        nombreMascota: '',
        raza: '',
        especie: '',
        fechaNacimiento: '',
        edad: '',
        dueno: '',
        imagen: '',
      };
      files.value = [];
    }
  },
  { immediate: true }
);

defineExpose({
  localPet,
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
