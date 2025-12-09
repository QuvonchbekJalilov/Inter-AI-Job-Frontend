<template>
  <div v-if="show" :class="['grid gap-6', gridClass]">
    <div
        v-for="n in count"
        :key="n"
        class="flex w-full max-w-lg flex-col mb-3 mt-10 rounded-2xl overflow-hidden shadow bg-white"
    >
      <!-- yuqori tag (outer) -->
      <div class="flex items-center">
        <div class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-sm outer">
          <div class="skel h-4 w-24 rounded"></div>
        </div>
      </div>

      <!-- card body -->
      <div class="flex flex-col bg-white p-4 rounded-tr-2xl">
        <!-- title -->
        <div class="skel h-6 w-3/4 rounded mb-3"></div>

        <!-- company + score badge -->
        <div class="mb-3 flex items-center justify-between gap-2">
          <div class="flex items-center basis-2/5 gap-2 truncate">
            <div class="skel h-4 w-4 rounded-full shrink-0"></div>
            <div class="skel h-4 w-28 rounded"></div>
          </div>
          <div class="skel h-6 w-28 rounded-full"></div>
        </div>

        <!-- date -->
        <div class="skel h-4 w-32 rounded"></div>
      </div>

      <!-- bottom button -->
      <div class="w-full overflow-hidden rounded-b-2xl">
        <div class="skel w-full h-11"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show:   { type: Boolean, default: false },
  count:  { type: Number,  default: 6 },
  cols:   { type: Number,  default: 3 }, // md:grid-cols-3 by default
})

const gridClass = computed(() => `grid-cols-1 md:grid-cols-${props.cols}`)
</script>

<style scoped>
/* sizdagi notch uchun aynan o'sha klass */
.outer:after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  background-image: radial-gradient(circle at 100% 100%, transparent 8px, white calc(4px + 1px));
  bottom: 0;
  right: -8px;
  display: block;
  z-index: 1;
  transform: rotate(270deg);
}

/* shimmer effekt (yengil) */
.skel {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb; /* tailwind gray-200 */
  border-radius: 0.375rem;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0));
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>
