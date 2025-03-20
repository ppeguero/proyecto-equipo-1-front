<template>
  <TableDataBase
    :data="pets"
    tableStyle="min-width: 75rem"
    paginator
    :rows="5"
    class="text-center"
  >
    <Column field="id" header="ID" sortable style="width: 5%; text-align: center" />
    <Column field="urlImagen" header="Imagen" style="width: 10%; text-align: center">
      <template #body="{ data }">
        <img
          :src="data.urlImagen || 'default-image.png'"
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
    >
      <template #body="{ data }" v-if="col.field === 'clienteNombre'">
        {{ getClienteNombre(data.clienteId) }}
      </template>
      <template #body="{ data }" v-else-if="col.field === 'fechaRegistro' || col.field === 'fechaNacimiento'">
        {{ formatDate(data[col.field]) }}
      </template>
      <template #body="{ data }" v-else>
        {{ data[col.field] }}
      </template>
    </Column>
    <Column header="Acciones" style="width: 10%; text-align: center">
      <template #body="{ data }">
        <div class="flex gap-2 justify-center">
          <Button
          icon="pi pi-search"
          class="p-button-rounded p-button-text"
           style="color: #008040"
          @click="$emit('detail', data)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            style="color: #1e88e5"
            @click="$emit('edit', data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text"
            style="color: #e53935"
            @click="$emit('delete', data)"
          />
        </div>
      </template>
    </Column>
  </TableDataBase>
</template>

<script setup lang="ts">
import TableDataBase from "@/components/commons/TableDataBase.vue";
import Column from "primevue/column";
import Button from "primevue/button";
import { defineProps } from "vue";
import type { Cliente } from "@/interfaces/Cliente";

const props = defineProps<{
  pets: any[];
  clientes: Cliente[];
}>();

defineEmits(["edit", "delete", "detail"]);

const columns = [
  { field: "nombre", header: "Nombre Mascota", width: "15%" },
  { field: "fechaRegistro", header: "Fecha Registro", width: "15%" },
  { field: "fechaNacimiento", header: "Fecha Nacimiento", width: "15%" },
  { field: "raza", header: "Raza", width: "10%" },
  { field: "especie", header: "Especie", width: "10%" },
  { field: "clienteNombre", header: "Cliente", width: "15%" },
];

const getClienteNombre = (clienteId: number) => {
  const cliente = props.clientes.find((c) => c.id === clienteId);
  return cliente ? cliente.nombreCompleto : "Desconocido";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
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
