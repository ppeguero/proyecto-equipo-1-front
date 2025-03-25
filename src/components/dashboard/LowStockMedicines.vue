<template>
  <div class="list bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div class="flex items-center mb-4">
      <i class="pi pi-exclamation-triangle text-2xl sm:text-3xl text-red-500 mr-2"></i>
      <h2 class="text-lg sm:text-xl font-semibold text-gray-700">Medicamentos con bajo stock</h2>
    </div>
    <ul class="space-y-4">
      <li
        v-for="medicine in medicines"
        :key="medicine.id"
        class="flex justify-between items-center text-gray-600 text-sm sm:text-base border-b pb-2 last:border-b-0"
      >
        <span class="font-medium text-gray-800">{{ medicine.nombre }}</span>
        <span
          :class="[
            'font-semibold',
            medicine.stock < 5 ? 'text-red-500' : 'text-orange-500',
          ]"
        >
          Stock: {{ medicine.stock }}
        </span>
      </li>
      <li v-if="!medicines.length" class="text-gray-500 text-sm sm:text-base italic">
        No hay medicamentos con bajo stock
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Medicamento } from '@/interfaces/Medicamento';

defineProps<{
  medicines: Medicamento[];
}>();
</script>

<style scoped>
.list {
  min-height: 200px;
}
</style>
