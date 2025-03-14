<template>
  <div>
    <input v-model="localPet.nombreMascota" placeholder="Nombre de la mascota" class="p-2 border rounded w-full mb-2"   />
    <input v-model="localPet.raza"  placeholder="Raza" class="p-2 border rounded w-full mb-2" />
    <input v-model="localPet.especie" placeholder="Especie"  class="p-2 border rounded w-full mb-2" />
    <input v-model="localPet.fechaNacimiento" type="date" placeholder="Fecha de Nacimiento" class="p-2 border rounded w-full mb-2"/>
    <input v-model="localPet.edad" placeholder="Edad" class="p-2 border rounded w-full mb-2"/>
    <input v-model="localPet.dueno"  placeholder="Dueño" class="p-2 border rounded w-full mb-2" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  pet: Object,
});

const localPet = ref({
  nombreMascota: '',
  raza: '',
  especie: '',
  fechaNacimiento: '',
  edad: '',
  dueno: '',
});

watch(
  () => props.pet,
  (newPet) => {
    if (newPet) {
      localPet.value = { ...newPet };
    }
  },
  { immediate: true }
);

defineExpose({ localPet });
</script>
