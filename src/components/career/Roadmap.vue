<template>
  <section class="p-5 sm:p-8 bg-white rounded-3xl shadow-md border border-slate-200">
    <div class="mb-6 sm:mb-8">
      <h2 class="text-gray-900 mb-1 sm:mb-2 text-lg sm:text-2xl">
        12 oylik yo‘l xaritasi
      </h2>
      <p class="text-gray-600 text-xs sm:text-sm">
        Senior/Lead pog‘onasiga erishish uchun bosqichma-bosqich reja
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4 sm:gap-6">
      <div
          v-for="(phase, index) in roadmap"
          :key="index"
          :class="[
          'rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg bg-gradient-to-br border-2',
          phase.bgColor,
          phase.status === 'next'
            ? 'border-blue-300 shadow-blue-200'
            : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <span
              :class="[
              'px-2 py-1 rounded-md text-white text-xs sm:text-sm bg-gradient-to-r',
              phase.color
            ]"
          >
            {{ phase.period }}
          </span>

          <div v-if="phase.status === 'next'" class="flex items-center gap-1.5 sm:gap-2 text-blue-600 text-xs sm:text-sm">
            <Clock class="w-4 h-4" />
            <span class="hidden sm:inline">Keyingi bosqich</span>
            <span class="sm:hidden">Hozir</span>
          </div>

          <Circle v-else class="w-4 h-4 text-gray-400" />
        </div>

        <h3 class="text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base font-medium">
          {{ phase.title }}
        </h3>

        <div class="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div
              v-for="(goal, g) in phase.goals"
              :key="g"
              class="flex items-start gap-1.5 sm:gap-2"
          >
            <CheckCircle2 class="w-4 h-4 text-gray-400 mt-0.5" />
            <p class="text-gray-700 text-xs sm:text-sm">{{ goal }}</p>
          </div>
        </div>

        <div class="pt-3 sm:pt-4 border-t border-gray-300">
          <p class="text-xs sm:text-sm text-gray-600 mb-0.5">📈 Natija:</p>
          <p class="text-gray-900 text-xs sm:text-sm">{{ phase.outcome }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 sm:mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
      <div class="flex items-center gap-2 sm:gap-3 mb-3">
        <div class="bg-white/20 p-2 rounded-lg flex-shrink-0">
          <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 class="text-sm sm:text-base font-medium">Karyera o‘sish prognozi</h3>
      </div>

      <div class="grid grid-cols-3 gap-3 sm:gap-6">
        <div>
          <p class="text-indigo-100 text-xs mb-1">Joriy pozitsiya</p>
          <p class="text-white text-base sm:text-xs font-medium">
            {{ props.data?.roadmap?.forecast?.current_position }}
          </p>
        </div>
        <div>
          <p class="text-indigo-100 text-xs mb-1">12 oydan keyin</p>
          <p class="text-white text-base sm:text-xs font-medium">
            {{ props.data?.roadmap?.forecast?.expected_after_12_months }}
          </p>
        </div>
        <div>
          <p class="text-indigo-100 text-xs mb-1">Ehtimollik</p>
          <p class="text-white text-base sm:text-xs font-medium">
            {{ props.data?.roadmap?.forecast?.probability }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Clock, ArrowRight, Circle, CheckCircle2 } from "lucide-vue-next";
import {computed} from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const monthPeriods = {
  months_1_3: "Месяцы 1-3",
  months_4_6: "Месяцы 4-6",
  months_7_9: "Месяцы 7-9",
  months_10_12: "Месяцы 10-12"
}

const colors = [
  { color: "from-blue-500 to-blue-600", bg: "from-blue-50 to-blue-100" },
  { color: "from-green-500 to-green-600", bg: "from-green-50 to-green-100" },
  { color: "from-purple-500 to-purple-600", bg: "from-purple-50 to-purple-100" },
  { color: "from-orange-500 to-orange-600", bg: "from-orange-50 to-orange-100" }
]

const roadmap = computed(() => {
  if (!props.data || !props.data.roadmap) return []

  return Object.keys(props.data.roadmap)
      .filter(key => key.startsWith("months_"))
      .map((key, index) => {
        const item = props.data.roadmap[key]

        return {
          period: monthPeriods[key] || key,
          title: item.title,
          goals: item.tasks,
          outcome: item.result,
          status: index === 0 ? "next" : "pending",
          color: colors[index]?.color,
          bgColor: colors[index]?.bg
        }
      })
})
</script>


