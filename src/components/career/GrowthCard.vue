<template>
  <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100">
    <div class="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-orange-600" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>

      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <h3 class="text-sm text-gray-900">{{ title }}</h3>

          <span
              class="px-2 py-0.5 rounded-full text-xs"
              :class="priority === 'high'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-yellow-100 text-yellow-700'"
          >
            {{ priority === 'high' ? 'Высокий' : 'Средний' }}
          </span>

          <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
            {{ time }}
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
  priority: String,
  time: String,
});
</script>
