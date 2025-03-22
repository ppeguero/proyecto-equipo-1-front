<template>
  <div class="field">
    <label :for="id" class="form-label">{{ label }}</label>
    <component
      :is="componentType"
      :id="id"
      :modelValue="modelValue"
      class="form-input"
      :placeholder="placeholder"
      :type="type"
      :toggleMask="toggleMask"
      :class="{ 'p-invalid': error }"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

defineProps<{
  id: string;
  label: string;
  modelValue: string;
  placeholder: string;
  type?: string;
  toggleMask?: boolean;
  error?: string;
  componentType: typeof InputText | typeof Password;
}>();

defineEmits(['update:modelValue']);
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
  background-color: #ffffff;
  outline: none;
}

:deep(.p-password) {
  width: 100%;
  position: relative;
}

:deep(.p-password input) {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  padding-right: 2.5rem;
  box-sizing: border-box;
  height: 2.5rem;
}

:deep(.p-password input:focus) {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
  background-color: #ffffff;
  outline: none;
}

:deep(.p-password .p-password-toggle-mask-icon) {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  cursor: pointer;
  color: #6b7280;
}

.p-invalid {
  border-color: #dc3545 !important;
}

.p-error {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
