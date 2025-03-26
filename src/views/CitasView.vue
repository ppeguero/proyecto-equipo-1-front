<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useConsultaStore } from '@/stores/useConsultaStore'
import { useMascotaStore } from '@/stores/mascotaStore'
import TableCitas from '@/components/citas/CitasTable.vue'
import CitasForm from '@/components/citas/CitasForm.vue'
import ModalBase from '@/components/commons/ModalBase.vue'
import Button from 'primevue/button'
import CitaDetail from '@/components/citas/CitaDetail.vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const consultaStore = useConsultaStore()
const mascotaStore = useMascotaStore()
const toast = useToast()
const showModal = ref(false)
const editando = ref(false)
const citaActual = ref({
  id: null,
  fecha: '',
  hora: '',
  estatus: 0,
  veterinarioId: 2,
  medicamentosIds: [],
})
const mostrarDetalle = ref(false)
const citaSeleccionada = ref(null)
const isMobile = ref(false)

const showConfirmDeleteModal = ref(false)
const citaAEliminar = ref(null)

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '45rem'
})

const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
};

const mascotas = computed(() => mascotaStore.mascotas)

const abrirModal = () => {
  citaActual.value = {
    id: null,
    fecha: '',
    hora: '',
    estatus: 0,
    veterinarioId: 2,
    medicamentosIds: [],
  }
  editando.value = false
  showModal.value = true
}

const editarCita = (cita) => {
  citaActual.value = { ...cita }
  editando.value = true
  showModal.value = true
}

const guardarCita = async (cita) => {
  try {
    if (editando.value) {

      await consultaStore.updateConsulta(cita.id, cita)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cita actualizada correctamente', life: 3000 })
    } else {
      await consultaStore.createConsulta(cita)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cita registrada correctamente', life: 3000 })
    }
    showModal.value = false
  } catch (error) {
    console.error('Error al guardar la cita:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar la cita', life: 3000 })
  }
}

const verDetallesCita = (cita) => {
  citaSeleccionada.value = { ...cita }
  mostrarDetalle.value = true
}

const mostrarModalConfirmacionEliminacion = (cita) => {

  if (cita) {
    citaAEliminar.value = cita
    showConfirmDeleteModal.value = true
  } else {
    console.error('Cita no válida para eliminar:', cita)
    toast.add({ severity: 'error', summary: 'Error', detail: 'La cita no es válida para eliminar', life: 3000 })
  }
}

const eliminarCita = async () => {
  try {
    if (citaAEliminar.value) {
      await consultaStore.deleteConsulta(citaAEliminar.value)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cita eliminada correctamente', life: 3000 })
    } else {
      console.error('Error: No se encontró el id de la cita para eliminar')
      toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar la cita', life: 3000 })
    }
    showConfirmDeleteModal.value = false
  } catch (error) {
    console.error('Error al eliminar la cita:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar la cita', life: 3000 })
  }
}

const cancelarEliminacion = () => {
  showConfirmDeleteModal.value = false
}

onBeforeMount(async () => {
  await consultaStore.fetchAllConsultas()
  await mascotaStore.fetchMascotas()
  checkMobile();
})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard de Citas</h1>
      <Button
        :label="isMobile ? '' : 'Nueva Cita'"
        :icon="isMobile ? 'pi pi-plus' : ''"
        @click="abrirModal()"
        class="custom-primary-button"
      />
    </div>
    <div v-if="consultaStore.loading">Cargando...</div>
    <div v-else-if="consultaStore.error">{{ consultaStore.error }}</div>
    <TableCitas
      :citas="consultaStore.consultas"
      @editar="editarCita"
      @eliminar="mostrarModalConfirmacionEliminacion"
      @verDetalles="verDetallesCita"
    />
    <ModalBase
      :visible="showModal"
      :header="editando ? 'Editar Cita' : 'Registrar Cita'"
      @update:visible="showModal = $event"
      :width="modalWidth"
      class="custom-modal"
    >
      <CitasForm
        :visible="showModal"
        :citaData="citaActual"
        :isEditing="editando"
        :mascotas="mascotas"
        @submit="guardarCita"
        @update:visible="showModal = $event"
        :citasExistentes="consultaStore.consultas"
      />
    </ModalBase>
    <ModalBase
      :visible="mostrarDetalle"
      header="Detalles de la Cita"
      @update:visible="mostrarDetalle = $event"
      :width="'40rem'"
      class="custom-modal"
    >
      <CitaDetail v-if="citaSeleccionada" :pet="citaSeleccionada" />
    </ModalBase>

    <ModalBase
      :visible="showConfirmDeleteModal"
      header="Confirmar Eliminación"
      @update:visible="showConfirmDeleteModal = $event"
      :width="'30rem'"
      class="custom-modal"
    >
      <div class="p-4">
        <p class="justify-center text-center">¿Estás seguro de que deseas eliminar esta cita?</p>
        <div class="flex justify-center space-x-2 mt-4">
          <Button
            label="Cancelar"
            @click="cancelarEliminacion"
            class="custom-cancel-button"
          />
          <Button
            label="Eliminar"
            @click="eliminarCita"
            class="custom-danger-button"
          />
        </div>
      </div>
    </ModalBase>

    <Toast position="top-right" />
  </div>
</template>

<style scoped>
.custom-primary-button {
  background-color: #001F3F !important;
  border-color: #001F3F !important;
  color: white !important;
}
.custom-primary-button:hover {
  background-color: #003366 !important;
}

.custom-cancel-button {
  color: #001F3F !important;
  background-color: transparent !important;
  border-color: #001F3F;
}
.custom-cancel-button:hover {
  background-color: #b8d7ff8c !important;
  color: #001F3F !important;
  border-color: #001F3F !important;
}

.custom-danger-button {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}
.custom-danger-button:hover {
  background-color: #c82333 !important;
}

.custom-modal .p-dialog {
  border-radius: 10px;
}

.custom-modal .p-dialog-header {
  background-color: #001F3F;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
