<template>
  <div v-if="show" class="max-w-2xl mx-auto animate-pulse">
    <!-- Tabs -->
    <div class="flex items-stretch w-full max-w-md mx-auto gap-2 mb-6">
      <div v-for="n in 3" :key="n" class="skel h-10 flex-1 rounded-xl"></div>
    </div>

    <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
      <div class="skel h-5 w-32 rounded"></div>
    </h2>

    <!-- Profile fields -->
    <div class="space-y-3 text-sm text-gray-700">
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-40 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-52 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-36 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-28 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-60 rounded"></div>
      </div>
    </div>

    <!-- Edit button -->
    <div class="mt-4">
      <div class="skel h-9 w-full rounded-lg"></div>
    </div>

    <!-- Head Hunter header -->
    <h2 class="text-lg font-medium mb-4 mt-5 flex items-center gap-2 text-black">
      <div class="skel h-5 w-40 rounded"></div>
    </h2>

    <!-- HH text -->
    <div class="space-y-2 text-sm text-gray-700">
      <div class="skel h-4 w-full rounded"></div>
      <div class="skel h-4 w-3/4 rounded"></div>
    </div>
    <!-- Edit button -->
    <div class="mt-4">
      <div class="skel h-9 w-full rounded-lg"></div>
    </div>

    <!-- Head Hunter header -->
    <h2 class="text-lg font-medium mb-4 mt-5 flex items-center gap-2 text-black">
      <div class="skel h-5 w-40 rounded"></div>
    </h2>

    <!-- HH text -->
    <div class="space-y-2 text-sm text-gray-700">
      <div class="skel h-4 w-full rounded"></div>
      <div class="skel h-4 w-3/4 rounded"></div>
    </div>
    <div class="space-y-3 text-sm text-gray-700">
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-40 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-52 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-36 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-28 rounded"></div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="skel h-4 w-20 rounded"></div>
        <div class="skel h-4 w-60 rounded"></div>
      </div>
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
  @apply bg-gray-300;
  position: relative;
  overflow: hidden;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
