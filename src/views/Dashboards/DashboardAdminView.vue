<template>
  <div class="dashboard min-h-screen p-4 sm:p-6 lg:p-8">
    <header class="mb-8 sm:mb-10 lg:mb-12">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
        Panel Administrativo
      </h1>
      <div class="border-b-2 border-blue-200 w-full"></div>
    </header>

    <section class="mb-8 sm:mb-10 lg:mb-12">
      <SummaryCards :data="filteredSummary" />
    </section>

    <section
      v-if="!(isVeterinario)"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12"
    >
      <div class="card min-h-96 p-4 sm:p-6 bg-white rounded-xl shadow-2 hover:shadow-4 transition-all border border-gray-200">
        <AppointmentChart :data="appointmentChartData" />
      </div>
      <div v-if="!(isVeterinario || isAdmin)" >
        <UpcomingAppointments :appointments="upcomingAppointments" />
      </div>
      <div v-if="!isRecepcionista" class="card min-h-96 p-4 sm:p-6 bg-white rounded-xl shadow-2 hover:shadow-4 transition-all border border-gray-200">
        <PetSpeciesChart :data="petSpeciesChartData"  />
      </div>

    </section>

    <!-- Sección de Listas -->
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10" v-if="!isRecepcionista">
      <UpcomingAppointments :appointments="upcomingAppointments" />

      <div >
        <LowStockMedicines :medicines="lowStockMedicines" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useStorage } from '@vueuse/core';
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

const token = useStorage('token', '');
const userEmail = ref<string | null>(null);
const userRole = ref<string | null>(null);

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
}

const decodeToken = () => {
  if (token.value) {
    try {
      const decoded = jwtDecode<JwtPayload>(token.value);
      userEmail.value = decoded.email || null;
      userRole.value = decoded.role || null;
    } catch (error) {
      // console.error('Error decodificando el token:', error);
      userEmail.value = null;
      userRole.value = null;
    }
  }
};

const isRecepcionista = computed(() => userRole.value === 'Recepcionista');
const isVeterinario = computed(() => userRole.value === 'Veterinario');
const isAdmin = computed(() => userRole.value === 'Administrador');

const filteredSummary = computed(() => {
  if (!summary.value) return {};

  return {
    totalAppointments: summary.value.totalAppointments || 0,
    totalPets: summary.value.totalPets || 0,
    totalClients: isAdmin.value ? summary.value.totalClients || 0 : undefined,
    totalMedicines: isAdmin.value || isVeterinario.value ? summary.value.totalMedicines || 0 : undefined,
  };
});

onMounted(() => {
  decodeToken();
});
</script>

<style scoped>
.dashboard {
  transition: all 0.5s ease-in-out;
}
</style>
