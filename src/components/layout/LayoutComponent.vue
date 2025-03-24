<template>
  <div class="h-screen relative">
    <HeaderComponent
      class="z-20"
      :isSidebarCollapsed="isSidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />

    <main class="h-[calc(100vh-56px)] w-full absolute top-14 z-10">
      <SidebarComponent :isCollapsed="isSidebarCollapsed" />
      <section
        :class="[
          'p-5',
          'transition-all',
          'duration-500',
          'ease-in-out',
          isSidebarCollapsed
            ? 'ml-[60px] w-[calc(100%-60px)]'
            : 'ml-[240px] w-[calc(100%-240px)]'
        ]"
      >
      <Toast/>
        <router-view></router-view>
      </section>
    </main>

    <div id="toast-container" class="fixed top-0 right-0 z-50"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeaderComponent from '../shared/HeaderComponent.vue';
import SidebarComponent from '../shared/SidebarComponent.vue';
import Toast from 'primevue/toast';

const isSidebarCollapsed = ref(true);
const breakpoint = 1024;

const checkScreenSize = () => {
  if (window.innerWidth < breakpoint) {
    isSidebarCollapsed.value = true;
  } else {
    isSidebarCollapsed.value = false;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>
