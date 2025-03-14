<template>
  <aside
    :class="[
      'sidebar fixed shadow overflow-hidden transition-all duration-500 ease-in-out bg-[#bddbf3] p-3 z-30 top-[56px]',
      isCollapsed ? 'w-[70px]' : 'w-[240px]',
      'h-[calc(100vh-56px)]'
    ]"
  >
    <div class="flex flex-col h-full">
      <div class="flex justify-center items-center mb-4" v-if="!isCollapsed">
        <img :src="Logo" alt="Logo" class="h-30 w-auto" />
      </div>

      <nav class="flex-grow w-full">
        <ul class="flex flex-col gap-3 w-full">
          <li v-for="item in filteredMenuItems" :key="item.path" class="w-full">
            <Button
              variant="text"
              :style="{
                color: '#375993',
                display: 'flex',
                width: '100%',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '1.5vh' : '1.5vh'
              }"
              :icon="item.icon"
              :label="!isCollapsed ? item.label : ''"
            />
          </li>
        </ul>
      </nav>

      <nav class="w-full">
        <ul class="flex flex-col gap-3 w-full">
          <li class="w-full">
            <Button
              variant="text"
              :style="{
                color: '#375993',
                display: 'flex',
                width: '100%',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '1.5vh' : '1.5vh'
              }"
              icon="pi pi-sign-out"
              :label="!isCollapsed ? 'Cerrar sesión' : ''"
            />
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Logo from '@/assets/img/logo.png';

const props = defineProps<{ isCollapsed: boolean }>();
//arreglotemporal
const baseMenuItems = [
  { label: 'Inicio', icon: 'pi pi-home', path: '/dashboard' },
  { label: 'Usuarios', icon: 'pi pi-users', path: '/dashboard/usuarios' },
  { label: 'Roles', icon: 'pi pi-user-edit', path: '/dashboard/roles' },
  { label: 'Citas', icon: 'pi pi-calendar', path: '/dashboard/citas' },
  { label: 'Clientes', icon: 'pi pi-briefcase', path: '/dashboard/clientes' },
  { label: 'Mascotas', icon: 'pi pi-prime', path: '/dashboard/mascotas' },
  { label: 'Medicamentos', icon: 'pi pi-cart-plus', path: '/dashboard/medicamentos' },
];

const filteredMenuItems = computed(() => baseMenuItems);
</script>
