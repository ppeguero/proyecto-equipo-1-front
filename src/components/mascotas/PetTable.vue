<template>
  <TableDataBase
    :data="pets"
    tableStyle="min-width: 75rem"
    paginator
    :rows="5"
    class="text-center"
  >
    <Column field="id" header="ID" sortable style="width: 5%; text-align: center" />
    <Column field="imagen" header="Imagen" style="width: 10%; text-align: center">
      <template #body="{ data }">
        <img
          :src="data.imagen"
          alt="Mascota"
          class="w-12 h-12 rounded-full mx-auto object-cover"
        />
      </template>
    </Column>
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      sortable
      :style="`width: ${col.width}; text-align: center`"
    />
    <Column header="Acciones" style="width: 10%; text-align: center">
      <template #body="{ data }">
        <div class="flex gap-2 justify-center">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            style="color: #1E88E5;"
            @click="$emit('edit', data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text"
            style="color: #E53935;"
            @click="$emit('delete', data)"
          />
        </div>
      </template>
    </Column>
  </TableDataBase>
</template>

<script setup lang="ts">
import TableDataBase from '@/components/commons/TableDataBase.vue';
import Column from 'primevue/column';
import Button from 'primevue/button';

defineProps({
  pets: Array,
});

defineEmits(['edit', 'delete']);

const columns = [
  { field: 'nombreMascota', header: 'Nombre Mascota', width: '15%' },
  { field: 'fechaRegistro', header: 'Fecha Registro', width: '15%' },
  { field: 'fechaNacimiento', header: 'Fecha Nacimiento', width: '15%' },
  { field: 'edad', header: 'Edad', width: '10%' },
  { field: 'raza', header: 'Raza', width: '10%' },
  { field: 'especie', header: 'Especie', width: '10%' },
  { field: 'dueno', header: 'Dueño', width: '15%' },
];
</script>

<style scoped>
:deep(.p-column-header-content) {
  justify-content: center !important;
  width: 100%;
}

:deep(.p-datatable-tbody td) {
  text-align: center !important;
}
</style>
