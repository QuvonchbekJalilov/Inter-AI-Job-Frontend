<template>
  <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100">
    <div class="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-green-600" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <h3 class="text-sm text-gray-900">{{ title }}</h3>

          <span
              v-if="impact === 'high'"
              class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          >
            Высокий impact
          </span>
        </div>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  impact: String
});
</script>
