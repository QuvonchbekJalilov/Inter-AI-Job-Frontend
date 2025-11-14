<template>
  <section class="grid lg:grid-cols-2 gap-6 sm:gap-8">

    <!-- SILLIKU STRONG SIDES -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-md space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="bg-green-500 p-2 rounded-lg">
          <Star class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl text-gray-900"> Kuchli tomonlar</h2>
          <p class="text-sm text-gray-600">Sizning asosiy ustunliklaringiz</p>
        </div>
      </div>

      <!-- Dynamic Items -->
      <div class="space-y-4">
        <StrengthItem
          v-for="(s, i) in strengths"
          :key="i"
          :title="s.title"
          :description="s.description"
          :impact="s.impact"
        />
      </div>

      <!-- OVERALL EVALUATION -->
      <div class="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-600 rounded-xl text-white shadow-lg">
        <div class="flex items-center gap-2 mb-1">
          <TrendingUp class="w-5 h-5" />
          <span class="text-sm opacity-90">{{ overall.title }}</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-medium">{{ overall.comment }}</h3>
      </div>
    </div>

    <!-- GROWTH ZONES -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-md space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="bg-orange-500 p-2 rounded-lg">
          <AlertCircle class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl text-gray-900"> O‘sish zonalari</h2>
          <p class="text-sm text-gray-600">Senior bosqichiga chiqish uchun fokus</p>
        </div>
      </div>

      <!-- Dynamic Growth Items -->
      <div class="space-y-4">
        <GrowthItem
          v-for="(g, i) in growth_zones"
          :key="i"
          :title="g.title"
          :description="g.description"
          :priority="g.priority"
          :time="g.duration"
        />
      </div>

      <!-- ACTION PLAN -->
      <div class="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg">
        <div class="flex items-center gap-2 mb-1">
          <Target class="w-5 h-5" />
          <span class="text-sm opacity-90">Harakat rejasi</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-medium">
          {{ action.duration }} davomida
        </h3>
        <p class="text-sm opacity-90">
          {{ action.focus }}
        </p>
      </div>

    </div>

  </section>
</template>


<script setup>
import { Star, AlertCircle, TrendingUp, Target } from "lucide-vue-next";
import StrengthItem from "./StrengthCard.vue";
import GrowthItem from "./GrowthCard.vue";
import { computed } from "vue";

const props = defineProps({
  data: Object
});

// root obyekt — computed bo‘lishi shart
const root = computed(() => props.data?.StrenghtsAndGrowth || {});

// Kuchli tomonlar
const strengths = computed(() => root.value.strengths || []);

// O‘sish zonalari
const growth_zones = computed(() => root.value.growth_zones || []);

// Umumiy baho
const overall = computed(() => root.value.overall_evaluation || {
  title: "",
  comment: ""
});

// Harakat rejasi
const action = computed(() => root.value.action_plan || {
  duration: "",
  focus: ""
});
</script>


