<template>
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Радар навыков -->
    <div class="bg-white rounded-3xl shadow-lg px-6 py-6 space-y-4 border border-slate-100">
      <h3 class="text-xl font-semibold flex items-center gap-2">
        Radar ko‘nikmalar
      </h3>
      <p class="text-sm text-slate-500">
        Asosiy kompetensiyalarning vizual tahlili
      </p>

      <div class="flex items-center justify-center py-4 relative">
        <svg viewBox="-40 -40 280 280" class="w-72 overflow-visible">

          <!-- Gradient definition -->
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.25"/>
            </radialGradient>
          </defs>

          <!-- GRID (background levels) -->
          <g v-for="(layer, li) in radar.grid" :key="'g'+li">
            <polygon :points="layer"
              class="fill-transparent stroke-slate-300"
              stroke-width="0.6"
              opacity="0.7"
            />
          </g>

          <!-- Filled radar polygon -->
          <polygon
            :points="radar.polygon"
            fill="url(#radarFill)"
            stroke="#0284c7"
            stroke-width="2"
            stroke-linejoin="round"
            class="transition-all duration-300"
          />

          <!-- Animated dots -->
          <circle
            v-for="(pt, i) in radar.points"
            :key="'p'+i"
            :cx="pt.x"
            :cy="pt.y"
            r="5"
            class="fill-sky-600 cursor-pointer animate-ping-slow"
            @mouseenter="hovered = pt"
            @mouseleave="hovered = null"
          />

          <!-- Label texts -->
          <text
            v-for="(lbl, i) in radar.labels"
            :key="'lbl'+i"
            :x="lbl.x"
            :y="lbl.y"
            text-anchor="middle"
            class="text-[11px] fill-slate-700 font-medium pointer-events-none select-none"
          >
            {{ lbl.name }}
          </text>

        </svg>

        <!-- Tooltip -->
        <div
          v-if="hovered"
          class="absolute bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg"
          :style="{ left: hovered.x + 110 + 'px', top: hovered.y + 40 + 'px' }"
        >
          <!-- <p class="font-semibold">{{ hovered.name }}</p> -->
          <p>{{ hovered.score }}%</p>
        </div>

      </div>

      <div class="bg-blue-50 rounded-2xl px-4 py-3 text-sm text-slate-700">
        <span class="font-medium">Tavsiya:</span>
        {{ props.data.skillsRadar?.advice }}
      </div>
    </div>


    <!-- Детальная оценка -->
    <div class="bg-white rounded-3xl shadow-md px-6 py-6 space-y-4 border border-slate-100">
      <h3 class="text-lg font-medium flex items-center gap-2">
        Batafsil ko‘nikmalar bahosi
      </h3>
      <p class="text-sm text-slate-500">
        10 ballik tizim bo‘yicha baholash
      </p>

      <!-- Dynamic Skill Bars -->
      <div class="space-y-3">
        <SkillBar
          v-for="(skill, i) in detailedSkills.items"
          :key="i"
          :label="skill.name"
          :note="skill.level"
          :score="Number(skill.score) / 10"
        />
      </div>

      <!-- Summary boxes -->
      <div class="flex flex-wrap gap-3 pt-3">

        <!-- Average Score -->
        <div class="flex-1 min-w-[130px] bg-emerald-50 rounded-2xl px-4 py-3">
          <p class="text-xs text-emerald-700">O‘rtacha ball</p>
          <p class="font-medium text-lg text-emerald-900">
            {{ (Number(detailedSkills.average_score) / 10).toFixed(1) }} / 10
          </p>
        </div>

        <!-- Senior Progress -->
        <div class="flex-1 min-w-[130px] bg-sky-50 rounded-2xl px-4 py-3">
          <p class="text-xs text-sky-700">Senior darajaga progress</p>
          <p class="font-medium text-lg text-sky-900">
            {{ detailedSkills.senior_progress_percent }}%
          </p>
        </div>

      </div>

      <!-- Description -->
      <div class="bg-blue-50 rounded-2xl px-4 py-3 text-sm text-slate-700">
        <span class="font-medium">Tavsiyalar:</span>
        {{ detailedSkills.senior_progress }}
      </div>
    </div>



    <!-- Strengths / Growth zones (full width under them) -->
    <div class="lg:col-span-2">
      <StrengthsGrowth :data="props.data" />
    </div>
  </section>
</template>

<script setup>
import StrengthsGrowth from './StrengthsGrowth.vue'
import { computed, ref } from 'vue'
import SkillBar from "@/components/career/SkillBar.vue";

const maxScore = 10

const props = defineProps({
  data: Object
})
const hovered = ref(null)

/* Prepare skills */
const visualSkills = computed(() => {
  const list = props.data?.skillsRadar?.competencies || {}
  return Object.entries(list).map(([name, score]) => ({
    name,
    score: Number(score)
  }))
})
const detailedSkills = computed(() => props.data?.detailedSkills || {});

/* Build radar geometry */
const radar = computed(() => {
  const items = visualSkills.value
  const count = items.length
  if (!count) return { grid: [], polygon: "", labels: [], points: [] }

  const center = 100
  const radius = 90
  const levels = [25, 50, 75, 100]

  /* Background layers */
  const grid = levels.map(level =>
    items.map((_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI/2
      const r = (radius * level) / 100
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
    }).join(" ")
  )

  /* Point coordinates */
  const points = items.map((skill, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI/2
    const r = (radius * skill.score) / 100
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      score: skill.score,
      name: skill.name
    }
  })

  const polygon = points.map(p => `${p.x},${p.y}`).join(" ")

  /* Label positions with perfect auto-align */
  const labels = items.map((s, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI/2
    const r = radius + 26

    let x = center + r * Math.cos(angle)
    let y = center + r * Math.sin(angle)

    if (angle > -Math.PI/2 && angle < Math.PI/2) x += 16
    if (angle < -Math.PI/2 || angle > Math.PI/2) x -= 16
    if (Math.abs(angle + Math.PI/2) < 0.3) y -= 10
    if (Math.abs(angle - Math.PI/2) < 0.3) y += 10

    return { name: s.name, x, y }
  })

  return { grid, polygon, labels, points }
})



const calcWidth = (score) => `${(score / maxScore) * 100}%`
</script>

<style scoped></style>
