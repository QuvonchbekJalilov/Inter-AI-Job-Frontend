<template>
  <section class="grid lg:grid-cols-3 gap-6 sm:gap-8">

    <div class="lg:col-span-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl p-5 sm:p-8 shadow-lg">

      <div class="flex items-center gap-3 mb-6">
        <div class="bg-white/20 p-3 rounded-lg">
          <Target class="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl font-medium">Maqsadli pozitsiya</h2>
          <p class="text-blue-100 text-xs sm:text-sm">9–12 oy ichida erishiladigan maqsad</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">

        <div class="info-box">
          <Briefcase class="icon" />
          <p class="label">Lavozim</p>
          <p class="value">{{ props.data?.targetPosition?.title }}</p>
          <p class="subvalue">yoki {{ props.data?.targetPosition?.alternative }}</p>
        </div>

        <div class="info-box">
          <DollarSign class="icon" />
          <p class="label">Maosh</p>
          <p class="value">{{ props.data.targetPosition?.salary }}</p>
<!--          <p class="subvalue">Masofaviy</p>-->
        </div>

        <div class="info-box">
          <MapPin class="icon" />
          <p class="label">Ish formati</p>
          <p class="value">{{ props.data?.targetPosition?.role_note }}</p>
          <p class="subvalue">Xalqaro</p>
        </div>

        <div class="info-box">
          <Users class="icon" />
          <p class="label">Jamoa</p>
          <p class="value">{{ props.data?.targetPosition?.team_size }} kishi</p>
          <p class="subvalue">Boshqaruv</p>
        </div>

      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-5 border border-white/20">
        <div class="flex items-center gap-2 mb-3">
          <Code class="w-5 h-5 text-white" />
          <h3 class="text-sm sm:text-base font-medium">Texnik stek</h3>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
              v-for="(tech, i) in props.data?.targetPosition?.tech_stack"
              :key="i"
              class="px-2 py-1 bg-white/20 text-white rounded-full text-xs"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">

      <div class="mb-6">
        <h3 class="text-gray-900 text-lg sm:text-xl font-medium mb-1">Tayyorlik darajasi</h3>
        <p class="text-gray-600 text-xs sm:text-sm">Ko‘nikmalar farqi tahlili</p>
      </div>

      <div class="space-y-5">
        <div v-for="req in  props.data?.gapAnalysis?.skills" :key="req.skill">

          <div class="flex items-center justify-between mb-1">
            <span class="text-gray-700 text-xs sm:text-sm">{{ req.name }}</span>
            <span class="text-gray-500 text-xs sm:text-sm">{{ req.current }}%</span>
          </div>

          <div class="relative h-2 rounded-full bg-gray-200 overflow-hidden">

            <div
                class="absolute h-full bg-gray-300 rounded-full"
                :style="{ width: req.target + '%' }"
            ></div>

            <div
                class="absolute h-full bg-blue-500 rounded-full"
                :style="{ width: req.current + '%' }"
            ></div>
          </div>

          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-gray-500">Maqsad: {{ req.target }}%</span>

            <span
                v-if="req.gap > 0"
                :class="[
                'text-xs font-medium',
                req.gap > 30
                  ? 'text-red-600'
                  : req.gap > 15
                  ? 'text-orange-600'
                  : 'text-green-600'
              ]"
            >
              Farq: {{ req.gap }}%
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-5 border-t border-gray-200">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">

          <div class="flex items-center gap-2 mb-2">
            <TrendingUp class="w-5 h-5 text-green-600" />
            <span class="text-gray-700 text-sm">Umumiy tayyorlik</span>
          </div>

          <div class="flex items-end gap-2">
            <p class="text-3xl text-gray-900">{{ props.data?.gapAnalysis?.overall_readiness?.value }}%</p>
            <span class="text-green-600 text-xs mb-1">↗ O‘sishda</span>
          </div>

          <p class="text-xs text-gray-600 mt-2">
            {{ props.data?.gapAnalysis?.overall_readiness?.comment }}
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Target, DollarSign, MapPin, Briefcase, Users, Code, TrendingUp } from "lucide-vue-next";

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.info-box {
  @apply bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-white;
}
.info-box .icon {
  @apply w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3;
}
.info-box .label {
  @apply text-blue-100 text-xs mb-0.5;
}
.info-box .value {
  @apply text-white text-base sm:text-xl mb-1 font-medium;
}
.info-box .subvalue {
  @apply text-blue-100 text-xs;
}
</style>
