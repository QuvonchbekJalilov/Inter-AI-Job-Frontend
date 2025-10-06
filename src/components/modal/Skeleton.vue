<template>
  <div v-if="show" class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div v-for="n in 6" :key="n" class="animate-pulse flex flex-col bg-white rounded-2xl shadow p-4">
      <div class="h-4 w-24 bg-gray-300 rounded mb-4"></div>
      <div class="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 w-1/3 bg-gray-300 rounded"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false }
})
</script>
