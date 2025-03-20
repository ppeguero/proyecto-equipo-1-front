<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="header"
    :style="{ width: width }"
    :modal="true"

  >
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";

interface Props {
  visible: boolean;
  header: string;
  width?: string;
}

defineProps<Props>();

defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();
</script>
