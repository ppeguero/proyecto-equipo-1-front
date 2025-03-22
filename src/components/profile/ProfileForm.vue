<template>
  <form @submit.prevent="submitForm" class="profile-form">
    <Fieldset legend="Información Personal" class="form-section">
      <div class="grid">
        <div class="col-12 md:col-6">
          <FormField
            id="nombre"
            label="Nombre"
            :modelValue="usuario.nombre"
            placeholder="Ingrese su nombre"
            :error="errors.nombre"
            :componentType="InputText"
            @update:modelValue="updateUsuario('nombre', $event)"
          />
        </div>
        <div class="col-12 md:col-6">
          <FormField
            id="apellido"
            label="Apellido"
            :modelValue="usuario.apellido"
            placeholder="Ingrese su apellido"
            :error="errors.apellido"
            :componentType="InputText"
            @update:modelValue="updateUsuario('apellido', $event)"
          />
        </div>
        <div class="col-12">
          <FormField
            id="email"
            label="Correo Electrónico"
            :modelValue="usuario.email"
            placeholder="Ingrese su correo"
            type="email"
            :error="errors.email"
            :componentType="InputText"
            @update:modelValue="updateUsuario('email', $event)"
          />
        </div>
      </div>
    </Fieldset>

    <Fieldset legend="Cambiar Contraseña" class="form-section">
      <div class="grid">
        <div class="col-12 md:col-6">
          <FormField
            id="password"
            label="Nueva Contraseña"
            :modelValue="password"
            placeholder="Ingrese una nueva contraseña"
            :toggleMask="true"
            :error="errors.password"
            :componentType="Password"
            @update:modelValue="$emit('update:password', $event)"
          />
        </div>
        <div class="col-12 md:col-6">
          <FormField
            id="confirmPassword"
            label="Confirmar Contraseña"
            :modelValue="confirmPassword"
            placeholder="Confirme la contraseña"
            :toggleMask="true"
            :error="errors.confirmPassword"
            :componentType="Password"
            @update:modelValue="$emit('update:confirmPassword', $event)"
          />
        </div>
      </div>
    </Fieldset>

    <Button type="submit" label="Guardar Cambios" class="form-button" />
  </form>
</template>

<script setup lang="ts">
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FormField from '../shared/FormField.vue';

const props = defineProps<{
  usuario: { id: number; nombre: string; apellido: string; email: string };
  password: string;
  confirmPassword: string;
  errors: Partial<Record<string, string>>;
}>();

const emit = defineEmits<{
  (e: 'update:usuario', value: { id: number; nombre: string; apellido: string; email: string }): void;
  (e: 'update:password', value: string): void;
  (e: 'update:confirmPassword', value: string): void;
  (e: 'submitForm'): void;
}>();

// Usar props.usuario en lugar de usuario directamente
const updateUsuario = (field: keyof typeof props.usuario, value: string) => {
  emit('update:usuario', { ...props.usuario, [field]: value });
};

const submitForm = () => {
  emit('submitForm');
};
</script>

<style scoped>
.form-section {
  margin-bottom: 1.5rem;
}

.form-button {
  width: 100% !important;
  background-color: #001F3F !important;
  color: white;
  padding: 0.875rem !important;
  border: 2px solid transparent !important;
  border-radius: 0.5rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease !important;
}

.form-button:hover {
  background-color: #003366 !important;
  color: #ffffff !important;
  border-color: #1d4ed8 !important; 
  transform: translateY(-2px) !important;
}

.form-button:focus {
  outline: none !important;
  border-color: #93c5fd !important;
  box-shadow: 0 0 10px rgba(147, 197, 253, 0.7) !important;
}

.form-button:active {
  transform: scale(0.95) !important;
}



.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.col-12 {
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .md\:col-6 {
    flex: 0 0 calc(50% - 0.75rem);
  }
}
</style>
