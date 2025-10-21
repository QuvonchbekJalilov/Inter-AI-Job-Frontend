<template>
  <div class="min-h-screen pt-[225px] bg-[#f2f2f2] text-gray-900">
    <div class="gap-10">
      <StaticsSection
          :tabs="tabs"
          :active-tab="activeTab"
          @change-tab="setActiveTab"
      />

      <main class="space-y-6 mt-6">

        <template v-if="activeTab === 'vacancies'">
          <VacancyCard
              title="Junior/Middle Frontend Разработчик (VueJS) - удаленки НЕТ"
              company="ООО MICROS24"
              location="Ташкент, Яшнабадский район, улица Махтумкули, 178/1"
              experience="Опыт 1-3 года"
          />
        </template>

        <template v-else-if="activeTab === 'newsVacancy'">
          <ResponsesVacancyCard
              title="Back end разработчик"
              company="Inter-AI"
              date="15 декабря 2025 в 14:00"
              :questions="[
              'Расскажите о своем опыте работы с React',
              'Как вы оптимизируете производительность веб-приложений?',
              'Опыт работы с TypeScript?',
              'Как вы тестируете свой код?'
            ]"
          />
        </template>

        <template v-else-if="activeTab === 'interview'">
          <InterviewCard
              title="Frontend разработчик"
              company="TechStart"
              date="15 декабря 2024 в 14:00"
              :questions="[
                'Расскажите о своем опыте работы с React',
                'Как вы оптимизируете производительность веб-приложений?',
                'Опыт работы с TypeScript?',
                'Как вы тестируете свой код?'
              ]"
          />
        </template>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/i18n-lite'
import VacancyCard from './VacancyCard.vue'
import InterviewCard from './InterviewCard.vue'
import StaticsSection from './StaticsSection.vue'
import ResponsesVacancyCard from "@/components/ResponsesVacancyCard.vue";

const activeTab = ref('vacancies')

const { t } = useI18n()
const isNarrow = ref(false)
const updateNarrow = () => { isNarrow.value = window.innerWidth < 400 }
onMounted(() => { updateNarrow(); window.addEventListener('resize', updateNarrow) })
onBeforeUnmount(() => window.removeEventListener('resize', updateNarrow))

const counts = reactive({
  vacancies: 5,
  newsVacancy: 6,
  interview: 7,
})

const tabs = computed(() => [
  { name: t('vacancies', { count: counts.vacancies }), key: 'vacancies', active: activeTab.value === 'vacancies' },
  { name: t('responses', { count: counts.newsVacancy }), key: 'newsVacancy', active: activeTab.value === 'newsVacancy' },
  { name: t('interview', { count: counts.interview }), key: 'interview', active: activeTab.value === 'interview' },
])

const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
}
</script>
