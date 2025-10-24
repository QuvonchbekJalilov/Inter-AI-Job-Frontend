<template>
<div class="fixed top-[84px] left-0 w-full bg-white border-b border-gray-200 z-20 rounded-2xl">
    <div class="max-w-7xl mx-auto px-4 py-2 border-radius">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl py-4 flex justify-around shadow-top divide-x mt-3">
          <div class="flex-1 text-center px-2">
            <div class="text-blue-600 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
              <span v-else>{{ statistics.total_result }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ translations.vacancies }}</div>
          </div>

          <div class="flex-1 text-center px-2">
            <div class="text-blue-600 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
              <span v-else>{{ statistics.applied }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ translations.responses }}</div>
          </div>

          <div class="flex-1 text-center px-2">
            <div class="text-indigo-600 text-2xl font-medium min-h-[28px] flex justify-center">
              <div v-if="loading" class="skeleton w-12 h-6 rounded-md"></div>
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
            class="tab-btn relative overflow-visible min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap text-ellipsis flex items-center justify-center gap-1"
            :class="tab.active
            ? 'bg-blue-600 text-white scale-100 py-2.5'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'"
            :style="{ flexGrow: tab.active ? 2 : 1 }"
            @click="onTabClick(tab)"
        >
          <span
              class="tab-label inline-block leading-tight px-0.5 sm:px-1"
              :class="tab.active
              ? 'text-[13.5px] sm:text-[14px] scale-100'
              : 'text-[11.5px] sm:text-[12px] scale-90'"
          >
            {{ tab.name }}
          </span>
          <span
              v-if="getNotificationCount(tab.key) > 0"
              class="notification-badge absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-semibold flex items-center justify-center"
          >
            {{ Math.min(getNotificationCount(tab.key), 99) }}
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

const emit = defineEmits(["change-tab"])

const statistics = ref({
  total_result: 0,
  applied: 0,
  interview: 0
})

const loading = ref(true)

const notificationCounts = ref({
  responses: 0,
  interviews: 0,
})

const TAB_NOTIFICATION_MAP = {
  newsVacancy: { field: "responses", type: "application" },
  interview: { field: "interviews", type: "responce" },
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

    const { data } = await axios.get(`${proxy.$locale}/auth/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    notificationCounts.value.responses = Number(data?.application_notification) || 0
    notificationCounts.value.interviews = Number(data?.responce_notification) || 0
  } catch (error) {
    console.error("❌ Notifications fetch error:", error.response?.data || error.message)
  }
}

const markNotificationsAsRead = async (key) => {
  const map = TAB_NOTIFICATION_MAP[key]
  if (!map) return

  const currentCount = notificationCounts.value[map.field]
  if (!currentCount || currentCount <= 0) return

  notificationCounts.value[map.field] = 0

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) return

    await axios.post(
        `${proxy.$locale}/auth/notifications/read`,
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

const onTabClick = (tab) => {
  emit("change-tab", tab.key)
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

      statistics.value = res.data
    } catch (e) {
      console.error("❌ Statistika yuklanmadi:", e)
    } finally {
      loading.value = false
    }
  }, 2000)

  fetchNotifications()
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
