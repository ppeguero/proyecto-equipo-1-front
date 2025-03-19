<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard de Citas</h1>
      <button @click="showAddModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">
        Registrar Cita
      </button>
    </div>

    <div v-if="consultaStore.loading">Cargando...</div>
    <div v-else-if="consultaStore.error">{{ consultaStore.error }}</div>
    <!-- ✅ PrimeVue DataTable -->
    <DataTable :value="consultaStore.consultas"  stripedRows tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column header="Nombre del Paciente">
        <template #body="slotProps">
          <button @click="verDetalles(slotProps.data)" class="text-blue-600 hover:underline">
            {{ slotProps.data.nombre }}
          </button>
        </template>
      </Column>
      <Column field="fecha" header="Fecha"></Column>
      <Column field="hora" header="Hora"></Column>
      <Column field="estado" header="Estado"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button @click="editarCita(slotProps.data)" label="Editar" severity="info"></Button>
            <Button @click="eliminarCita(slotProps.data.id)" label="Eliminar" severity="danger"></Button>
          </div>

        </template>
      </Column>
    </DataTable>

    <!-- Modal de Registro y Edición -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded w-96">
        <h2 class="text-xl font-bold mb-4">{{ showEditModal ? 'Editar Cita' : 'Registrar Cita' }}</h2>
        <form @submit.prevent="showEditModal ? actualizarCita() : agregarCita()">
          <div class="mb-4">
            <label class="block text-gray-700">Nombre del Paciente</label>
            <input v-model="citaActual.nombre" type="text" class="w-full px-3 py-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Fecha</label>
            <input v-model="citaActual.fecha" type="date" class="w-full px-3 py-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Hora</label>
            <input v-model="citaActual.hora" type="time" class="w-full px-3 py-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Estado</label>
            <select v-model="citaActual.estado" class="w-full px-3 py-2 border rounded" required>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="cerrarModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">{{ showEditModal ? 'Actualizar' : 'Agregar' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="showDetailModal" class="fixed inset-0 flex items-center justify-center bg-black opacity-80">
      <div class="bg-white p-6 rounded-lg shadow-lg w-[800px] relative">
        <h2 class="text-xl font-bold text-center mb-4">Detalles del Paciente</h2>
        <div class="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
          <img :src="detallePaciente.foto" alt="Paciente" class="w-24 h-24 rounded-full border-2 border-blue-500" />
          <div class="ml-15">
            <p><strong>Nombre:</strong> {{ detallePaciente.nombre }}</p>
            <p><strong>Especie:</strong> {{ detallePaciente.especie }}</p>
            <p><strong>Raza:</strong> {{ detallePaciente.raza }}</p>
          </div>
          <div>
            <p><strong>Fecha de Registro:</strong> {{ detallePaciente.fecha }}</p>
            <p><strong>Edad:</strong> {{ detallePaciente.edad }}</p>
            <p><strong>Dueño:</strong> {{ detallePaciente.dueno }}</p>
          </div>
        </div>
        <div class="mt-4 bg-gray-100 p-4 rounded-lg grid grid-cols-4 gap-4">
          <h3 class="font-bold">Cita</h3>
          <p><strong>Fecha:</strong> {{ detallePaciente.fecha }}</p>
          <p><strong>Hora:</strong> {{ detallePaciente.hora }}</p>
          <p><strong>Estado:</strong> <span class="text-blue-600 font-bold">{{ detallePaciente.estado }}</span></p>
        </div>
        <div class="mt-4">
          <h3 class="font-bold">Motivo de Consulta</h3>
          <p class="text-gray-700 mt-2">{{ detallePaciente.motivo }}</p>
        </div>
        <div class="flex justify-center mt-4">
          <button @click="showDetailModal = false" class="bg-gray-500 text-white px-4 py-2 rounded">Volver atrás</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useConsultaStore } from '@/stores/useConsultaStore';

const consultaStore = useConsultaStore();

onMounted(() => {
  consultaStore.fetchAllConsultas();
});

const showDetailModal = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const citaActual = ref({ id: null, nombre: '', fecha: '', hora: '', estado: 'pendiente' });
const detallePaciente = ref({});

const agregarCita = () => {
  const newId = citas.value.length ? citas.value[citas.value.length - 1].id + 1 : 1;
  citas.value.push({ id: newId, ...citaActual.value });
  cerrarModal();
};

const editarCita = (cita) => {
  citaActual.value = { ...cita };
  showEditModal.value = true;
};

const actualizarCita = () => {
  const index = citas.value.findIndex(c => c.id === citaActual.value.id);
  if (index !== -1) {
    citas.value[index] = { ...citaActual.value };
  }
  cerrarModal();
};

const eliminarCita = (id) => {
  citas.value = citas.value.filter(cita => cita.id !== id);
};

const verDetalles = (cita) => {
  detallePaciente.value = {
    ...cita,
    foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8uf8MOJZJ4M-BZ5f4gThsH_JyT5-M_aw4Wg&s',
    especie: 'Hámster',
    raza: 'Hámster Sirio',
    dueno: 'Ricardo',
    edad: '2 años',
    motivo: 'Revisión médica.'
  };
  showDetailModal.value = true;
};

const cerrarModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  citaActual.value = { id: null, nombre: '', fecha: '', hora: '', estado: 'pendiente' };
};
</script>
