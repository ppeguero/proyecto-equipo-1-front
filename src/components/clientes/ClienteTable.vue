<template>
  <TableDataBase
    :data="clientes"
    tableStyle="min-width: 75rem"
    paginator
    :rows="5"
    class="text-center"
  >
    <Column field="id" header="ID" sortable style="width: 10%; text-align: center" />
    <Column field="nombre" header="Nombre" sortable style="width: 15%; text-align: center" />
    <Column field="apellido" header="Apellido" sortable style="width: 15%; text-align: center" />
    <Column field="direccion" header="Dirección" style="width: 20%; text-align: center" />
    <Column field="telefono" header="Teléfono" style="width: 15%; text-align: center" />
    <Column header="Mascotas" style="width: 25%; text-align: center">
      <template #body="{ data }">
        <div class="flex flex-wrap gap-1 justify-center">
          <Button
            v-for="mascota in data.mascotas"
            :key="mascota.id"
            :value="mascota.nombre"
            :label="mascota.nombre"
            severity="info"
             variant="outlined"
             style="border-radius: 20px; font-size: .8em; height: 1vh;"
          />
          <span v-if="!data.mascotas || data.mascotas.length === 0">Sin mascotas</span>
        </div>
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

defineProps<{
  clientes: any[];
}>();

defineEmits(["edit", "delete"]);
</script>

