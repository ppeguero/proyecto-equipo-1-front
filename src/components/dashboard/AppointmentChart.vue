<template>
  <div class="chart flex flex-col h-full">
    <h2 class="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Citas por día</h2>
    <div class="flex-1 min-h-80">
      <Chart type="bar" :data="data" :options="chartOptions" class="w-full h-full" />
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
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<style scoped>
.chart canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
