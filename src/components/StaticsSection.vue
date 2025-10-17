<template>
  <div class="fixed top-[84px] left-0 w-full bg-white border-b border-gray-200 z-20 rounded-2xl">
    <div class="max-w-7xl mx-auto px-4 py-2 border-radius">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl py-4 flex justify-around shadow-top divide-x mt-3">
          <div class="flex-1 text-center px-2">
            <div class="text-blue-600 text-2xl font-medium min-h-[28px]">
              <span v-if="loading" class="loading-dots"></span>
              <span v-else>{{ statistics.total_result }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ translations.vacancies }}</div>
          </div>

          <div class="flex-1 text-center px-2">
            <div class="text-blue-600 text-2xl font-medium min-h-[28px]">
              <span v-if="loading" class="loading-dots"></span>
              <span v-else>{{ statistics.applied }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ translations.responses }}</div>
          </div>

          <div class="flex-1 text-center px-2">
            <div class="text-indigo-600 text-2xl font-medium min-h-[28px]">
              <span v-if="loading" class="loading-dots"></span>
              <span v-else>{{ statistics.interview }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ translations.interview }}</div>
          </div>
        </div>
      </div>

      <div class="flex items-stretch mt-3 w-full max-w-md mx-auto gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
          :class="tab.active
            ? 'bg-blue-600 text-white scale-100 py-2.5'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'"
          :style="{ flexGrow: tab.active ? 2 : 1 }"
          @click="$emit('change-tab', tab.key)"
        >
          <span
            class="tab-label inline-block leading-tight px-0.5 sm:px-1"
            :class="tab.active
              ? 'text-[13.5px] sm:text-[14px] scale-100'
              : 'text-[11.5px] sm:text-[12px] scale-90'"
          >
            {{ tab.name }}
          </span>

        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
import { getCurrentInstance, onMounted, ref } from "vue"
import axios from "axios"

const { proxy } = getCurrentInstance()
const { translations } = useI18n()

defineProps({
  tabs: Array,
  activeTab: String
})

const statistics = ref({
  total_result: 0,
  applied: 0,
  interview: 0
})

const loading = ref(true)
const CACHE_KEY = "dashboard_cache"
const CACHE_TIME_KEY = "dashboard_cache_time"
const CACHE_DURATION = 60 * 60 * 1000

onMounted(async () => {
  const now = Date.now()
  const cacheData = localStorage.getItem(CACHE_KEY)
  const cacheTime = localStorage.getItem(CACHE_TIME_KEY)

  if (cacheData && cacheTime && now - parseInt(cacheTime) < CACHE_DURATION) {
    statistics.value = JSON.parse(cacheData)
    loading.value = false
    console.log("⚡ Statistika cache'dan yuklandi")
    return
  }

  console.log("⏳ Serverdan statistika yuklanmoqda...")

  setTimeout(async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const res = await axios.get(proxy.$locale + "/v1/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })

      statistics.value = res.data
      loading.value = false

      localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
      localStorage.setItem(CACHE_TIME_KEY, now.toString())

      console.log("✅ Statistika serverdan yuklandi va cache'landi")
    } catch (e) {
      loading.value = false
      console.error("❌ Statistika yuklanmadi:", e)
    }
  }, 8000)
})
</script>


<style scoped>
.shadow-top {
  box-shadow:
      0 -2px 3px -1px rgba(0, 0, 0, 0.08),
      0 -2px 4px -2px rgba(0, 0, 0, 0.05),

      0 4px 6px -1px rgba(0, 0, 0, 0.15),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  transition: flex-grow 260ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
              background-color 160ms ease,
              color 160ms ease,
              padding 160ms ease;
}

.tab-label {
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
              font-size 160ms ease,
              line-height 160ms ease;
}
.loading-dots::after {
  content: '...';
  animation: dots 1.5s steps(4, end) infinite;
}
@keyframes dots {
  0%, 30% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style>
