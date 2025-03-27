<template>
  <div class="pet-detail">
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div class="flex justify-center md:justify-start">
            <div class="relative group">
              <img
                v-if="mascota.urlImagen"
                :src="mascota.urlImagen"
                alt="Imagen de la mascota"
                class="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 object-cover rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
              />
              <div
                v-else
                class="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 bg-gray-100 rounded-2xl flex items-center justify-center"
              >
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </div>
          </div>

          <div class="pl-4 md:pl-10 md:col-span-4 text-center md:text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                <p class="text-lg font-semibold text-gray-800">{{ mascota.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Especie</label>
                <p class="text-lg font-semibold text-gray-800">{{ mascota.especie }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Raza</label>
                <p class="text-lg font-semibold text-gray-800">{{ mascota.raza }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Fecha Nacimiento</label>
                <p class="text-lg font-semibold text-gray-800">{{ formatDate(mascota.fechaNacimiento) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          Detalles de la Cita
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Fecha</label>
            <p class="text-lg font-semibold text-gray-800">{{ formatDate(props.pet.fecha) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Hora</label>
            <p class="text-lg font-semibold text-gray-800">{{ props.pet.hora}}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Estado</label>
            <Tag
              :value="getEstadoProps(props.pet.estatus).label"
              :severity="getEstadoProps(props.pet.estatus).severity"
              :class="getEstadoProps(props.pet.estatus).tagClass"
              rounded
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <i class="pi pi-comment"></i>
          Motivo de la Consulta
        </h3>
        <p class="text-lg text-gray-800">{{props.pet.motivo }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { ref, onMounted } from 'vue';
import { mascotaService } from '@/services/MascotaService';
import type { Mascota } from '@/interfaces/Mascota';
import type { Consulta } from '@/services/ConsultaService';


const props = defineProps<{ pet: Consulta }>();

const mascota = ref<Mascota>({
  nombre: '', raza: '', especie: '', fechaNacimiento: '', clienteId: 0, urlImagen: '', fechaRegistro : '', consultasIds: [], id: 0
});

const fetchCita = async () => {
  try {
    const response = await mascotaService.getById(props.pet.mascotaId);
    mascota.value = response;
  } catch (error) {
    throw (error);
    // console.error('Error al obtener la última cita:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getEstadoProps = (estado: number) => {
  switch (estado) {
    case 0:
      return { label: 'Pendiente', severity: 'warning', tagClass: 'tag-outlined-warning' };
    case 1:
      return { label: 'En Progreso', severity: 'info', tagClass: 'tag-outlined-info' };
    case 2:
      return { label: 'Completada', severity: 'success', tagClass: 'tag-outlined-success' };
    case 3:
      return { label: 'Cancelada', severity: 'danger', tagClass: 'tag-outlined-danger' };
    default:
      return { label: 'Desconocido', severity: 'secondary', tagClass: 'tag-outlined-secondary' };
  }
};

onMounted(() => {
  fetchCita();
});
</script>

<style scoped>
.pet-detail {
  padding: 1rem;
}
.tag-outlined-warning {
  background-color: transparent !important;
  color: #ff9800 !important;
  border: 1px solid #ff9800 !important;
}
.tag-outlined-info {
  background-color: transparent !important;
  color: #2196f3 !important;
  border: 1px solid #2196f3 !important;
}
.tag-outlined-success {
  background-color: transparent !important;
  color: #4caf50 !important;
  border: 1px solid #4caf50 !important;
}
.tag-outlined-danger {
  background-color: transparent !important;
  color: #f44336 !important;
  border: 1px solid #f44336 !important;
}
.tag-outlined-secondary {
  background-color: transparent !important;
  color: #9e9e9e !important;
  border: 1px solid #9e9e9e !important;
}
</style>
