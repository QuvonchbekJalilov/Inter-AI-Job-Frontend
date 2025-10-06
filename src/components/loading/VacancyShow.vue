<template>
  <div v-if="show" class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6 animate-pulse">
    <div>
      <div class="skel h-6 w-2/3 mb-2"></div>
      <div class="skel h-5 w-1/3 mb-1"></div>
      <div class="skel h-4 w-1/4"></div>
    </div>

    <div class="p-4 bg-gray-50 rounded-lg">
      <div class="skel h-6 w-32"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 border rounded-lg space-y-2">
        <div class="skel h-4 w-24"></div>
        <div class="skel h-5 w-1/2"></div>
      </div>
      <div class="p-4 border rounded-lg space-y-2">
        <div class="skel h-4 w-24"></div>
        <div class="skel h-5 w-1/2"></div>
      </div>
    </div>
    <div>
      <div class="skel h-5 w-40 mb-2"></div>
      <div class="space-y-2">
        <div class="skel h-4 w-full"></div>
        <div class="skel h-4 w-5/6"></div>
        <div class="skel h-4 w-2/3"></div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg text-center space-y-2 py-4">
      <div class="skel h-4 w-20 mx-auto"></div>
      <div class="skel h-5 w-32 mx-auto"></div>
    </div>

    <div>
      <div class="skel h-11 w-full rounded-lg"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false }
})
</script>

<style scoped>
.skel {
  @apply bg-gray-300 rounded;
  position: relative;
  overflow: hidden;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6), rgba(255,255,255,0));
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>
