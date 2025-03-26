<template>
    <TableDataBase
        :data="usuarios"
        tableStyle="min-width: 75rem"
        paginator
        :rows="5"
        class="text-center"
    >
        <Column
            v-for="col in columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            sortable
            :style="`width: ${col.width}; text-align: center`"
        >
            <template #body="{ data }" v-if="col.field === 'roles'">
                <span v-for="(rol, index) in data.roles" :key="index">{{ rol }}<br /></span>
            </template>
            <template #body="{ data }" v-else-if="col.field === 'acciones'">
                <div class="flex gap-2 justify-center">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-text"
                        style="color: #1e88e5"
                        @click="$emit('edit', data)"
                    />
                    <Button
                        icon="pi pi-lock"
                        class="p-button-rounded p-button-text"
                        style="color: #000"
                        :style="data.id == id ? 'display: none' : ''"
                        @click="$emit('changePassword', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text"
                        style="color: #e53935"
                        :style="data.id == id ? 'display: none' : ''"
                        @click="$emit('delete', data)"
                    />
                </div>
            </template>
            <template #body="{ data }" v-else>
                {{ data[col.field] }}
            </template>
        </Column>

    </TableDataBase>
</template>

<script setup lang="ts">

import { computed } from "vue";
import TableDataBase from "@/components/commons/TableDataBase.vue";
import Column from "primevue/column";
import Button from "primevue/button";
import { defineProps } from "vue";
import { useUsuarioStore } from '@/stores/usuario';
import type { UsuarioDto } from '@/interfaces/UsuarioDto';
import type { RolDto } from '@/interfaces/RolDto';

const usuarioStore = useUsuarioStore();

const id = computed(() => usuarioStore.getDecodedToken()?.nameid || null);

defineProps<{
    usuarios: UsuarioDto[];
    roles: RolDto[];
}>();

defineEmits(["edit", "delete", "detail", "changePassword"]);

const columns = [
    { field: 'id', header: 'ID', width: '15%'},
    { field: "nombre", header: "Nombre Usuario", width: "15%" },
    { field: "apellido", header: "Apellido", width: "15%" },
    { field: "email", header: "Email", width: "15%" },
    { field: "roles", header: "Roles", width: "15%" },
    { field: "acciones", header: "Acciones", width: "10%" },
]
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
