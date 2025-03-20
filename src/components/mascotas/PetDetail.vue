<template>
  <div class="pet-detail">
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div class="flex justify-center md:justify-start">
            <div class="relative group">
              <img
                v-if="pet.urlImagen"
                :src="pet.urlImagen"
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
      <p class="text-lg font-semibold text-gray-800">{{ pet.nombre }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Especie</label>
      <p class="text-lg font-semibold text-gray-800">{{ pet.especie }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Raza</label>
      <p class="text-lg font-semibold text-gray-800">{{ pet.raza }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Fecha Nacimiento</label>
      <p class="text-lg font-semibold text-gray-800">{{ formatDate(pet.fechaNacimiento) }}</p>
    </div>
  </div>
</div>

        </div>
      </template>
    </Card>

    <h3 class="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
      <i class="pi pi-history"></i>
      Historial de Citas
    </h3>

    <div v-if="historialCitas.length === 0" class="text-center text-gray-500 py-6">
      Sin citas asignadas
    </div>
    <DataTable
      v-else
      :value="historialCitas"
      class="p-datatable-sm border"
      responsiveLayout="scroll"
      stripedRows
      :paginator="historialCitas.length > 5"
      :rows="5"
    >
      <Column field="fecha" header="Fecha" headerClass="bg-gray-100 text-center">
        <template #body="slotProps">
          <span class="font-medium text-gray-700">
            {{ formatDate(slotProps.data.fecha) }}
          </span>
        </template>
      </Column>
      <Column field="motivo" header="Motivo" headerClass="bg-gray-100 text-center">
        <template #body="slotProps">
          <span class="text-gray-600">{{ slotProps.data.motivo }}</span>
        </template>
      </Column>
      <Column field="veterinarioNombre" header="Veterinario" headerClass="bg-gray-100 text-center">
        <template #body="slotProps">
          <div class="flex justify-center items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <span>{{ slotProps.data.veterinarioNombre }}</span>
          </div>
        </template>
      </Column>
      <Column field="estado" header="Estado" headerClass="bg-gray-100 text-center">
        <template #body="slotProps">
          <Tag
            :value="getEstadoProps(slotProps.data.estado).label"
            :severity="getEstadoProps(slotProps.data.estado).severity"
            :class="getEstadoProps(slotProps.data.estado).tagClass"
            rounded
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { mascotaService } from '@/services/MascotaService';
import type { Mascota, Consulta } from '@/interfaces/Mascota';

const props = defineProps<{
  pet: Mascota;
}>();

const emit = defineEmits(['close']);

const historialCitas = ref<Consulta[]>([]);

const closeModal = () => {
  emit('close');
};

const fetchHistorialCitas = async () => {
  try {
    const response = await mascotaService.getHistorialCitas(props.pet.id);
    historialCitas.value = response;
  } catch (error) {
    console.error('Error al obtener historial de citas:', error);
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
  fetchHistorialCitas();
});
</script>

<style scoped>
.pet-detail {
  padding: 1rem;
}
::v-deep .p-datatable-tbody > tr > td {
  text-align: center;
  border-color: var(--p-datatable-body-cell-border-color);
  border-style: solid;
  border-width: 0 0 1px 0;
  padding: var(--p-datatable-body-cell-padding);
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
