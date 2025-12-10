<template>
  <div class="fixed top-[84px] left-0 w-full bg-white border-b border-gray-200 z-20 rounded-2xl">
    <div class="max-w-7xl mx-auto px-4 py-2 border-radius">
      <div class="max-w-3xl mx-auto">
        <!-- Top: Topshirilgan / Interview / Otkaz statistikasi -->
        <div class="bg-white rounded-2xl py-4 flex justify-around shadow-top divide-x mt-3">
          <!-- Topshirilgan -->
          <button
            type="button"
            class="flex-1 text-center px-2 focus:outline-none"
            @click="onStatusClick('newsVacancy')"
          >
            <div class="flex items-center justify-center gap-1 text-sm text-gray-500 mb-1">
              <span>{{ translations.responses }}</span>
              <span
                v-if="getNotificationCount('newsVacancy') > 0"
                class="notification-badge inline-flex min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold items-center justify-center -mt-4"
              >
                {{ Math.min(getNotificationCount('newsVacancy'), 99) }}
              </span>
            </div>
            <div class="text-blue-600 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
              <span v-else>{{ statistics.applied }}</span>
            </div>
          </button>

          <!-- Interview -->
          <button
            type="button"
            class="flex-1 text-center px-2 focus:outline-none"
            @click="onStatusClick('interview')"
          >
            <div class="flex items-center justify-center gap-1 text-sm text-gray-500 mb-1">
              <span>{{ translations.interview }}</span>
              <span
                v-if="getNotificationCount('interview') > 0"
                class="notification-badge inline-flex min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold items-center justify-center -mt-4"
              >
                {{ Math.min(getNotificationCount('interview'), 99) }}
              </span>
            </div>
            <div class="text-blue-600 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
              <span v-else>{{ statistics.interview }}</span>
            </div>
          </button>

          <!-- Otkaz -->
          <button
            type="button"
            class="flex-1 text-center px-2 focus:outline-none"
            @click="onStatusClick('rejected')"
          >
            <div class="flex items-center justify-center gap-1 text-sm text-gray-500 mb-1">
              <span>{{ translations.rejected }}</span>
              <span
                v-if="getNotificationCount('rejected') > 0"
                class="notification-badge inline-flex min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold items-center justify-center -mt-4"
              >
                {{ Math.min(getNotificationCount('rejected'), 99) }}
              </span>
            </div>
            <div class="text-red-500 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
              <!-- Hozircha backenddan alohida otkaz soni kelmagani uchun 0 yoki applied bilan bir xil bo'lishi mumkin -->
              <span v-else>{{ statistics.rejected ?? 0 }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Pastki filter: ALL / HeadHunter / Telegram -->
      <div class="flex items-stretch mt-3 w-full max-w-md mx-auto gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn relative overflow-visible min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap text-ellipsis flex items-center justify-center gap-1"
          :class="tab.active
            ? 'bg-blue-600 text-white scale-100 py-2.5'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'"
          :style="{ flexGrow: tab.active ? 2 : 1 }"
          @click="onFilterClick(tab)"
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
import { getCurrentInstance, onMounted, ref, watch } from "vue"
import axios from "axios"

const { proxy } = getCurrentInstance()
const { translations } = useI18n()

const props = defineProps({
  tabs: Array,
  activeTab: String
})

const emit = defineEmits(["change-tab", "change-filter"])

const statistics = ref({
  total_result: 0,
  applied: 0,
  interview: 0
})

const loading = ref(true)

const notificationCounts = ref({
  responses: 0,
  interviews: 0,
  rejections: 0,
})

const TAB_NOTIFICATION_MAP = {
  newsVacancy: { field: "responses", type: "application" },
  interview: { field: "interviews", type: "responce" },
  rejected: { field: "rejections", type: "rejection" },
}

const getNotificationCount = (key) => {
  const map = TAB_NOTIFICATION_MAP[key]
  if (!map) return 0
  return notificationCounts.value[map.field] || 0
}

const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) return

    const { data } = await axios.get(`${proxy.$locale}/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    notificationCounts.value.responses = Number(data?.application_notification) || 0
    notificationCounts.value.interviews =
        Number(data?.responce_notification ?? data?.response_notification) || 0
    notificationCounts.value.rejections = Number(data?.rejection_notification) || 0
  } catch (error) {
    console.error("❌ Notifications fetch error:", error.response?.data || error.message)
  }
}

const fetchRejectionStats = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) return

    const { data } = await axios.get(`${proxy.$locale}/v1/rejections`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (data?.success && Array.isArray(data.data)) {
      const count = data.data.length
      statistics.value = {
        ...statistics.value,
        rejected: count,
      }

      if (!notificationCounts.value.rejections) {
        notificationCounts.value.rejections = count
      }
    }
  } catch (error) {
    console.error("❌ Rejection stats fetch error:", error.response?.data || error.message)
  }
}

const markNotificationsAsRead = async (key) => {
  const map = TAB_NOTIFICATION_MAP[key]
  if (!map) return

  // Backendda type yo'q bo'lgan holatlarda (masalan, rejected) hech narsa qilmaymiz
  if (!map.type) return

  const currentCount = notificationCounts.value[map.field]
  if (!currentCount || currentCount <= 0) return

  notificationCounts.value[map.field] = 0

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) return

    await axios.post(
        `${proxy.$locale}/v1/notifications/read`,
        { type: map.type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
    )
  } catch (error) {
    console.error("❌ Notifications read error:", error.response?.data || error.message)
    notificationCounts.value[map.field] = currentCount
  }
}

const onStatusClick = (statusKey) => {
  emit("change-tab", statusKey)
}

const onFilterClick = (tab) => {
  emit("change-filter", tab.key)
}

watch(
    () => props.activeTab,
    (newTab) => {
      markNotificationsAsRead(newTab)
    }
)

onMounted(() => {
  //console.log("⏳ 5 soniya kutilyapti...")

  setTimeout(async () => {
    //console.log("🚀 Serverga so‘rov yuborilmoqda...")

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const res = await axios.get(proxy.$locale + "/v1/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })

      statistics.value = res.data || {}
    } catch (e) {
      console.error("❌ Statistika yuklanmadi:", e)
    } finally {
      loading.value = false
    }
  }, 2000)

  fetchNotifications()
  fetchRejectionStats()
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


/* 🔹 Skeleton animatsiyasi */
.skeleton {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
</style>
