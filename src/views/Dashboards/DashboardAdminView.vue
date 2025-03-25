<template>
  <div class="dashboard min-h-screen p-4 sm:p-6 lg:p-8">
    <header class="mb-8 sm:mb-10 lg:mb-12">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
        Panel Administrativo
      </h1>
      <div class="border-b-2 border-blue-200 w-full"></div>
    </header>

    <section class="mb-8 sm:mb-10 lg:mb-12">
      <SummaryCards :data="summary" />
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">
      <div class="card min-h-96 p-4 sm:p-6 bg-white rounded-xl shadow-2 hover:shadow-4 transition-all border border-gray-200">
        <AppointmentChart :data="appointmentChartData" />
      </div>
      <div class="card min-h-96 p-4 sm:p-6 bg-white rounded-xl shadow-2 hover:shadow-4 transition-all border border-gray-200">
        <PetSpeciesChart :data="petSpeciesChartData" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        <UpcomingAppointments :appointments="upcomingAppointments" />
        <LowStockMedicines :medicines="lowStockMedicines" />

    </section>
  </div>
</template>

<script setup lang="ts">
import AppointmentChart from '@/components/dashboard/AppointmentChart.vue';
import LowStockMedicines from '@/components/dashboard/LowStockMedicines.vue';
import PetSpeciesChart from '@/components/dashboard/PetSpeciesChart.vue';
import SummaryCards from '@/components/dashboard/SummaryCards.vue';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments.vue';
import { useDashboardData } from '@/composables/useDashboardData';

const {
  summary,
  appointmentChartData,
  petSpeciesChartData,
  upcomingAppointments,
  lowStockMedicines,
} = useDashboardData();
</script>

<style scoped>
.dashboard {
  transition: all 0.5s ease-in-out;
}
</style>
