<template>
  <div class="mx-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Clientes</h1>
  <Button
    :label="isMobile ? '' : 'Agregar Cliente'"
    :icon="isMobile ? 'pi pi-plus' : ''"
    @click="openModal('add')"
    class="custom-primary-button mt-2"
  />
</div>

    <ModalBase
      :visible="modalVisible"
      :header="modalHeader"
      @update:visible="modalVisible = $event"
       :width="modalWidth"
    >
      <ClientForm
        v-if="modalMode === 'add' || modalMode === 'edit'"
        :cliente="selectedCliente"
        ref="clientForm"
      />
      <div v-else-if="modalMode === 'delete'" class="text-center">
        <p>
          ¿Estás seguro de que deseas eliminar este cliente? Esto también eliminará todas sus mascotas con sus consultas asociadas.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-center w-full gap-3">
          <Button label="Cancelar" @click="closeModal" class="custom-cancel-button" />
          <Button
            v-if="modalMode === 'add'"
            label="Agregar"
            @click="handleAddCliente"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'edit'"
            label="Guardar"
            @click="handleEditCliente"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'delete'"
            label="Eliminar"
            @click="handleDeleteCliente"
            class="custom-danger-button"
          />
        </div>
      </template>
    </ModalBase>

    <ClienteTable
      :clientes="clientes"
      @edit="openModal('edit', $event)"
      @delete="openModal('delete', $event)"
    />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useClienteStore } from '@/stores/clienteStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import ClientForm from '@/components/clientes/ClientForm.vue';
import ClienteTable from '@/components/clientes/ClienteTable.vue';
import Toast from 'primevue/toast';
import type { Cliente, ClienteCreateDto, ClienteUpdateDto } from '@/interfaces/Cliente';
import { storeToRefs } from 'pinia';

const clienteStore = useClienteStore();
const { fetchClientes, addCliente, updateCliente, deleteCliente } = clienteStore;
const { clientes } = storeToRefs(clienteStore);

const toast = useToast();

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');
const selectedCliente = ref<Partial<Cliente> | null>(null);
const modalHeader = ref('');
const clientForm = ref<InstanceType<typeof ClientForm> | null>(null);
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
  fetchClientes();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const openModal = (mode: 'add' | 'edit' | 'delete', cliente?: Cliente) => {
  modalMode.value = mode;
  selectedCliente.value = cliente ? { ...cliente } : null;

  if (mode === 'add') modalHeader.value = 'Agregar Cliente';
  else if (mode === 'edit') modalHeader.value = 'Editar Cliente';
  else if (mode === 'delete') modalHeader.value = 'Eliminar Cliente';

  modalVisible.value = true;
};


const closeModal = () => {
  modalVisible.value = false;
  selectedCliente.value = null;
};

const handleAddCliente = async () => {
  if (clientForm.value && (await clientForm.value.validateForm())) {
    try {
      const newCliente = clientForm.value.localCliente;
      const clienteDto: ClienteCreateDto = {
        nombre: newCliente.nombre,
        apellido: newCliente.apellido,
        direccion: newCliente.direccion,
        telefono: newCliente.telefono,
      };
      await addCliente(clienteDto);
      await fetchClientes();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente agregado correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el cliente', life: 3000 });
      // console.error('Error al agregar cliente:', error);
    }
  }
};

const handleEditCliente = async () => {
  if (clientForm.value && selectedCliente.value && (await clientForm.value.validateForm())) {
    try {
      const updatedCliente = clientForm.value.localCliente;
      const clienteDto: ClienteUpdateDto = {
        id: selectedCliente.value.id!,
        nombre: updatedCliente.nombre,
        apellido: updatedCliente.apellido,
        direccion: updatedCliente.direccion,
        telefono: updatedCliente.telefono,
        mascotasIds: updatedCliente.mascotas?.map((m: any) => m.id) || [],
      };
      await updateCliente(selectedCliente.value.id!, clienteDto);
      await fetchClientes();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el cliente', life: 3000 });
      // console.error('Error al actualizar cliente:', error);
    }
  }
};

const handleDeleteCliente = async () => {
  if (selectedCliente.value) {
    try {
      await deleteCliente(selectedCliente.value.id!);
      await fetchClientes();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente y sus mascotas eliminados correctamente', life: 3000 });
      closeModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 3000 });
      // console.error('Error al eliminar cliente:', error);
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
