<template>
    <div class="flex flex-col gap-4 w-full" >
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Nombre</label>
        <InputText
          v-model="localUsuario.nombre"
          placeholder="Ingrese el nombre"
          :class="{ 'p-invalid': errors.nombre }"
          class="custom-input"
        />
        <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
      </div>
  
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Apellido</label>
        <InputText
          v-model="localUsuario.apellido"
          placeholder="Ingrese el apellido"
          :class="{ 'p-invalid': errors.apellido }"
          class="custom-input"
        />
        <small v-if="errors.apellido" class="p-error">{{ errors.apellido }}</small>
      </div>
  
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Correo Electrónico</label>
        <InputText
          v-model="localUsuario.email"
          placeholder="Ingrese el correo electrónico"
          :class="{ 'p-invalid': errors.email }"
          class="custom-input"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>
  
      <div v-if="!props.usuario?.id || changePassword" class="flex flex-col gap-1">
        <label class="font-semibold">Contraseña</label>
        <Password
          v-model="localUsuario.password"
          placeholder="Ingrese la contraseña"
          toggleMask
          :class="{ 'p-invalid': errors.password }"
          class="custom-input"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>
  
      <div v-if="!props.usuario?.id || changePassword" class="flex flex-col gap-1">
        <label class="font-semibold">Confirmar Contraseña</label>
        <Password
          v-model="localUsuario.confirmPassword"
          placeholder="Confirme la contraseña"
          toggleMask
          :class="{ 'p-invalid': errors.confirmPassword }"
          class="custom-input"
        />
        <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
      </div>
  
      <div class="flex flex-col gap-1" v-if="notAdmin">
        <label class="font-semibold">Roles</label>
        <Select
          v-model="localUsuario.rolId"
          :options="props.rolesDisponibles"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccione un rol"
          :class="{ 'p-invalid': errors.rolId }"
          class="custom-input"
        />

        <small v-if="errors.rolId" class="p-error">{{ errors.rolId }}</small>
      </div>

      <div v-if="props.usuario?.id" class="flex items-center gap-2">
      <Checkbox v-model="changePassword" binary/>
      <label class="font-semibold cursor-pointer">
        Cambiar contraseña
      </label>
</div>

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from "vue";
  import InputText from "primevue/inputtext";
  import Password from "primevue/password";
  import Select from "primevue/select";
  import Checkbox from "primevue/checkbox";
  import * as Yup from "yup";
  import type { UsuarioUpdateDto } from "@/interfaces/UsuarioDto";

  const changePassword = ref(false);
  const notAdmin = computed(() => {
    return !props.usuario?.roles?.includes("Administrador");
  });  
  interface UsuarioForm {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword?: string;
    rolId: string;
    consultasIds: number[];
  }
  
  const props = defineProps<{
    usuario?: Partial<UsuarioUpdateDto>;
    rolesDisponibles: any;
    consultas: { id: number; nombre: string }[];
  }>();
  
  const localUsuario = ref<UsuarioForm>({
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    rolId: "",
    consultasIds: [],
  });
  
  const errors = ref<Partial<Record<keyof UsuarioForm, string>>>({});
  
    const usuarioSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria").min(6, "Debe tener al menos 6 caracteres").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número"
    ),
    confirmPassword: Yup.string().required("Debe confirmar la contraseña").oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    rolId: Yup.string().required("Debe seleccionar al menos un rol"),
    } );

    const passwordSchema = Yup.object().shape({
    password: Yup.string().required("La contraseña es obligatoria").min(6, "Debe tener al menos 6 caracteres").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número"
    ),
    confirmPassword: Yup.string().required("Debe confirmar la contraseña").oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
  });
  
  const validateForm = async (): Promise<boolean> => {
    try {
      await usuarioSchema.validate(localUsuario.value, { abortEarly: false, context: { isNew: !props.usuario?.id } });
      errors.value = {};
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof UsuarioForm, string>> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof UsuarioForm] = error.message;
          }
        });
        errors.value = newErrors;
      }
      return false;
    }
  };

  const validateFormPassword = async (): Promise<boolean> => {
    try {
      await passwordSchema.validate(localUsuario.value, { abortEarly: false });
      errors.value = {};
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof UsuarioForm, string>> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof UsuarioForm] = error.message;
          }
        });
        errors.value = newErrors;
      }
      return false;
    }
  };  
  
  watch(
  () => props.usuario,
  (newUsuario) => {
    if (newUsuario) {
      const rolEncontrado = props.rolesDisponibles.find(
        (rol: { nombre: string }) => rol.nombre === newUsuario.roles?.[0]
      );

      localUsuario.value = {
        id: newUsuario.id || 0,
        nombre: newUsuario.nombre || "",
        apellido: newUsuario.apellido || "",
        email: newUsuario.email || "",
        password: "",
        confirmPassword: "",
        rolId: rolEncontrado ? rolEncontrado.id : "",
        consultasIds: newUsuario.consultasIds || [],
      };
    } else {
      localUsuario.value = {
        id: 0,
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
        rolId: "",
        consultasIds: [],
      };
    }
  },
  { immediate: true }
);

  
  defineExpose({
    localUsuario,
    validateForm,
    validateFormPassword
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
  