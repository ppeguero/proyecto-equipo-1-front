<script setup lang="ts">
import { onMounted } from 'vue';
import { useConsultaStore } from '@/stores/useConsultaStore';

const consultaStore = useConsultaStore();

onMounted(() => {
    consultaStore.fetchAllConsultas();
});
</script>

<template>
    <div v-if="consultaStore.loading">Cargando...</div>
    <div v-else-if="consultaStore.error">{{ consultaStore.error }}</div>
    <ul v-else>
        <li v-for="consulta in consultaStore.consultas" :key="consulta.id">
            {{ consulta.motivo }} - {{ consulta.fecha }}
        </li>
    </ul>
</template>
