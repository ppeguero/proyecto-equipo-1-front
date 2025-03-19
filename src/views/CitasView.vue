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

    <!-- Tabla de Citas -->
    <TableCitas
      :citas="consultaStore.consultas"
      @editar="editarCita"
      @eliminar="eliminarCita"
      @verDetalles="verDetalles"
    />

    <!-- Modal de Registro y Edición -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded w-96">
        <h2 class="text-xl font-bold mb-4">{{ showEditModal ? "Editar Cita" : "Registrar Cita" }}</h2>
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
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
              {{ showEditModal ? "Actualizar" : "Agregar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useConsultaStore } from "@/stores/useConsultaStore";
import TableCitas from "@/components/citas/CitasTable.vue";

const consultaStore = useConsultaStore();

onMounted(() => {
  consultaStore.fetchAllConsultas();
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const citaActual = ref({ id: null, nombre: "", fecha: "", hora: "", estado: "pendiente" });

const agregarCita = () => {
  consultaStore.addConsulta({ ...citaActual.value });
  cerrarModal();
};

const editarCita = (cita) => {
  citaActual.value = { ...cita };
  showEditModal.value = true;
};

const actualizarCita = () => {
  consultaStore.updateConsulta(citaActual.value.id,citaActual.value);
  cerrarModal();
};

const eliminarCita = (id) => {
  consultaStore.deleteConsulta(id);
};

const cerrarModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  citaActual.value = { id: null, nombre: "", fecha: "", hora: "", estado: "pendiente" };
};
</script>
