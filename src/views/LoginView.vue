<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
  <div className="lg:flex h-screen">
    <div className="lg:w-4/6 bg-white flex items-end justify-center">
      <img src="../../src/assets/img/veterinaria-cartoon.png" alt="Veterinaria" className="h-3/4 w-auto" />
    </div>
    <div className="lg:w-3/6 bg-[#8ECCFF] flex items-center justify-center">
      <LoginForm />
    </div>
  </div>
</template>
