<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard de Citas</h1>
      <Button label="Registrar Cita" @click="abrirModal()" severity="primary" />
    </div>

    <div v-if="consultaStore.loading">Cargando...</div>
    <div v-else-if="consultaStore.error">{{ consultaStore.error }}</div>

    <TableCitas :citas="consultaStore.consultas" @editar="editarCita" @eliminar="eliminarCita" />

    <ModalBase :visible="showModal" :header="editando ? 'Editar Cita' : 'Registrar Cita'" @update:visible="showModal = $event" :width="modalWidth">
      <CitasForm :visible="showModal" :citaData="citaActual" :isEditing="editando" @submit="guardarCita" @update:visible="showModal = $event" />
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed} from "vue";
import { useConsultaStore } from "@/stores/useConsultaStore";
import TableCitas from "@/components/citas/CitasTable.vue";
import CitasForm from "@/components/citas/CitasForm.vue";
import ModalBase from "@/components/commons/ModalBase.vue";
import Button from "primevue/button";

const consultaStore = useConsultaStore();
onMounted(() => consultaStore.fetchAllConsultas());

const showModal = ref(false);
const editando = ref(false);
const citaActual = ref({ id: null, nombre: "", fecha: "", hora: "", estado: "0" });
const isMobile = ref(false);

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '45rem';
});

const abrirModal = () => {
  citaActual.value = { id: null, nombre: "", fecha: "", hora: "", estado: "0" };
  editando.value = false;
  showModal.value = true;
};

const editarCita = (cita) => {
  citaActual.value = { ...cita };
  editando.value = true;
  showModal.value = true;
};

const guardarCita = (cita) => {
  if (editando.value) {
    console.log(cita);
    consultaStore.updateConsulta(cita.id, cita);
  } else {
    console.log(cita);
    consultaStore.createConsulta(cita);

  }
  showModal.value = false;
};

const eliminarCita = (id) => {
  consultaStore.deleteConsulta(id);
};
</script>
