<template>
  <div class="mx-4">
    <div class="flex justify-between mb-10">
      <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Pacientes</h1>
      <Button label="Agregar Paciente" @click="openModal('add')" class="custom-primary-button" />
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
      <div v-else-if="modalMode === 'delete'" class="text-center">
        <p>¿Estás seguro de que deseas eliminar esta mascota?</p>
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

interface Pet {
  id: number;
  imagen: string;
  nombreMascota: string;
  raza: string;
  especie: string;
  fechaNacimiento: string;
  edad: string;
  dueno: string;
  fechaRegistro: string;
}

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');
const selectedPet = ref<Pet | null>(null);
const modalHeader = ref('');
const petForm = ref<InstanceType<typeof PetForm> | null>(null);

const openModal = (mode: 'add' | 'edit' | 'delete', pet?: Pet) => {
  modalMode.value = mode;
  selectedPet.value = pet ? { ...pet } : null;

  if (mode === 'add') {
    modalHeader.value = 'Agregar Paciente';
  } else if (mode === 'edit') {
    modalHeader.value = 'Editar Paciente';
  } else if (mode === 'delete') {
    modalHeader.value = 'Eliminar Paciente';
  }

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addPet = async () => {
  if (petForm.value && (await petForm.value.validateForm())) {
    const newPet = petForm.value.localPet;
    const petToAdd: Pet = {
      id: pets.length + 1,
      imagen: Img1,
      nombreMascota: newPet.nombreMascota,
      raza: newPet.raza,
      especie: newPet.especie,
      fechaNacimiento: newPet.fechaNacimiento,
      edad: newPet.edad,
      dueno: newPet.dueno,
      fechaRegistro: new Date().toISOString().split('T')[0],
    };
    pets.push(petToAdd);
    closeModal();
  }
};

const editPet = async () => {
  if (petForm.value && selectedPet.value && (await petForm.value.validateForm())) {
    const updatedPet = petForm.value.localPet;
    const index = pets.findIndex((p) => p.id === selectedPet.value!.id);
    if (index !== -1) {
      pets[index] = { ...selectedPet.value, ...updatedPet };
    }
    closeModal();
  }
};

const deletePet = () => {
  if (selectedPet.value) {
    const index = pets.findIndex((p) => p.id === selectedPet.value!.id);
    if (index !== -1) {
      pets.splice(index, 1);
    }
  }
  closeModal();
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
  color: #001F3F !important; /* Texto marino */
  background-color: transparent !important;
  border-color: #001F3F;
}

.custom-cancel-button:hover {
    background-color: #b8d7ff8c !important;
  color: #001F3F !important;
 border-color: #001F3F !important;

}
</style>
