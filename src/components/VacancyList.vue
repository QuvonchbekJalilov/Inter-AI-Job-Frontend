<template>
  <div class="min-h-screen pt-[225px] bg-[#f2f2f2] text-gray-900">
    <div class="gap-10">
      <StaticsSection
          :tabs="tabs"
          :active-tab="activeTab"
          @change-tab="setActiveTab"
          @change-filter="setActiveFilter"
      />

      <main class="space-y-6 mt-8">

        <template v-if="activeTab === 'vacancies'">
          <VacancyCard
              :source-filter="activeFilter"
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

        <template v-else-if="activeTab === 'rejected'">
          <RejectedVacancyCard />
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
import RejectedVacancyCard from "@/components/RejectedVacancyCard.vue";

const activeTab = ref('vacancies')

const { t } = useI18n()
const isNarrow = ref(false)
const updateNarrow = () => { isNarrow.value = window.innerWidth < 400 }
const resetTabs = () => {
  activeTab.value = 'vacancies'
  activeFilter.value = 'all'
}
onMounted(() => {
  updateNarrow()
  window.addEventListener('resize', updateNarrow)
  window.addEventListener('interai-home-click', resetTabs)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateNarrow)
  window.removeEventListener('interai-home-click', resetTabs)
})

const activeFilter = ref('all')

const tabs = computed(() => {
  const isVacancies = activeTab.value === 'vacancies'
  return [
    { name: 'ALL', key: 'all', active: isVacancies && activeFilter.value === 'all' },
    { name: 'HeadHunter', key: 'headhunter', active: isVacancies && activeFilter.value === 'headhunter' },
    { name: 'Telegram', key: 'telegram', active: isVacancies && activeFilter.value === 'telegram' },
  ]
})

const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
}

const setActiveFilter = (filterKey) => {
  activeFilter.value = filterKey
  // Filtrlar faqat vakansiyalar ko‘rinishi uchun ishlaydi
  activeTab.value = 'vacancies'
}
</script>
