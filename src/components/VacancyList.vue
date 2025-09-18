<template>
  <div class="min-h-screen pt-[225px] bg-[#f7f8fa] text-gray-900">
    <div class="gap-10">
      <!-- Statistika va tablar -->
      <StaticsSection
          :tabs="tabs"
          :active-tab="activeTab"
          @change-tab="setActiveTab"
      />

      <!-- Content -->
      <main class="space-y-6 mt-6">
        <template v-if="activeTab === 'vacancies'">
          <VacancyCard
              title="Junior/Middle Frontend Разработчик (VueJS) - удаленки НЕТ"
              company="ООО MICROS24"
              location="Ташкент, Яшнабадский район, улица Махтумкули, 178/1"
              experience="Опыт 1-3 года"
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
        <template v-else-if="activeTab === 'newsVacancy'">
          <NewsVacancyCard
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VacancyCard from './VacancyCard.vue'
import InterviewCard from './InterviewCard.vue'
import StaticsSection from './StaticsSection.vue'
import NewsVacancyCard from "@/components/NewsVacancyCard.vue";

const activeTab = ref('vacancies')

const tabs = ref([
  { name: "Все", key: "vacancies", active: true },
  { name: "Новые", key: "newsVacancy", active: false },
  { name: "Назначенные", key: "interview", active: false },
])

const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
  tabs.value.forEach(tab => tab.active = (tab.key === tabKey))
}
</script>
