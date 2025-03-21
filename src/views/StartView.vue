<template>
    <main class="bg-[#1c3549] h-screen flex flex-col justify-center items-center">
        <div class="w-2/4 flex flex-col items-center">
            <img src="@/assets/img/logo.png" alt="Logo" class="w-32 h-32 animate-bounce" />
            <p class="text-sm font-bold tracking-widest text-gray-400 uppercase">Cargando...</p>
            <p class="text-white text-center animate-pulse px-5 mt-2">"{{ quote }}"</p>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();

const quote = ref<string>('');
const token = useStorage('token', '');

const vetQuotesArr = [
    'El amor por todas las criaturas es el más noble atributo del hombre.',
    'El perro es el único ser en el mundo que te ama más de lo que se ama a sí mismo.',
    'El perro no es todo en la vida, pero lo hace mejor.',
    'La grandeza de una nación y su progreso moral puede ser juzgado por la forma en que sus animales son tratados.',    
]

onMounted(() => {
    const randomQuote = vetQuotesArr[Math.floor(Math.random() * vetQuotesArr.length)];
    quote.value = randomQuote;

    if (!token.value) {
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    } else {
        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    }
});
</script>
