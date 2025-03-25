<template>
  <div class="list bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div class="flex items-center mb-4">
      <i class="pi pi-calendar text-2xl sm:text-3xl text-teal-600 mr-2"></i>
      <h2 class="text-lg sm:text-xl font-semibold text-gray-700">Próximas citas</h2>
    </div>
    <ul class="space-y-4">
      <li
        v-for="appointment in appointments"
        :key="appointment.id"
        class="flex items-center text-gray-600 text-sm sm:text-base border-b pb-2 last:border-b-0"
      >
        <span class="font-medium text-teal-600 mr-2">{{ formatDate(appointment.fecha) }}</span>
        <span>-</span>
        <span class="ml-2">{{ getMascotaName(appointment.mascotaId) }}</span>
        <span class="text-gray-500 ml-1">({{ getClienteName(appointment.mascotaId) }})</span>
      </li>
      <li v-if="!appointments.length" class="text-gray-500 text-sm sm:text-base italic">
        No hay citas próximas
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Consulta } from '@/services/ConsultaService';
import { useClienteStore } from '@/stores/clienteStore';
import { useMascotaStore } from '@/stores/mascotaStore';

defineProps<{
  appointments: Consulta[];
}>();

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const getMascotaName = (mascotaId?: number) => {
  if (!mascotaId) return 'Mascota no especificada';
  const mascota = mascotaStore.mascotas.find((m) => m.id === mascotaId);
  return mascota ? mascota.nombre : 'Mascota no encontrada';
};

const getClienteName = (mascotaId?: number) => {
  if (!mascotaId) return 'Cliente no especificado';
  const mascota = mascotaStore.mascotas.find((m) => m.id === mascotaId);
  if (!mascota || mascota.clienteId === null) return 'Cliente no especificado';
  const cliente = clienteStore.clientes.find((c) => c.id === mascota.clienteId);
  return cliente ? cliente.nombre : 'Cliente no encontrado';
};
</script>

<style scoped>
.list {
  min-height: 200px;
}
</style>
