<template>
  <BaseTable :data="citas" stripedRows tableStyle="min-width: 50rem" paginator :rows="5">
    <Column field="id" header="ID"></Column>

    <Column header="Nombre del Paciente">
      <template #body="{ data }">
        <button @click="$emit('verDetalles', data)" class="text-blue-600 hover:underline">
          {{ data.nombre }}
        </button>
      </template>
    </Column>

    <Column field="fecha" header="Fecha"></Column>
    <Column field="hora" header="Hora"></Column>
    <Column field="estatus" header="Estado"></Column>

    <Column header="Acciones">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            style="color: #1e88e5"
            @click="$emit('editar', data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text"
            style="color: #e53935"
            @click="$emit('eliminar', data.id)"
          />
        </div>
      </template>
    </Column>
  </BaseTable>
</template>

<script setup lang="ts">
import Column from "primevue/column";
import Button from "primevue/button";
import BaseTable from "@/components/commons/TableDataBase.vue";

defineProps<{ citas: any[] }>();
defineEmits(["editar", "eliminar", "verDetalles"]);
</script>
