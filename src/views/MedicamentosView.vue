<template>
  <div class="mx-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold py-2 pl-2 text-gray-800">Medicamentos</h1>
      <Button
        :label="isMobile ? '' : 'Agregar Medicamento'"
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
            @click="addMed"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'edit'"
            label="Guardar"
            @click="editMed"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'delete'"
            label="Eliminar"
            @click="deleteMed"
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
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useMedicamentoStore } from '@/stores/medicamentoStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import MedicamentosForm from '@/components/medicamentos/MedicamentosForm.vue';
import MedicamentosTable from '@/components/medicamentos/MedicamentosTable.vue';
import Toast from 'primevue/toast';
import type { Medicamento, MedicamentoCreateDto, MedicamentoUpdateDto } from '@/interfaces/Medicamento';
import { storeToRefs } from 'pinia';

const medicamentoStore = useMedicamentoStore();
const { fetchMedicamentos, addMedicamento, updateMedicamento, deleteMedicamento } = medicamentoStore;
const { medicamentos } = storeToRefs(medicamentoStore);

const toast = useToast();

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');
const selectedMedicamento = ref<Medicamento | null>(null);
const modalHeader = ref('');
const medicamentoForm = ref<InstanceType<typeof MedicamentosForm> | null>(null);
const isMobile = ref(false);

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '35rem';
});

const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  fetchMedicamentos();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const openModal = (mode: 'add' | 'edit' | 'delete', medicamento?: Medicamento) => {
  modalMode.value = mode;
  selectedMedicamento.value = medicamento ? { ...medicamento } : null;

  if (mode === 'add') modalHeader.value = 'Agregar Medicamento';
  else if (mode === 'edit') modalHeader.value = 'Editar Medicamento';
  else if (mode === 'delete') modalHeader.value = 'Eliminar Medicamento';

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addMed = async () => {
  if (medicamentoForm.value && (await medicamentoForm.value.validateForm())) {
    try {
      const newMedicamento = medicamentoForm.value.localMedicamento;
      const medicamentoDto: MedicamentoCreateDto = {
        nombre: newMedicamento.nombre,
        descripcion: newMedicamento.descripcion,
        dosis: newMedicamento.dosis,
        fechaVencimiento: new Date(newMedicamento.fechaVencimiento).toISOString().split('T')[0],
        stock: Number(newMedicamento.stock),
      };
      await addMedicamento(medicamentoDto);
      await fetchMedicamentos();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamento agregado correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el medicamento', life: 3000 });
      throw (error);
      // console.error('Error al agregar medicamento:', error);
    }
  }
};

const editMed = async () => {
  if (medicamentoForm.value && selectedMedicamento.value && (await medicamentoForm.value.validateForm())) {
    try {
      const updatedMedicamento = medicamentoForm.value.localMedicamento;
      const medicamentoDto: MedicamentoUpdateDto = {
        id: selectedMedicamento.value.id,
        nombre: updatedMedicamento.nombre,
        descripcion: updatedMedicamento.descripcion,
        dosis: updatedMedicamento.dosis,
        fechaVencimiento: new Date(updatedMedicamento.fechaVencimiento).toISOString().split('T')[0],
        stock: Number(updatedMedicamento.stock),
      };
      await updateMedicamento(selectedMedicamento.value.id, medicamentoDto);
      await fetchMedicamentos();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamento actualizado correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el medicamento', life: 3000 });
      throw (error);
      // console.error('Error al actualizar medicamento:', error);
    }
  }
};

const deleteMed = async () => {
  if (selectedMedicamento.value) {
    try {
      await deleteMedicamento(selectedMedicamento.value.id);
      await fetchMedicamentos();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamento eliminado correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el medicamento', life: 3000 });
      throw (error);
      // console.error('Error al eliminar medicamento:', error);
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
