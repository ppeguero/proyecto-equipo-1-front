<template>
  <Toolbar class="header h-14 top-0 w-full fixed z-10" style="background-color: #bddbf3; padding: .5em; border: none; border-radius: 0;">
    <template #start>
      <div class="flex items-center h-full gap-3">
        <Button
          style="color: #375993;"
          variant="text"
          class="w-[35px] h-[35px]"
          icon="pi pi-bars"
          :class="{ 'rotate-180': isSidebarCollapsed }"
          @click="$emit('toggle-sidebar')"
        />
        <span
          v-if="!isSidebarCollapsed"
          class=" font-medium text-sm sm:text-base"
          style=" font-style: italic; color: #1e3a8a;"
        >
          Bienvenido,  {{ userRole || 'Usuario' }}
        </span>
      </div>
    </template>
    <template #end>
      <div class="flex items-center gap-3">
        <button
          class="relative flex items-center gap-2 focus:outline-none"
          @click="menu.toggle"
        >
        <span class="font-medium text-sm sm:text-base" style="color: #1e3a8a;">
            {{ userEmail || 'Usuario' }}
          </span>
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const menu = ref();
const position = ref('bottom-right');
const token = useStorage('token', '');
const userEmail = ref<string | null>(null);
const userRole = ref<string | null>(null);

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
}

const decodeToken = () => {
  if (token.value) {
    try {
      const decoded = jwtDecode<JwtPayload>(token.value);
      userEmail.value = decoded.email || null;
      userRole.value = decoded.role || null;
      if (!userEmail.value || !userRole.value) {
        // console.warn('El token no contiene los campos "email" o "role". Verifica el payload del token.');
      }
    } catch (error) {
      throw (error);
      // console.error('Error decodificando el token:', error);
      userEmail.value = null;
      userRole.value = null;
    }
  } else {
    userEmail.value = null;
    userRole.value = null;
  }
};

onMounted(() => {
  decodeToken();
});


const props = defineProps<{
  isSidebarCollapsed: boolean;
}>();



const userMenuItems = [
  {
    label: 'Configurar perfil',
    icon: 'pi pi-cog',
    command: () => {
      router.push('/dashboard/perfil');
    },
  },
];
</script>
