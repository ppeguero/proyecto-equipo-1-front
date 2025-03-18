<template>
  <div class="card">
    <DataTable
      :value="data"
      :tableStyle="tableStyle"
      :paginator="paginator"
      :rows="rows"
      :loading="loading"
      v-bind="$attrs">
    
      <slot></slot>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  tableStyle: {
    type: String,
    default: 'min-width: 50rem'
  },
  paginator: Boolean,
  rows: Number,
  loading: Boolean
});
</script>
