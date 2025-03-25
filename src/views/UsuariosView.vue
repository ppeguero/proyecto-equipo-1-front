<template>
  <div class="mx-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold py-2 pl-2 text-gray-800">Usuarios</h1>
        <Button
          :label="isMobile ? '' : 'Agregar Usuario'"
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
      <UsuarioForm
        v-if="modalMode === 'add' || modalMode === 'edit'"
        :usuario="selectedUsuario"
        :rolesDisponibles="roles"
        ref="usuarioForm"
      />
      <UsuarioDetail
        v-else-if="modalMode === 'detail'"
        :usuario="selectedUsuario"
        @close="closeModal"
      />
      <div v-else-if="modalMode === 'delete'" class="text-center">
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
      </div>

      <template #footer>
        <div class="flex justify-center w-full gap-3">
          <Button label="Cancelar" @click="closeModal" class="custom-cancel-button" />
          <Button
            v-if="modalMode === 'add'"
            label="Agregar"
            @click="addUsuario"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'edit'"
            label="Guardar"
            @click="editUsuario"
            class="custom-primary-button"
          />
          <Button
            v-else-if="modalMode === 'delete'"
            label="Eliminar"
            @click="deleteUsuario"
            class="custom-danger-button"
          />
        </div>
      </template>
    </ModalBase>
  </div>

  <UsuarioTable
    :usuarios="usuarios"
    :roles="roles"
  />
  <Toast />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUsuarioStore } from '@/stores/usuario';
import { useRolStore   } from '@/stores/rolStore';
import { useToast } from 'primevue/usetoast';

import UsuarioForm from '@/components/usuarios/UsuarioForm.vue';
import Button from 'primevue/button';
import ModalBase from '@/components/commons/ModalBase.vue';
import Toast from 'primevue/toast';
import type { UsuarioDto } from '@/interfaces/UsuarioDto';
import { storeToRefs } from 'pinia';

import UsuarioTable from '@/components/usuarios/UsuarioTable.vue';

const usuarioStore = useUsuarioStore();
const { getAllUsuarios } = usuarioStore;
const { usuarios } = storeToRefs(usuarioStore);

const rolesStore = useRolStore();
const { fetchRoles } = rolesStore;
const { roles } = storeToRefs(rolesStore);

const toast = useToast();

const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit' | 'delete' | 'detail'>('add');
const selectedUsuario = ref<UsuarioDto | null>(null);
const modalHeader = ref('');
const isMobile = ref(false);
const usuarioForm = ref<InstanceType<typeof UsuarioForm> | null>(null);

const modalWidth = computed(() => {
  return isMobile.value ? '90vw' : '45rem';
});

const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  await getAllUsuarios();
  await fetchRoles();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const openModal = (mode: 'add' | 'edit' | 'delete' | 'detail', usuario?: UsuarioDto) => {
  modalMode.value = mode;
  selectedUsuario.value = usuario ? { ...usuario } : null;

  if (mode === 'add') modalHeader.value = 'Agregar Usuario';
  else if (mode === 'edit') modalHeader.value = 'Editar Usuario';
  else if (mode === 'delete') modalHeader.value = 'Eliminar Usuario';
  else if (mode === 'detail') modalHeader.value = 'Detalle del Usuario';

  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const addUsuario = async () => {
  if (usuarioForm.value) {
    const isValid = await usuarioForm.value.validateForm();
    if (isValid) {
      const usuario = usuarioForm.value.localUsuario;
      await usuarioStore.addUsuario(usuario);
      closeModal();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado correctamente' });
    }
  }
};
const editUsuario = async () => {
  if (usuarioForm.value) {
    const isValid = await usuarioForm.value.validateForm();
    if (isValid) {
      const usuario = usuarioForm.value.localUsuario;
      await usuarioStore.updateUsuario(usuario);
      closeModal();
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
    }
  }
};

const deleteUsuario = async () => {
  if (selectedUsuario.value) {
    await usuarioStore.deleteUsuario(selectedUsuario.value.id);
    closeModal();
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente' });
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
