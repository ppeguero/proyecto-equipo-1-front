<template>
  <div class="mx-4">
    <div class="flex justify-between mb-10">
          <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Mascotas</h1>

      <Button label="Agregar Mascota" @click="openModal('add')" />
    </div>

    <ModalBase
      :visible="modalVisible"
      :header="modalHeader"
      @update:visible="modalVisible = $event"
    >
      <PetForm
        v-if="modalMode === 'add' || modalMode === 'edit'"
        :pet="selectedPet"
        ref="petForm"
      />
      <div v-else-if="modalMode === 'delete'">
        <p>¿Estás seguro de que deseas eliminar esta mascota?</p>
      </div>

      <template #footer>
        <Button label="Cancelar" @click="closeModal" class="p-button-text" />
        <Button
          v-if="modalMode === 'add'"
          label="Agregar"
          @click="addPet"
          class="p-button-primary"
        />
        <Button
          v-else-if="modalMode === 'edit'"
          label="Guardar"
          @click="editPet"
          class="p-button-primary"
        />
        <Button
          v-else-if="modalMode === 'delete'"
          label="Eliminar"
          @click="deletePet"
          class="p-button-danger"
        />
      </template>
    </ModalBase>

    <PetTable
      :pets="pets"
      @edit="openModal('edit', $event)"
      @delete="openModal('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import PetForm from '@/components/mascotas/PetForm.vue';
import PetTable from '@/components/mascotas/PetTable.vue';
import { pets } from '@/data/petsData';
import Img1 from '@/assets/img/pets/1.jpg';

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');
const selectedPet = ref<any>(null);
const modalHeader = ref('');
const petForm = ref(null);

const openModal = (mode: 'add' | 'edit' | 'delete', pet?: any) => {
  modalMode.value = mode;
  selectedPet.value = pet ? { ...pet } : null;

  if (mode === 'add') {
    modalHeader.value = 'Agregar Mascota';
  } else if (mode === 'edit') {
    modalHeader.value = 'Editar Mascota';
  } else if (mode === 'delete') {
    modalHeader.value = 'Eliminar Mascota';
  }

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addPet = () => {
  const newPet = petForm.value.localPet;
  const petToAdd = {
    id: pets.length + 1,
    imagen: Img1,
    ...newPet,
    fechaRegistro: new Date().toISOString().split('T')[0],
  };
  pets.push(petToAdd);
  closeModal();
};

const editPet = () => {
  const updatedPet = petForm.value.localPet;
  const index = pets.findIndex((p) => p.id === selectedPet.value.id);
  if (index !== -1) {
    pets[index] = { ...selectedPet.value, ...updatedPet };
  }
  closeModal();
};

const deletePet = () => {
  const index = pets.findIndex((p) => p.id === selectedPet.value.id);
  if (index !== -1) {
    pets.splice(index, 1);
  }
  closeModal();
};
</script>
