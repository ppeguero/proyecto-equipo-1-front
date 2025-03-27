<template>
  <BaseTable
    :data="citas"
    stripedRows
    tableStyle="min-width: 50rem"
    paginator
    :rows="5"
  >
    <Column header="ID" class="w-20">
      <template #body="{ data }">
        <div class="flex justify-center">{{ data.id }}</div>
      </template>
    </Column>

    <Column header="Foto" class="w-24">
      <template #body="{ data }">
        <img
          :src="mascotasImagenes[data.mascotaId] || '/img/default-pet.png'"
          alt="Mascota"
          class="w-16 h-16 object-cover rounded-full mx-auto"
        />
      </template>
    </Column>

    <Column header="Nombre del Paciente" class="w-64">
      <template #body="{ data }">
        <button @click="$emit('verDetalles', data)" class="hover:underline w-full text-center cursor-pointer">
          {{ mascotasNombres[data.mascotaId] || "Cargando..." }}
        </button>
      </template>
    </Column>

    <Column header="Fecha" class="w-40">
      <template #body="{ data }">
        <div class="flex justify-center">{{ formatDate(data.fecha) }}</div>
      </template>
    </Column>

    <Column header="Hora" class="w-32">
      <template #body="{ data }">
        <div class="flex justify-center">{{ data.hora }}</div>
      </template>
    </Column>

    <Column header="Estado" class="w-32">
      <template #body="{ data }">
        <div class="flex justify-center">
          <span :class="getEstadoClass(data.estatus)" class="px-2 py-1 rounded-full text-sm">
            {{ getEstadoLabel(data.estatus) }}
          </span>
        </div>
      </template>
    </Column>

    <Column header="Acciones" class="w-40">
      <template #body="{ data }">
        <div class="flex justify-center items-center gap-2">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-text text-blue-500"
          style="color: #008040"
            @click="$emit('verDetalles', data)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text text-blue-500"
             style="color: #1e88e5"
            @click="$emit('editar', data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text text-red-500"
            style="color: #e53935"
            @click="$emit('eliminar', data.id)"
          />
        </div>
      </template>
    </Column>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Column from "primevue/column";
import Button from "primevue/button";
import BaseTable from "@/components/commons/TableDataBase.vue";
import { mascotaService } from "@/services/MascotaService";

const props = defineProps<{ citas: any[] }>();
defineEmits(["editar", "eliminar", "verDetalles"]);

const mascotasNombres = ref<{ [key: number]: string }>({});
const mascotasImagenes = ref<{ [key: number]: string }>({});

const fetchMascotas = async () => {
  const uniqueIds = [...new Set(props.citas.map((cita) => cita.mascotaId))];

  for (const id of uniqueIds) {
    if (!mascotasNombres.value[id]) {
      try {
        const mascota = await mascotaService.getById(id);
        mascotasNombres.value[id] = mascota.nombre;
        mascotasImagenes.value[id] = mascota.urlImagen || "/img/default-pet.png";
      } catch (error) {
        throw (error);
        // console.error("Error obteniendo la mascota:", error);
        mascotasNombres.value[id] = "Desconocido";
        mascotasImagenes.value[id] = "/img/default-pet.png";
      }
    }
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getEstadoClass = (estado: number) => {
  switch (estado) {
    case 0:
      return "tag-outlined-warning";
    case 1:
      return "tag-outlined-info";
    case 2:
      return "tag-outlined-success";
    case 3:
      return "tag-outlined-danger";
    default:
      return "tag-outlined-secondary";
  }
};

const getEstadoLabel = (estado: number) => {
  switch (estado) {
    case 0:
      return "Pendiente";
    case 1:
      return "En Progreso";
    case 2:
      return "Completada";
    case 3:
      return "Cancelada";
    default:
      return "Desconocido";
  }
};


onMounted(fetchMascotas);

watch(() => props.citas, fetchMascotas, { deep: true });
</script>

<style scoped>
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
