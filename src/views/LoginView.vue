<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/AuthService';
import { useStorage } from '@vueuse/core';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const token = useStorage('token', '');
const refreshToken = useStorage('refreshToken', '');

const handleLogin = async () => {
    try {
        const response = await authService.login({
            email: email.value,
            password: password.value,
        });
        token.value = response.data.token;
        refreshToken.value = response.data.refreshToken;
        errorMessage.value = '';
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error en el login:', error);
    }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>
