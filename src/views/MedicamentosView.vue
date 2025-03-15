<template>
  <div class="mx-4">
    <div class="flex justify-between mb-10">
      <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Medicamentos</h1>
      <Button label="Agregar Medicamento" @click="openModal('add')" class="custom-primary-button" />
    </div>

    <ModalBase
      :visible="modalVisible"
      :header="modalHeader"
      @update:visible="modalVisible = $event"
    >
      <MedicamentosForm
        v-if="modalMode === 'add' || modalMode === 'edit'"
        :medicamento="selectedMedicamento"
        ref="medicamentoForm"
      />
      <div v-else-if="modalMode === 'delete'" class="text-center">
        <p>¿Estás seguro de que deseas eliminar este medicamento?</p>
      </div>

      <template #footer>
        <div class="flex justify-center w-full gap-3">
          <Button label="Cancelar" @click="closeModal" class="custom-cancel-button" />
          <Button
            v-if="modalMode === 'add'"
            label="Agregar"
            @click="addMedicamento"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'edit'"
            label="Guardar"
            @click="editMedicamento"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'delete'"
            label="Eliminar"
            @click="deleteMedicamento"
            class="custom-danger-button"
          />
        </div>
      </template>
    </ModalBase>

    <MedicamentosTable
      :medicamentos="medicamentos"
      @edit="openModal('edit', $event)"
      @delete="openModal('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import MedicamentosForm from '@/components/medicamentos/MedicamentosForm.vue';
import MedicamentosTable from '@/components/medicamentos/MedicamentosTable.vue';
import { medicamentos } from '@/data/medicamentosData';

interface Medicamento {
  id: number;
  nombre: string;
  descripcion: string;
  dosis: string;
  fechaVencimiento: string;
  stock: number;
  fechaCreacion: string;
}

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');
const selectedMedicamento = ref<Medicamento | null>(null);
const modalHeader = ref('');
const medicamentoForm = ref<InstanceType<typeof MedicamentosForm> | null>(null);

const openModal = (mode: 'add' | 'edit' | 'delete', medicamento?: Medicamento) => {
  modalMode.value = mode;
  selectedMedicamento.value = medicamento ? { ...medicamento } : null;

  if (mode === 'add') {
    modalHeader.value = 'Agregar Medicamento';
  } else if (mode === 'edit') {
    modalHeader.value = 'Editar Medicamento';
  } else if (mode === 'delete') {
    modalHeader.value = 'Eliminar Medicamento';
  }

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addMedicamento = async () => {
  if (medicamentoForm.value && (await medicamentoForm.value.validateForm())) {
    const newMedicamento = medicamentoForm.value.localMedicamento;
    const medicamentoToAdd: Medicamento = {
      id: medicamentos.length + 1,
      nombre: newMedicamento.nombre,
      descripcion: newMedicamento.descripcion,
      dosis: newMedicamento.dosis,
      fechaVencimiento: newMedicamento.fechaVencimiento,
      stock: newMedicamento.stock,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    medicamentos.push(medicamentoToAdd);
    closeModal();
  }
};

const editMedicamento = async () => {
  if (medicamentoForm.value && selectedMedicamento.value && (await medicamentoForm.value.validateForm())) {
    const updatedMedicamento = medicamentoForm.value.localMedicamento;
    const index = medicamentos.findIndex((m) => m.id === selectedMedicamento.value!.id);
    if (index !== -1) {
      medicamentos[index] = { ...selectedMedicamento.value, ...updatedMedicamento };
    }
    closeModal();
  }
};

const deleteMedicamento = () => {
  if (selectedMedicamento.value) {
    const index = medicamentos.findIndex((m) => m.id === selectedMedicamento.value!.id);
    if (index !== -1) {
      medicamentos.splice(index, 1);
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