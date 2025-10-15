<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header :user="user" />
    <div class="min-h-screen pt-[90px] bg-[#f7f8fa] py-2 mt-3">
      <div class="max-w-3xl mx-auto space-y-6">

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <Profile :show="loadingSkeleton" />
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

<!--            <div>-->
<!--              <span class="font-medium text-gray-500">{{ translations.profiles?.email }}:</span>-->
<!--              {{ user?.email }}-->
<!--            </div>-->

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.phone }}:</span>
              {{ user?.phone }}
            </div>

<!--            <div>-->
<!--              <span class="font-medium text-gray-500">{{ translations.profiles?.industry }}:</span>-->
<!--              {{ user?.preferences?.[0]?.industry?.name || '—' }}-->
<!--            </div>-->

<!--            <div>-->
<!--              <span class="font-medium text-gray-500">{{ translations.profiles?.location }}:</span>-->
<!--              {{ user?.locations?.[0]?.text || '—' }}-->
<!--            </div>-->

<!--            <div>-->
<!--              <span class="font-medium text-gray-500">{{ translations.profiles?.salary }}:</span>-->
<!--              {{ translations.profiles?.salary_from }} {{ user?.preferences?.[0]?.desired_salary_from || 0 }} {{ user?.preferences?.[0]?.currency == "USD" ? '$' : 'UZS' }}-->
<!--              {{ translations.profiles?.salary_to }} {{ user?.preferences?.[0]?.desired_salary_to || 0 }} {{ user?.preferences?.[0]?.currency == "USD" ? '$' : 'UZS' }}-->
<!--            </div>-->
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              @click="goToEdit"
          >
            {{ translations.auto_apply?.update_button ?? 'Редактировать' }}
          </button>
          <h2 class="text-lg font-medium mb-4 mt-5 flex items-center gap-2 text-black">
            Head Hunter authentication
          </h2>

          <div class="space-y-2 text-sm text-gray-700">
            <div>
              <span class="text-gray-500">
                Avto otklik rejimini ishga tushirish uchun quyidagi tugmani bosing va Head Hunter akkauntigizdan ruxsat bering
              </span>
            </div>
          </div>

          <button
              :disabled="user?.hh_account_status"
              :class="[
    'w-full py-3 rounded-lg font-medium transition-colors mt-4 px-4 border border-red-400 text-sm',
    user?.hh_account_status
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
      : 'border-red-400 text-black hover:bg-blue-700'
  ]"
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
          <a
              :href="user?.resumes[0]?.file_url"
              target="_blank"
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-center block"
          >
            {{ translations.resumes?.view_btn || 'Rezyumeni ko‘rish' }}
          </a>
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
              <span>{{ appliedCount }} / {{ newLimit ?? limit }}</span>
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
                  v-model.number="tempLimit"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Qo‘shiladigan son"
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

        <div class="space-y-4">
<!--          &lt;!&ndash; Тарифный план &ndash;&gt;-->
<!--          <div class="bg-white border border-gray-200 rounded-2xl px-6 py-6">-->
<!--            <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">-->
<!--              💳 {{ translations.plan?.title }}-->
<!--            </h2>-->

<!--            <div class="mb-3 text-sm text-gray-600 flex justify-between">-->
<!--              <span>{{ translations.plan?.free_responses }}</span>-->
<!--              <span class="text-gray-900 font-medium">39/{{ balance?.balance }}</span>-->
<!--            </div>-->
<!--            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">-->
<!--              <div class="bg-orange-500 h-2.5 rounded-full" style="width: 78%"></div>-->
<!--            </div>-->

<!--            <div class="mb-3 text-sm text-gray-600 flex justify-between">-->
<!--              <span>Авто отклики</span>-->
<!--              <span class="text-gray-900 font-medium">0/100</span>-->
<!--            </div>-->
<!--            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">-->
<!--              <div class="bg-gray-400 h-2.5 rounded-full" style="width: 0%"></div>-->
<!--            </div>-->

<!--            <p class="text-xs text-gray-500 mb-3">-->
<!--              Купите авто отклики чтобы найти более подходящую вакансию-->
<!--            </p>-->

<!--            <button-->
<!--                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"-->
<!--                @click="openPayment"-->
<!--            >-->
<!--              Купить 100 авто откликов-->
<!--            </button>-->
<!--          </div>-->

<!--          &lt;!&ndash; Payment modal &ndash;&gt;-->
<!--          <transition name="slide-up">-->
<!--            <div-->
<!--                v-if="showPayment"-->
<!--                class="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50"-->
<!--                @click.self="closePayment"-->
<!--            >-->
<!--              <div class="bg-white w-full rounded-t-2xl p-6">-->
<!--                <h3 class="text-base font-medium mb-4 text-center">-->
<!--                  Выберите способ оплаты-->
<!--                </h3>-->

<!--                <div class="mb-4">-->
<!--                  <label class="block text-sm font-medium text-gray-700 mb-1">Количество</label>-->
<!--                  <input-->
<!--                      type="number"-->
<!--                      v-model="amount"-->
<!--                      class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"-->
<!--                  />-->
<!--                </div>-->

<!--                <div class="flex items-center justify-center gap-4">-->
<!--                  <button-->
<!--                      class="flex-1 flex items-center justify-center bg-[#00D36D] rounded-xl hover:bg-[#00b85e] overflow-hidden"-->
<!--                      @click="pay('payme')"-->
<!--                  >-->
<!--                    <img src="../assets/payments/payme.png" alt="payme" class="w-full h-auto object-cover" />-->
<!--                  </button>-->

<!--                  <button-->
<!--                      class="flex-1 flex items-center justify-center bg-[#006EFF] rounded-xl hover:bg-[#0058cc] overflow-hidden"-->
<!--                      @click="pay('click')"-->
<!--                  >-->
<!--                    <img src="../assets/payments/click.png" alt="click" class="w-full h-auto object-cover" />-->
<!--                  </button>-->
<!--                </div>-->

<!--                <button-->
<!--                    class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"-->
<!--                    @click="closePayment"-->
<!--                >-->
<!--                  Отмена-->
<!--                </button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </transition>-->

          <!-- Logout -->
          <div class="bg-white border border-gray-200 rounded-2xl px-6">
            <button
                class="mt-2 w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                @click="showLogoutModal = true"
            >
              {{ translations.payment?.logout }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- Modal -->
  <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
      <h2 class="text-lg font-medium text-gray-800 mb-4">
        {{ translations.logout_text }}
      </h2>
      <div class="flex justify-end gap-3">
        <button
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            @click="showLogoutModal = false"
        >
          {{ translations.cancel }}
        </button>
        <button
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            @click="logout"
        >
          {{ translations.payment?.logout }}
        </button>
      </div>
    </div>
  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import {ref, onMounted, computed, getCurrentInstance} from 'vue'
import axios from 'axios'
import { useI18n } from '@/i18n-lite'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import LoadingModal from "@/components/modal/LodaingModal.vue";
import Profile from "@/components/loading/Profile.vue";
const { translations } = useI18n()
const { proxy } = getCurrentInstance()

const router = useRouter()
const { locale } = useI18n()
const showPayment = ref(false)
const amount = ref(100)
const showLogoutModal = ref(false)
const showLoading = ref(false);
const loadingSkeleton = ref(true)
const openPayment = () => {
  showPayment.value = true
}

const closePayment = () => {
  showPayment.value = false
}

const pay = (method) => {
  console.log(`To'lov: ${method}, summa: ${amount.value}`)
  closePayment()
}

const user = ref(null)
const balance = ref({ balance: 0 })
const loading = ref(true)
const error = ref("")
const clearAuthStorage = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("expires_at")
  localStorage.removeItem("vacancies_cache")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("expires_at")
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
const goToEdit = () => {
  router.push({ name: "editProfile", params: { id: user.value.id } })
}

const enabled = ref(false);
const limit = ref(null);
const tempLimit = ref(null);
const newLimit = ref(null);
const saved = ref(false);
const appliedCount = ref(0);
const editMode = ref(false); // yangi state edit qilish uchun

const progressPercent = computed(() => {
  if (!limit.value) return 0;
  return Math.min((appliedCount.value / limit.value) * 100, 100);
});

const fetchAutoApplyData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(proxy.$locale + "/auth/settings/auto-apply", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const settings = response.data.data.settings;
    console.log("settings:", settings);

    enabled.value = settings.auto_apply_enabled;
    limit.value = settings.auto_apply_limit;
    appliedCount.value = settings.auto_apply_count;
    saved.value = !!limit.value;
  } catch (error) {
    if (error.response?.status === 401) clearAuthStorage();
  }
};

const saveLimit = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
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
    if (error.response?.status === 401) clearAuthStorage();
  }
};

const updateLimit = async () => {
  try {
    const token = localStorage.getItem("token");

    const oldLimit = Number(limit.value || 0);

    const addedValue = Number(tempLimit.value || 0);

    newLimit.value = oldLimit + addedValue;

    const response = await axios.patch(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          auto_apply_enabled: true,
          auto_apply_limit: newLimit.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );

    console.log("update response", response.data);

    // Limitni yangilaymiz
    limit.value = newLimit.value;
    saved.value = true;
    editMode.value = false;

    // Yangilashdan so‘ng serverdan qayta olish shart emas (fetchAutoApplyData),
    // chunki biz allaqachon local state’ni yangiladik.
  } catch (error) {
    console.error("updateLimit error", error);
    if (error.response?.status === 401) clearAuthStorage();
  }
};


onMounted(async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push({ name: "login" });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const { data: meData } = await axios.get(proxy.$locale + "/auth/me", { headers });
    user.value = meData.data;

    const balanceRes = await axios.get(proxy.$locale + "/v1/balance", { headers });
    balance.value = balanceRes.data;
    saved.value = meData.data?.settings?.auto_apply_limit;
    limit.value = meData.data?.settings?.auto_apply_limit;
    appliedCount.value = meData.data?.settings?.auto_apply_count;
    enabled.value = meData.data?.settings?.auto_apply_enabled;
    console.log('appliedCount || saved', meData.data?.settings?.auto_apply_count, meData.data?.settings?.auto_apply_limit)
    console.log("balanceRes.data", balanceRes.data);
    console.log("meData", meData);



    if (balance.value.credit.count >= 0) {
      await fetchAutoApplyData();
    }
  } catch (e) {
    error.value = "Foydalanuvchi ma’lumotlarini olishda xatolik.";
    if (e.response?.status === 401) clearAuthStorage();
  } finally {
    loading.value = false;
    loadingSkeleton.value = false;
  }
});

const logout = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (token) {
      await axios.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  } catch (error) {
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  } finally {
    clearAuthStorage()
    window.location.href = "/login"
  }
}

</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
