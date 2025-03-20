<template>
  <Toolbar class="header h-14 top-0 w-full fixed z-10" style="background-color: #bddbf3; padding: .5em; border: none; border-radius: 0;">
    <template #start>
      <div class="flex items-center h-full">
        <Button
          style="color: #375993;"
          variant="text"
          class="w-[35px] h-[35px]"
          icon="pi pi-bars"
          :class="{ 'rotate-180': isSidebarCollapsed }"
          @click="$emit('toggle-sidebar')"
        />
      </div>
    </template>
    <template #end>
      <div class="flex items-center gap-3">
        <button
          class="relative flex items-center gap-2 focus:outline-none"
          @click="menu.toggle"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img
              src="../../assets/img/logo.png"
              alt="Avatar del usuario"
              class="w-full h-full object-cover"
            />
          </div>
        </button>

        <Menu
          ref="menu"
          :model="userMenuItems"
          :popup="true"
          class="[&_.p-menu-list]:p-2 [&_.p-menuitem]:rounded-md"
          :position="position"
        />
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { authService } from '@/services/AuthService';

const router = useRouter();
const menu = ref();
const position = ref('bottom-right');
const refreshToken = useStorage('refreshToken', '');


const props = defineProps<{
  isSidebarCollapsed: boolean;
}>();

const token = useStorage('token', '');

const logout = async () => {
  try {
    await authService.logout(refreshToken.value);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    token.value = '';
        refreshToken.value = '';

    router.push('/login');
  }
};

const userMenuItems = [
  {
    label: 'Cerrar sesión',
    icon: 'pi pi-sign-out',
    command: () => logout(),
  },
];
</script>
