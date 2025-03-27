<template>
  <div class="mx-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Pacientes</h1>
<Button
    :label="isMobile ? '' : 'Agregar Paciente'"
    :icon="isMobile ? 'pi pi-plus' : ''"
    @click="openModal('add')"
    class="custom-primary-button"
  />
</div>

    <ModalBase
      :visible="modalVisible"
      :header="modalHeader"
      @update:visible="modalVisible = $event"
        :width="modalWidth"
    >
      <PetForm
        v-if="modalMode === 'add' || modalMode === 'edit'"
        :pet="selectedPet"
        :clientes="clientes"
        ref="petForm"
      />
      <PetDetail
        v-else-if="modalMode === 'detail'"
        :pet="selectedPet"
        @close="closeModal"

      />
      <div v-else-if="modalMode === 'delete'" class="text-center">
        <p>¿Estás seguro de que deseas eliminar esta mascota? <br /> Se eliminarán las mascotas asociadas.</p>
      </div>

      <template #footer>
        <div class="flex justify-center w-full gap-3">
          <Button label="Cancelar" @click="closeModal" class="custom-cancel-button" />
          <Button
            v-if="modalMode === 'add'"
            label="Agregar"
            @click="addPet"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'edit'"
            label="Guardar"
            @click="editPet"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'delete'"
            label="Eliminar"
            @click="deletePet"
            class="custom-danger-button"
          />
        </div>
      </template>
    </ModalBase>

    <PetTable
      :pets="mascotas"
      :clientes="clientes"
      @edit="openModal('edit', $event)"
      @delete="openModal('delete', $event)"
      @detail="openModal('detail', $event)"
    />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useMascotaStore } from '@/stores/mascotaStore';
import { useClienteStore } from '@/stores/clienteStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import PetForm from '@/components/mascotas/PetForm.vue';
import PetTable from '@/components/mascotas/PetTable.vue';
import Toast from 'primevue/toast';
import type { Mascota, MascotaCreateDto, MascotaUpdateDto } from '@/interfaces/Mascota';
import { storeToRefs } from 'pinia';
import PetDetail from '@/components/mascotas/PetDetail.vue';

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();
const { fetchMascotas, addMascota, updateMascota, deleteMascota } = mascotaStore;
const { mascotas } = storeToRefs(mascotaStore);
const { fetchClientes } = clienteStore;
const { clientes } = storeToRefs(clienteStore);

const toast = useToast();

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete' | 'detail'>('add');
const selectedPet = ref<Mascota | null>(null);
const modalHeader = ref('');
const petForm = ref<InstanceType<typeof PetForm> | null>(null);
const isMobile = ref(false);

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '45rem';
});

const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  await fetchClientes();
  await fetchMascotas();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const openModal = (mode: 'add' | 'edit' | 'delete' | 'detail', pet?: Mascota) => {
  modalMode.value = mode;
  selectedPet.value = pet ? { ...pet } : null;

  if (mode === 'add') modalHeader.value = 'Agregar Paciente';
  else if (mode === 'edit') modalHeader.value = 'Editar Paciente';
  else if (mode === 'delete') modalHeader.value = 'Eliminar Paciente';
  else if (mode === 'detail') modalHeader.value = 'Detalle del Paciente';

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addPet = async () => {
  if (petForm.value && (await petForm.value.validateForm())) {
    try {
      const newPet = petForm.value.localPet;
      const mascotaDto: MascotaCreateDto = {
        nombre: newPet.nombre,
        especie: newPet.especie,
        raza: newPet.raza,
        fechaNacimiento: new Date(newPet.fechaNacimiento).toISOString().split('T')[0],
        clienteId: Number(newPet.clienteId),
        imagenFile: petForm.value.files[0],
      };
      await addMascota(mascotaDto);
      await fetchMascotas();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mascota agregada correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar la mascota', life: 3000 });
      // console.error('Error al agregar mascota:', error);
    }
  }
};

const editPet = async () => {
  if (petForm.value && selectedPet.value && (await petForm.value.validateForm())) {
    try {
      const updatedPet = petForm.value.localPet;
      const mascotaDto: MascotaUpdateDto = {
        id: selectedPet.value.id,
        nombre: updatedPet.nombre,
        especie: updatedPet.especie,
        raza: updatedPet.raza,
        fechaNacimiento: new Date(updatedPet.fechaNacimiento).toISOString().split('T')[0],
        clienteId: Number(updatedPet.clienteId),
        urlImagen: selectedPet.value.urlImagen || undefined,
        imagenFile: petForm.value.files[0],
      };
      await updateMascota(selectedPet.value.id, mascotaDto);
      await fetchMascotas();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mascota actualizada correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la mascota', life: 3000 });
      // console.error('Error al actualizar mascota:', error);
    }
  }
};

const deletePet = async () => {
  if (selectedPet.value) {
    try {
      await deleteMascota(selectedPet.value.id);
      await fetchMascotas();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mascota eliminada correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la mascota', life: 3000 });
      // console.error('Error al eliminar mascota:', error);
    }
  }
};
</script>

<style scoped>
.custom-primary-button {
  background-color: #001F3F !important;
  border-color: #001F3F !important;
  color: white !important;
}
.custom-primary-button:hover {
  background-color: #003366 !important;
}
.custom-danger-button {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}
.custom-danger-button:hover {
  background-color: #c82333 !important;
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
</style>
