<template>
  <section class="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white overflow-hidden">

    <!-- Decorative blurred circles -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

      <!-- Logo -->
      <div class="mb-6 sm:mb-12">
        <img src="@/assets/Logo.svg" alt="inter-AI" class="h-7 sm:h-10 brightness-0 invert" />
      </div>

      <div class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">

        <!-- LEFT SIDE -->
        <div>
          <!-- Badge -->
          <div class="flex items-center gap-2 mb-4">
            <span class="text-yellow-300">⚡</span>
            <span class="bg-white/20 text-white border-0 rounded-full text-xs sm:text-sm px-3 py-1.5">
              2025 yilgi kasbiy diagnostika
            </span>
          </div>

          <!-- Name -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-4">
            {{ props.data.general?.name || 'N/A'}}
          </h1>

          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="bg-blue-400/30 text-white border-blue-300 text-sm px-4 py-1.5 rounded-full">
              {{ props.data.general?.position || 'Vue.js Frontend Developer' }}
            </span>
            <span class="bg-purple-400/30 text-white border-purple-300 text-sm px-4 py-1.5 rounded-full">
              {{ props.data.diagnostics?.level.level || 'Middle + уровень' }}
            </span>
          </div>
          

          <!-- Experience + Location -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="bg-white/20 p-2 rounded-lg">
                🎓
              </div>
              <div>
                <p class="text-blue-100 text-xs sm:text-sm">Ish tajribasi</p>
                <p class="text-white text-sm sm:text-base">{{ props.data?.general?.experience_years || "test" }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="bg-white/20 p-2 rounded-lg">
                📍
              </div>
              <div>
                <p class="text-blue-100 text-xs sm:text-sm">Joylashuv</p>
                <p class="text-white text-sm sm:text-base">{{ props.data.general?.city || 'Ташкент' }}</p>
              </div>
            </div>
          </div>

          <!-- Email + Languages -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 text-sm">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-full sm:w-auto">
              ✉️ <span>{{ props.data.general?.email || 'sh.pulatov@email.com' }}</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-full sm:w-auto">
              🌐 <span v-for="lang in props.data.general?.languages">{{ lang || 'Узбекский •  English B2 •  Русский A2' }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE CARDS -->
        <div class="grid grid-cols-2 gap-4 sm:gap-6">

          <div class="metric-card">
            <div class="metric-value">{{ props.data.topMetrics?.hard_skills_score || " " }}%</div>
            <p class="metric-title">Hard Skills</p>
            <p class="metric-sub">100 foizdan</p>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ props.data.topMetrics?.senior_ready_percent || " " }}%</div>
            <p class="metric-title">Senior</p>
            <p class="metric-sub">tayyorgarlik</p>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ props.data.topMetrics?.potential_score || " " }}%</div>
            <p class="metric-title">Potensial</p>
            <p class="metric-sub">100 foizdan</p>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ props.data.topMetrics?.projects_in_production || 0 }}+</div>
            <p class="metric-title">Loyihalar</p>
            <p class="metric-sub">produksiyaga chiqarilgan</p>
          </div>
        </div>
      </div>

    </div>
  </section>
  <!-- <section>
    <pre>{{ props.data.profileStatistics }}</pre>
  </section> -->
</template>
<script setup>

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})


</script>

<style scoped>
.metric-card {
  @apply bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-5 sm:p-7 flex flex-col;
}

.metric-value {
  @apply text-4xl sm:text-6xl font-medium mb-2;
}

.metric-title {
  @apply text-blue-100 text-sm sm:text-base;
}

.metric-sub {
  @apply text-blue-200 text-xs sm:text-sm mt-1;
}
</style>
