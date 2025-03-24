<template>
    <form class="flex flex-col justify-between gap-8 w-2/4 mb-2 lg:mb-5" @submit.prevent="handleLoginSubmit" v-if="!isLoading">
        <div class="flex flex-col justify-center items-center">
            <img src="../../../src/assets/img/logo.png" alt="Logo" class="w-28 lg:w-42" />
            <h1 class="text-center text-white font-bold uppercase text-2xl">Iniciar sesión</h1>
        </div>
        <div class="flex flex-col justify-center gap-4">
            <div class="flex flex-col gap-1">
                <label class="text-white uppercase font-semibold" for="email">E-Mail</label>
                <InputText 
                    type="email" 
                    name="email" 
                    class="custom-input" 
                    v-model="email"
                />
                <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-white uppercase font-semibold" for="password">Contraseña</label>
                <InputText 
                    type="password" 
                    name="password"
                    class="custom-input"
                    v-model="password"
                />
                <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
            </div>
        </div>
        <div>
            <Button class="w-full uppercase font-black bg-[#043543] login-button" type="submit">Ingresar</Button>
            <span v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</span>
        </div>
    </form>
    <div class="flex flex-col justify-center items-center" v-else>
        <ProgressSpinner />
    </div>
</template>

<script setup lang="ts">

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

import * as Yup from "yup";

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/AuthService';
import { useStorage } from '@vueuse/core';


const email = ref('');
const password = ref('');
const errors = ref<{ email?: string; password?: string }>({}); 
const errorMessage = ref('');
const router = useRouter();

const isLoading = ref(false);

const token = useStorage('token', '');
const refreshToken = useStorage('refreshToken', '');

const loginSchema = Yup.object().shape({
    email: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
});

const validateForm = async (): Promise<boolean> => {
    errors.value = {}; 
    try {
        await loginSchema.validate(
            { email: email.value, password: password.value },
            { abortEarly: false }
        );
        return true;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            error.inner.forEach(err => {
                if (err.path) {
                    errors.value[err.path as keyof typeof errors.value] = err.message;
                }
            });
        }
        return false;
    }
};

const handleLoginSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
        try {
            isLoading.value = true;
            const response = await authService.login({
                email: email.value,
                password: password.value,
            });
            
            token.value = response.data.token;
            refreshToken.value = response.data.refreshToken;
            errorMessage.value = '';
            router.push('/dashboard');
        } catch (error) {
            isLoading.value = false;
            errorMessage.value = 'Credenciales incorrectas.';
            console.error('Error en el login:', error);
        }
    }
};

</script>

<style scoped>
.login-button {
    background-color: #043543;
}
.custom-input {
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
