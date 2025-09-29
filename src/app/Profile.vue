<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header :user="user" />
    <div class="min-h-screen pt-[90px] bg-[#f7f8fa] py-2 mt-3">
      <div class="max-w-3xl mx-auto space-y-6">

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <div class="flex items-stretch w-full max-w-md mx-auto gap-2 mb-6">
            <button
                v-for="tab in tabs"
                :key="tab.code"
                @click="changeTab(tab.code)"
                class="tab-btn min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
                :class="isActive(tab.code) ? activeClass : inactiveClass"
                :style="{ flexGrow: isActive(tab.code) ? 2 : 1 }"
            >
            <span
                class="tab-label inline-block leading-tight px-0.5 sm:px-1"
                :class="isActive(tab.code) ? activeTextClass : inactiveTextClass"
            >
              {{ tab.name }}
            </span>
            </button>
          </div>
          <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
            <span>👤</span> {{ translations.profiles?.title }}
          </h2>

          <div class="space-y-2 text-sm text-gray-700">
            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.name }}:</span>
              {{ user?.first_name }} {{ user?.last_name }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.email }}:</span>
              {{ user?.email }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.phone }}:</span>
              {{ user?.phone }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.industry }}:</span>
              {{ user?.preferences?.[0]?.industry?.name || '—' }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.location }}:</span>
              {{ user?.locations?.[0]?.text || '—' }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.salary }}:</span>
              {{ translations.profiles?.salary_from }} {{ user?.preferences?.[0]?.desired_salary_from || 0 }} {{ user?.preferences?.[0]?.currency == "USD" ? '$' : 'UZS' }}
              {{ translations.profiles?.salary_to }} {{ user?.preferences?.[0]?.desired_salary_to || 0 }} {{ user?.preferences?.[0]?.currency == "USD" ? '$' : 'UZS' }}
            </div>
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              @click="goToEdit"
          >
            {{ translations.auto_apply?.update_button ?? 'Редактировать' }}
          </button>
          <button
              class="mt-4 w-full px-4 py-2 border border-red-400 rounded-lg text-sm"
              @click="goToHeadHunter"
          >
            {{ 'Head Hunter Auth' }}
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
            <span>📄</span> {{ translations.resumes?.title }}
          </h2>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              {{ translations.resumes?.last_update }} <br />
              <span class="text-gray-700">3 {{ translations.resumes?.days_ago }}</span>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">{{ translations.resumes?.status_active }}</span>
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            {{ translations.resumes?.update_btn }}
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-medium mb-2 flex items-center gap-2 text-black">
            ⚡ {{ translations.auto_apply?.title }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">
            {{ translations.auto_apply?.description }}
          </p>

          <!-- Checkbox -->
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="enabled" class="sr-only peer" />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
        after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>

          <!-- Input va tugma (faqat 1-marta limit o‘rnatish uchun POST) -->
          <div v-if="enabled && !saved" class="mt-4 flex items-center gap-3">
            <input
                type="number"
                v-model.number="limit"
                class="w-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Son kiriting"
            />
            <button
                @click="saveLimit"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:text-gray-500"
                :disabled="!limit"
            >
              {{ translations.auto_apply?.save_button }}
            </button>
          </div>

          <!-- Progress bar + edit qilish -->
          <div v-if="saved" class="mt-6">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>{{ translations.auto_apply?.progress }}</span>
              <span>{{ appliedCount }} / {{ limit }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                  class="h-2 bg-indigo-600 transition-all duration-300"
                  :style="{ width: progressPercent + '%' }"
              ></div>
            </div>

            <!-- Edit tugmasi -->
            <div v-if="!editMode" class="mt-4">
              <button
                  @click="editMode = true"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                ✏️ {{ translations.auto_apply?.edit_button || 'Edit limit' }}
              </button>
            </div>

            <!-- Edit form (PATCH) -->
            <div v-if="editMode" class="mt-4 space-y-3">
              <!-- Input -->
              <input
                  type="number"
                  v-model.number="limit"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <!-- Buttonlar yonma-yon -->
              <div class="flex items-center gap-3">
                <button
                    @click="updateLimit"
                    class="w-48 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:text-gray-500"
                    :disabled="!limit"
                >
                  {{ translations.auto_apply?.update_button || 'Update' }}
                </button>
                <button
                    @click="editMode = false"
                    class="w-48 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  {{ translations.auto_apply?.cancel_button || 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
            💳 {{ translations.plan?.title }}
          </h2>
          <div class="mb-3 text-sm text-gray-600 flex justify-between">
            <span>{{ translations.plan?.free_responses }}</span>
            <span class="text-green-600 font-medium">{{ balance?.balance }} ta</span>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl px-6">
          <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
            💰 {{ translations.payment?.title }}
          </h2>
          <div class="text-start text-sm text-gray-500 mb-4">
            {{ translations.payment?.no_methods }}
          </div>
          <div class="space-y-3">
            <button
                class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              {{ translations.payment?.add_card }}
            </button>
            <button
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {{ translations.payment?.buy_responses }}
            </button>
            <button
                class="mt-2 w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                @click="logout"
            >
              {{ translations.payment?.logout }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, getCurrentInstance} from 'vue'
import axios from 'axios'
import { useI18n } from '@/i18n-lite'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
const { translations } = useI18n()
const { proxy } = getCurrentInstance()

const router = useRouter()
const { locale } = useI18n()

const user = ref(null)
const balance = ref({ balance: 0 })
const loading = ref(true)
const error = ref("")
const clearAuthStorage = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("expires_at")
  localStorage.removeItem("responses_vacancies_cache")
  localStorage.removeItem("vacancies_cache")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("expires_at")
  sessionStorage.removeItem("responses_vacancies_cache")
  sessionStorage.removeItem("vacancies_cache")
  router.push({ name: "login" })
}
const goToHeadHunter = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const { data } = await axios.get(
        proxy.$locale + "/v1/hh-accounts/authorize",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (data?.url) {
      window.open(data.url, "_blank")
    }
  } catch (error) {
    console.error("❌ HH Auth error:", error.response?.data || error.message)
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      router.push({ name: "login" })
      return
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }

    const [meRes, balanceRes] = await Promise.all([
      axios.get(proxy.$locale + "/auth/me", { headers }),
      axios.get(proxy.$locale + "/v1/balance", { headers })
    ])

    user.value = meRes.data.data
    balance.value = balanceRes.data

  } catch (e) {
    error.value = "Foydalanuvchi ma’lumotlarini olishda xatolik."
    if (e.response?.status === 401) {
      clearAuthStorage()
    }
  } finally {
    loading.value = false
  }
})


const tabs = [
  { code: 'uz', name: 'Uzbek' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]

const changeTab = (code) => {
  locale.value = code
}

const isActive = (code) => locale.value === code

const activeClass = 'bg-blue-600 text-white scale-100 py-2.5'
const inactiveClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'
const activeTextClass = 'text-[13.5px] sm:text-[14px] scale-100'
const inactiveTextClass = 'text-[11.5px] sm:text-[12px] scale-90'

const logout = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (token) {
      await axios.post(proxy.$locale + "/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  } catch (e) {
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  } finally {
    clearAuthStorage()
  }
}
const goToEdit = () => {
  router.push({ name: "editProfile", params: { id: user.value.id } })
}

const enabled = ref(false);
const limit = ref(null);
const saved = ref(false);
const appliedCount = ref(0);
const editMode = ref(false); // yangi state edit qilish uchun

const progressPercent = computed(() => {
  if (!limit.value) return 0;
  return Math.min((appliedCount.value / limit.value) * 100, 100);
});

async function saveLimit() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          auto_apply_enabled: enabled.value,
          auto_apply_limit: limit.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );
    saved.value = true;
    appliedCount.value = 0;

    await fetchAutoApplyData();
  } catch (error) {
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  }
}

async function updateLimit() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          auto_apply_enabled: enabled.value,
          auto_apply_limit: limit.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );

    saved.value = true;
    editMode.value = false;

    await fetchAutoApplyData();
  } catch (error) {
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  }
}

async function fetchAutoApplyData() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );

    enabled.value = response.data.data.auto_apply_enabled;
    limit.value = response.data.data.auto_apply_limit;
    appliedCount.value = response.data.data.auto_apply_count;

    saved.value = !!limit.value;
  } catch (error) {
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  }
}

onMounted(() => {
  fetchAutoApplyData();
});
</script>





