<template>
  <TableDataBase
    :data="medicamentos"
    tableStyle="min-width: 75rem"
    paginator
    :rows="5"
    class="text-center"
  >
    <Column field="id" header="ID" sortable style="width: 5%; text-align: center" />
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      sortable
      :style="`width: ${col.width}; text-align: center`"
    >
      <template #body="{ data }" v-if="col.field === 'fechaVencimiento'">
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

const props = defineProps<{
  medicamentos: any[];
}>();

defineEmits(["edit", "delete"]);

const columns = [
  { field: "nombre", header: "Nombre de Medicamento", width: "15%" },
  { field: "descripcion", header: "Descripción", width: "20%" },
  { field: "dosis", header: "Dosis Recomendada", width: "15%" },
  { field: "fechaVencimiento", header: "Fecha de Vencimiento", width: "15%" },
  { field: "stock", header: "Stock", width: "10%" },
];

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