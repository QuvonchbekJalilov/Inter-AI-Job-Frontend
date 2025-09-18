<template>
  <div class="min-h-screen bg-gray-50">
    <Header></Header>
<!--    <StaticsSection></StaticsSection>-->
    <div class="max-w-5xl pt-[100px] mx-auto px-6 mt-4">
      <button
          @click="goBack"
          class="flex items-center text-blue-600 font-medium hover:underline"
      >
        <svg
            class="h-5 w-5 mr-1"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
    </div>
    <div class="min-h-screen bg-[#f7f8fa] py-2">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Profil bloki -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <span>👤</span> Мой профиль
          </h2>
          <div class="space-y-2 text-sm text-gray-700">
            <div><span class="font-medium text-gray-500">Имя:</span> Ismoil Usmonov</div>
            <div><span class="font-medium text-gray-500">Email:</span> ismoil_007u@gmail.com</div>
            <div><span class="font-medium text-gray-500">Телефон:</span> +998919579717</div>
            <div><span class="font-medium text-gray-500">Сфера:</span> IT</div>
            <div><span class="font-medium text-gray-500">Локация:</span> Toshkent</div>
            <div><span class="font-medium text-gray-500">Зарплата:</span> от 1000 ₽ до 2000 ₽</div>
          </div>
        </div>

        <!-- Rezyume -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <span>📄</span> Резюме
          </h2>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              Последнее обновление <br />
              <span class="text-gray-700">3 дня назад</span>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">Активно</span>
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Обновить резюме
          </button>
        </div>

        <!-- AI Автоотклик -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
            ⚡ AI Автоотклик
          </h2>
          <p class="text-sm text-gray-600 mb-3">
            Автоматические отклики — ИИ автоматически откликается на подходящие вакансии
          </p>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>
        </div>

        <!-- Тарифный план -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            💳 Тарифный план
          </h2>
          <div class="mb-3 text-sm text-gray-600 flex justify-between">
            <span>Бесплатные отклики</span>
            <span class="text-green-600 font-medium">73/100</span>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div class="h-2 w-[73%] bg-blue-500"></div>
          </div>
          <p class="text-sm text-gray-500 mb-1">Осталось 73 бесплатных откликов</p>
          <p class="text-sm text-gray-700">
            Дополнительные отклики: <span class="font-semibold">100,000 UZS</span> (100 откликов)
          </p>
        </div>

        <!-- Способы оплаты -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            💰 Способы оплаты
          </h2>
          <div class="text-center text-sm text-gray-500 mb-4">
            Способы оплаты не добавлены
          </div>
          <div class="space-y-3">
            <button
                class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Привязать карту
            </button>
            <button
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Купить 100 откликов
            </button>
          </div>
        </div>

        <!-- Redakt qilish -->
        <div class="text-center">
          <button
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            ⚙️ Редактировать профиль
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Hozircha statik, keyin API bilan bog'laymiz

import {ref} from "vue";
import Header from "@/components/Header.vue";
import StaticsSection from "@/components/StaticsSection.vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const goBack = () => router.back()

const tabs = ref([
  { name: 'Vacancies', active: false },
  { name: 'Interview', active: false },
  { name: 'Profile', active: true },
])

const setActiveTab = (tabName) => {
  tabs.value.forEach(tab => {
    tab.active = tab.name === tabName
  })
}
</script>
