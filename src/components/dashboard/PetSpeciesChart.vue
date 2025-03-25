<template>
  <div class="chart flex flex-col h-full">
    <h2 class="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Distribución de especies</h2>
    <div class="flex-1 min-h-80">
      <Chart type="pie" :data="data" :options="chartOptions" class="w-full h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import type { ChartData } from '@/interfaces/Dashboard';

defineProps<{
  data: ChartData | null;
}>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style scoped>
/* Aseguramos que la gráfica ocupe todo el espacio disponible */
.chart canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
