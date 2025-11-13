<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between text-xs sm:text-sm">
      <span class="font-medium text-slate-700">{{ label }}</span>
      <span class="text-[11px] text-slate-500">
        {{ note }} · {{ score }}/10
      </span>
    </div>

    <div class="h-2 rounded-full bg-slate-200 overflow-hidden">
      <div
          class="h-full bg-sky-500 rounded-full transition-all"
          :style="{ width: barWidth }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  note: String,
  score: Number,
});

const barWidth = computed(() => `${(props.score / 10) * 100}%`);
</script>
