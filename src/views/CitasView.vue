<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useConsultaStore } from '@/stores/useConsultaStore'
import { useMascotaStore } from '@/stores/mascotaStore' // ✅ Importar el store de mascotas
import TableCitas from '@/components/citas/CitasTable.vue'
import CitasForm from '@/components/citas/CitasForm.vue'
import ModalBase from '@/components/commons/ModalBase.vue'
import Button from 'primevue/button'
import CitaDetail from '@/components/citas/CitaDetail.vue'

const consultaStore = useConsultaStore()
const mascotaStore = useMascotaStore() // ✅ Store de mascotas

onBeforeMount(async () => {
  await consultaStore.fetchAllConsultas()
  await mascotaStore.fetchMascotas() // ✅ Se cargan las mascotas antes de montar el componente
})

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

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '45rem'
})

// ✅ Obtener las mascotas como una propiedad reactiva
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
      console.log('Actualizando cita:', cita)
      await consultaStore.updateConsulta(cita.id, cita)
    } else {
      console.log('Creando nueva cita:', cita)
      await consultaStore.createConsulta(cita)
    }
    showModal.value = false
  } catch (error) {
    console.error('Error al guardar la cita:', error)
  }
}

const verDetallesCita = (cita) => {
  citaSeleccionada.value = { ...cita }
  mostrarDetalle.value = true
}

const eliminarCita = async (id) => {
  try {
    await consultaStore.deleteConsulta(id)
  } catch (error) {
    console.error('Error al eliminar la cita:', error)
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard de Citas</h1>
      <Button label="Registrar Cita" @click="abrirModal()" severity="primary" />
    </div>
    <div v-if="consultaStore.loading">Cargando...</div>
    <div v-else-if="consultaStore.error">{{ consultaStore.error }}</div>
    <TableCitas
      :citas="consultaStore.consultas"
      @editar="editarCita"
      @eliminar="eliminarCita"
      @verDetalles="verDetallesCita"
    />
    <ModalBase
      :visible="showModal"
      :header="editando ? 'Editar Cita' : 'Registrar Cita'"
      @update:visible="showModal = $event"
      :width="modalWidth"
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
    >
      <CitaDetail v-if="citaSeleccionada" :pet="citaSeleccionada" />
    </ModalBase>
  </div>
</template>
