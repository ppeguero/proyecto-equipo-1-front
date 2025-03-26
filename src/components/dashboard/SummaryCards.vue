<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <div
      v-for="(item, key) in filteredCards"
      :key="key"
      class="card bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center cursor-pointer"
      @click="navigateTo(item.route)"
    >
      <div class="flex items-center justify-center mb-4">
        <i :class="item.icon" class="text-3xl sm:text-4xl text-gray-600"></i>
      </div>
      <h2 class="text-lg sm:text-xl font-semibold text-gray-700">{{ item.label }}</h2>
      <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{{ item.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryData } from '@/interfaces/Dashboard';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  data: SummaryData;
}>();

const cards = computed(() => [
  {
    label: 'Citas',
    value: props.data.totalAppointments,
    icon: 'pi pi-calendar',
    route: 'dashboard/citas',
  },
  {
    label: 'Mascotas',
    value: props.data.totalPets,
    icon: 'pi pi-github',
    route: 'dashboard/mascotas',
  },
  {
    label: 'Clientes',
    value: props.data.totalClients,
    icon: 'pi pi-users',
    route: 'dashboard/clientes',
  },
  {
    label: 'Medicamentos',
    value: props.data.totalMedicines,
    icon: 'pi pi-box',
    route: 'dashboard/medicamentos',
  },
]);

const filteredCards = computed(() => cards.value.filter((card) => card.value > 0));

const navigateTo = (route: string) => {
  router.push(route);
};
</script>
