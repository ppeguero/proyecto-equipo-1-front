<template>
  <div class="profile-container" v-if="isLoaded">
    <h1 class="profile-title">Configuración del perfil</h1>
    <Card class="profile-card">
      <template #content>
        <ProfileForm
          v-model:usuario="usuario"
          v-model:password="password"
          v-model:confirmPassword="confirmPassword"
          :errors="errors"
          @submitForm="submitForm"
        />
      </template>
    </Card>
  </div>
  <div v-else>Cargando...</div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import ProfileForm from '@/components/profile/ProfileForm.vue';
import { useProfileForm } from '@/composables/useProfileForm';

const { usuario, password, confirmPassword, errors, isLoaded, submitForm } = useProfileForm();
</script>

<style scoped>
.profile-container {
  width: 100%;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  padding: 1rem;
  color: #1e3a8a;
  text-align: center;
}

.profile-card {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  width: 100%;
}
</style>
