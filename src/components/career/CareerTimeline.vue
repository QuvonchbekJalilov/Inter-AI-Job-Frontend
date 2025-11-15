<template>
  <section class="p-6 sm:p-8 bg-white rounded-3xl shadow-md border border-slate-200">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h2 class="text-gray-900 text-xl sm:text-2xl flex items-center gap-2">
        Karyera yo'li
      </h2>
      <p class="text-gray-600 text-xs sm:text-sm">
        Sizning kasbiy rivojlanish tarixingiz
      </p>
    </div>

    <div class="relative">
      <!-- Vertical Line -->
      <div class="absolute left-6 sm:left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-200 rounded-full"></div>

      <div class="space-y-10 sm:space-y-12">
        <div
            v-for="(item, index) in timeline"
            :key="index"
            class="relative pl-14 sm:pl-24"
        >
          <!-- Dot -->
          <div class="absolute left-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <div
                :class="[
              'rounded-full flex items-center justify-center shadow-lg',
              item.current
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-300'
                : 'bg-gradient-to-br from-blue-400 to-blue-500'
            ]"
                class="w-10 h-10 sm:w-12 sm:h-12"
            >
              <Briefcase class="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <!-- Card -->
          <div
              :class="[
            'rounded-xl p-4 sm:p-6 transition-all hover:shadow-xl',
            item.current
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300'
              : 'bg-gray-50 border border-gray-200'
          ]"
          >
            <!-- Header -->
            <div class="flex flex-col gap-2 mb-3 sm:mb-4">
              <div>
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <h3 class="text-gray-900 text-sm sm:text-base font-medium">
                    {{ item.title }}
                  </h3>

                  <span
                      v-if="item.current"
                      class="px-2 py-1 text-xs rounded-md bg-blue-600 text-white"
                  >
                Текущая
              </span>
                </div>

                <p class="text-blue-600 text-xs sm:text-sm">
                  {{ item.company }}
                </p>

                <div class="flex items-center flex-wrap gap-3 text-gray-500 text-xs sm:text-sm">
                  <div class="flex items-center gap-1">
                    <Calendar class="w-4 h-4" />
                    <span>{{ item.date }}</span>
                  </div>

                  <span class="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs">
                {{ item.duration }}
              </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">
              {{ item.description }}
            </p>

            <!-- Achievements -->
            <div class="mb-3 sm:mb-4">
              <p class="text-gray-600 text-xs sm:text-sm mb-2">
                Muhim yutuqlari:
              </p>
              <ul class="space-y-1.5">
                <li
                    v-for="(a, i) in item.achievements"
                    :key="i"
                    class="flex items-start gap-2 text-gray-700 text-xs sm:text-sm"
                >
                  <span class="text-green-500 mt-0.5">✓</span>
                  <span>{{ a }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
          <span
              v-for="(tag, t) in item.tags"
              :key="t"
              class="px-2 py-1 rounded-full bg-white border border-gray-300 text-xs"
          >
            {{ tag }}
          </span>
            </div>

          </div>
        </div>
      </div>
    </div>


    <!-- Summary -->
    <div
        class="mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <div class="bg-green-600 p-2 sm:p-3 rounded-lg">
          <Briefcase class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        <div class="flex-1">
          <h3 class="text-gray-900 mb-3 text-sm sm:text-base font-medium">
            Umumiy Karyera yo'li
          </h3>

          <div class="grid grid-cols-3 text-center gap-2 sm:gap-4">
            <div class="text-start">
              <p class="text-xs text-gray-600">Umumiy Tajriba</p>
              <p class="font-medium text-sm sm:text-base text-gray-900">
                {{ props.data?.careerPathSummary?.experience_total || 0 }}
              </p>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600">Kompaniyalari</p>
              <p class="font-medium text-sm sm:text-base text-gray-900">
                {{ props.data?.careerPathSummary?.companies }}
              </p>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600">O'sish</p>
              <p class="font-medium text-sm sm:text-base text-green-700">
                {{ props.data?.roadmap?.forecast?.probability }} %
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Briefcase, Calendar } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
});

// --- DYNAMIC TIMELINE ---
// Backenddagi careerPath → UI timeline format
const timeline = computed(() => {
  if (!props.data || !props.data.careerPath) return [];

  return props.data.careerPath.map((item, index, arr) => {
    const isCurrent =
        item.period.toLowerCase().includes("present") || index === arr.length - 1;

    return {
      title: item.position,
      company: item.company,
      date: item.period,
      duration: item.experience,
      description: item.description,
      achievements: item.achievements,
      tags: item.tech_stack,
      current: isCurrent
    };
  });
});
</script>


