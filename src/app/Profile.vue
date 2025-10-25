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

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.phone }}:</span>
              +998 {{ user?.phone }}
            </div>
            <div>
              <span class="font-medium text-gray-500">{{ translations.working_status }}</span>
            </div>
            <!-- STATUS CARD -->
            <div class="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
              <div class="flex items-center gap-2">

                <span
                    v-if="userStatus === 'working'"
                    class="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  🟢 {{ translations.job_found }}
                </span>

                <span
                    v-else
                    class="inline-flex items-center gap-1 text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  ⚪ {{ translations.job_search }}
                </span>
              </div>

              <button
                  @click="toggleStatus"
                  :disabled="loading"
                  class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span v-else>{{ userStatus === 'working' ? translations.auto_apply?.update_button : translations.auto_apply?.update_button }}</span>
              </button>
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
                {{ hhAccountActive ? translations.auto_apply?.hh_connected : translations.auto_apply?.hh_required }}
              </span>
            </div>
          </div>
          <div>
            <button
                v-if="user?.hh_account_status"
                disabled
                class="w-full py-3 rounded-lg font-medium transition-colors mt-4 px-4 border border-gray-300 text-gray-500 bg-gray-200 cursor-not-allowed opacity-70 text-center"
            >
              {{ translations.hh_auth_connected || 'HeadHunter hisobingiz ulangan' }}
            </button>

            <a
                v-else-if="hhUrl"
                :href="hhUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 rounded-lg font-medium transition-colors mt-4 px-4 border border-red-400 text-sm text-center block text-black hover:bg-blue-700 hover:text-white"
            >
              {{ translations.hh_auth || 'HeadHunter orqali ulanish' }}
            </a>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-medium mb-4 flex items-center gap-2 text-black">
            <span>📄</span> {{ translations.resumes?.title }}
          </h2>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
             
              <span class="text-gray-700">
                {{ user?.resumes?.[0]?.title  }}
              </span>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">{{ translations.resumes?.status_active }}</span>
          </div>
<!--          <a-->
<!--              :href="user?.resumes[0]?.file_url"-->
<!--              target="_blank"-->
<!--              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-center block"-->
<!--          >-->
<!--            {{ translations.resumes?.view_btn || 'Rezyumeni ko‘rish' }}-->
<!--          </a>-->
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-medium mb-2 flex items-center gap-2 text-black">
            ⚡ {{ translations.auto_apply?.title }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">
            {{ translations.auto_apply?.description }}
          </p>
          <p
              v-if="!enabled"
              class="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-3"
          >
            {{ translations.auto_apply?.enable_hint }}
          </p>

          <!-- Checkbox -->
          <label class="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                v-model="enabled"
                class="sr-only peer"
                @change="toggleAutoApply"
            />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>

          <!-- Input va tugma (faqat 1-marta limit o‘rnatish uchun POST) -->
          <div v-if="enabled && !saved" class="mt-4 flex items-center gap-3">
            <input
                type="number"
                v-model.number="limit"
                class="w-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Son kiriting"
            />
            <button
                @click="saveLimit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500"
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
                  class="h-2 bg-blue-600 transition-all duration-300"
                  :style="{ width: progressPercent + '%' }"
              ></div>
            </div>

            <!-- Edit tugmasi -->
            <div v-if="!editMode" class="mt-4">
              <button
                  @click="editMode = true"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Qo‘shiladigan son"
              />

              <!-- Buttonlar yonma-yon -->
              <div class="flex items-center gap-3">
                <button
                    @click="updateLimit"
                    class="w-48 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500"
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

        <div
            v-if="hasActivePlan"
            class="bg-white border border-blue-200 rounded-2xl p-6"
        >
          <h2 class="text-lg font-medium mb-3 flex items-center gap-2 text-gray-900">
             {{ translations.plan?.current || 'Joriy tarif' }}
          </h2>
          <div class="flex flex-wrap items-center gap-3">
            <span class="  font-medium text-gray-900">
              {{ subscriptionPlanName }}
            </span>
            <span
                v-if="subscriptionPlanPrice"
                class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
            >
              {{ subscriptionPlanPrice }} UZS
            </span>
            <span
                v-if="planLimit"
                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
            >
              {{ translations.plan?.limit }}: {{ planLimit }}
            </span>
          </div>
          <p
              v-if="subscriptionExpiry"
              class="text-sm text-gray-500 mt-3"
          >
            {{ translations.plan?.expires || 'Amal qilish muddati' }}:
            <span class="text-gray-900 font-medium">
              {{ subscriptionExpiry }}
            </span>
          </p>
        </div>

        <div class="space-y-4">
          <!-- Sizning mavjud HTML kodingizni o‘zgartirmadik -->
          <div ref="plansSection" class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
            <div class="mb-3 text-xs sm:text-sm text-gray-600 flex justify-between">
              <span>{{ translations.plan?.free_responses }}</span>
              <span class="text-gray-900 font-medium">{{ creditsUsed }} / {{ planLimit }}</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-4 sm:h-2.5">
              <div
                  class="bg-blue-500 h-2 sm:h-2.5 rounded-full"
                  :style="{ width: planUsagePercent + '%' }"
              ></div>
            </div>

            <h3 class="text-2xl sm:text-lg font-medium mb-4 text-gray-900">
              {{ translations.plan?.title }} 
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                  v-for="plan in plans"
                  :key="plan.id || plan.plan_id"
                  :class="[
                    'border rounded-xl px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300 flex flex-col justify-center',
                    isPlanActive(plan) ? 'border-blue-500 bg-blue-50 shadow-md cursor-default' : 'border-gray-200 bg-gray-50',
                    hasActivePlan && !isPlanActive(plan) ? 'opacity-60 cursor-not-allowed' : '',
                    !hasActivePlan ? 'cursor-pointer hover:shadow-md' : ''
                  ]"
                  @click="handlePlanClick(plan)"
              >
                <div class="flex items-center justify-between gap-3 mb-1">
                  <h4 class="text-xl sm:text-2xl font-normal text-gray-800 translate-y-2">
                    {{ plan.name }} 
                  </h4>
                  <span class="text-xl sm:text-2xl font-normal text-blue-600 translate-y-1.5">
                    {{ plan.price }} UZS
                  </span>
                </div>
                <span
                    v-if="isPlanActive(plan)"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium self-start translate-y-2"
                >
                  {{ translations.plan?.current_badge || 'Sizning tarifi' }}
                </span>
                <div class="text-right mb-2">
                  <span class="text-gray-400 line-through text-xs sm:text-sm">
                    {{ plan.fake_price }} UZS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment modal -->
          <transition name="slide-up">
            <div
                v-if="showPayment"
                class="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50"
                @click.self="closePayment"
            >
              <div class="bg-white w-full rounded-t-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
                <div v-if="selectedPlan" class="mb-4">
                  <h4 class="text-lg font-medium text-gray-800 mb-1 text-center">
                    {{ selectedPlan.name }}
                  </h4>
                  <p class="text-sm text-gray-500 mb-2">
                    {{ selectedPlan.description }}
                  </p>
                  <div class="text-end mb-3">
              <span class="text-base sm:text-lg font-medium text-blue-600">
                {{ selectedPlan.price }} UZS
              </span>
                    <br />
                    <span class="text-gray-400 line-through text-xs sm:text-sm">
                {{ selectedPlan.fake_price }} UZS
              </span>
                  </div>
                </div>

                <h3 class="text-base font-medium mb-4">
                  {{ translations.select_payment_method }}
                </h3>
                <div class="flex items-center justify-center gap-3 sm:gap-4">
                  <button @click="pay('payme')">
                    <img
                        src="../assets/payments/payme.png"
                        alt="payme"
                        class="sm:w-full h-auto object-contain"
                    />
                  </button>

                  <button @click="pay('click')">
                    <img
                        src="../assets/payments/click.png"
                        alt="click"
                        class="sm:w-full h-auto object-contain"
                    />
                  </button>
                </div>

                <button
                    class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                    @click="closePayment"
                >
                  {{ translations.payment_confirm?.cancel }}
                </button>
              </div>
            </div>
          </transition>

          <transition name="fade">
            <div
                v-if="showConfirmModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            >
              <div class="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">
                  {{ translations.payment_confirm?.title }}
                </h3>

                <p class="text-sm text-gray-500 mb-5">
                  {{ translations.payment_confirm?.description }}
                  <b class="text-blue-600 uppercase">{{ selectedMethod }}</b>
                </p>

                <div class="flex justify-center gap-3">
                  <!-- ⬇️ Button o‘rniga <a> -->
                  <a
                      :href="paymentUrl"
                      target="_blank"
                      @click="confirmPayment"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg
                        v-if="loading"
                        class="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                      ></circle>
                      <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span v-else>{{ translations.payment_confirm?.continue }}</span>
                  </a>

                  <button
                      @click="closeConfirm"
                      class="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    {{ translations.payment_confirm?.cancel }}
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

      </div>
    </div>
  </div>
  <!-- Modal -->
  <div
      v-if="showHhModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
      <h2 class="text-lg font-medium text-gray-800">
        {{ translations.auto_apply?.hh_modal_title }}
      </h2>
      <p class="text-sm text-gray-600">
        {{ translations.auto_apply?.hh_modal_description }}
      </p>
      <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
            class="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            @click="closeHhModal"
        >
          {{ translations.auto_apply?.hh_modal_cancel }}
        </button>
        <button
            class="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            @click="handleHeadHunterAuth"
        >
          {{ translations.auto_apply?.hh_modal_action }}
        </button>
      </div>
    </div>
  </div>
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
import {ref, onMounted, computed, getCurrentInstance, watch, nextTick} from 'vue'
import axios from 'axios'
import { useI18n } from '@/i18n-lite'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import LoadingModal from "@/components/modal/LodaingModal.vue";
import Profile from "@/components/loading/Profile.vue";
const { translations } = useI18n()
const { proxy } = getCurrentInstance()

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const amount = ref(100)
const showLogoutModal = ref(false)
const showLoading = ref(false);
const showHhModal = ref(false);
const loadingSkeleton = ref(true)

const user = ref(null)
const balance = ref({ balance: 0 })
const asNumber = (value) => {
  if (value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}
const plans = ref([])
const activeSubscription = computed(() => {
  const subscription = user.value?.subscription
  if (subscription) return subscription
  const subscriptions = user.value?.subscriptions
  if (Array.isArray(subscriptions) && subscriptions.length) {
    const active = subscriptions.find((item) => item?.status === 'active')
    return active || subscriptions[0]
  }
  return null
})
const subscriptionPlan = computed(() => {
  const subscription = activeSubscription.value
  if (!subscription) return null
  if (subscription.plan) return subscription.plan
  const planId =
      subscription.plan_id ??
      subscription.planId ??
      subscription.planID ??
      subscription.plan?.id
  if (!planId || !Array.isArray(plans.value)) return null
  return plans.value.find((plan) => {
    const candidateId = normalizePlanId(plan)
    return candidateId !== undefined &&
        candidateId !== null &&
        String(candidateId) === String(planId)
  }) || null
})
const normalizePlanId = (plan) => {
  if (!plan) return null
  return (
      plan.id ??
      plan.plan_id ??
      plan.planId ??
      plan.planID ??
      plan.plan?.id ??
      null
  )
}
const activePlanId = computed(() => {
  const plan = subscriptionPlan.value
  return plan ? normalizePlanId(plan) : null
})
const hasActivePlan = computed(() => activePlanId.value !== null)
const subscriptionPlanName = computed(() => {
  const plan = subscriptionPlan.value
  if (!plan) return ''
  return (
      plan.name ??
      plan.title ??
      plan.plan_name ??
      plan?.translation?.name ??
      ''
  )
})
const subscriptionPlanPrice = computed(() => {
  const plan = subscriptionPlan.value
  if (!plan) return null
  return plan.price ?? plan.amount ?? plan.cost ?? null
})
const subscriptionExpiry = computed(() => {
  const subscription = activeSubscription.value
  if (!subscription) return null
  const raw =
      subscription.expires_at ??
      subscription.expired_at ??
      subscription.ends_at ??
      subscription.end_at ??
      null
  if (!raw) return null
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString()
})
const isPlanActive = (plan) => {
  const selectedId = activePlanId.value
  if (selectedId === null) return false
  const planId = normalizePlanId(plan)
  if (planId === null) return false
  return String(planId) === String(selectedId)
}
const plansSection = ref(null)
const loading = ref(true)
const error = ref("")
const hhAccountActive = computed(() => !!user.value?.hh_account_status)
const clearAuthStorage = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("expires_at")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("expires_at")
  router.push({ name: "register" })
}
const goToHeadHunter = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  const { data } = await axios.get(proxy.$locale + "/v1/hh-accounts/authorize", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
  hhUrl.value = data?.url
}

const scrollToPlans = () => {
  nextTick(() => {
    plansSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const pendingPlansScroll = ref(route.query.highlight === 'plans')

watch(
    () => route.query.highlight,
    (value) => {
      if (value === 'plans') {
        if (!loadingSkeleton.value) {
          scrollToPlans()
        } else {
          pendingPlansScroll.value = true
        }
      }
    },
    { immediate: true }
)

watch(
    () => loadingSkeleton.value,
    (isLoading) => {
      if (!isLoading && pendingPlansScroll.value) {
        pendingPlansScroll.value = false
        scrollToPlans()
      }
    }
)

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
const saved = ref(false);
const appliedCount = ref(0);
const editMode = ref(false); // yangi state edit qilish uchun

const progressPercent = computed(() => {
  if (!limit.value) return 0;
  return Math.min((appliedCount.value / limit.value) * 100, 100);
});
const creditsUsed = computed(() => {
  const subscriptionUsed =
      asNumber(activeSubscription.value?.auto_response_used) ??
      asNumber(activeSubscription.value?.auto_responses_used)
  if (subscriptionUsed !== null) return subscriptionUsed
  const directUsed =
      asNumber(balance.value?.auto_response_used) ??
      asNumber(balance.value?.auto_responses_used)
  if (directUsed !== null) return directUsed
  const credit = balance.value?.credit || {}
  const creditUsed =
      asNumber(credit.used) ??
      asNumber(credit.used_count) ??
      asNumber(credit.consumed)
  if (creditUsed !== null) return creditUsed
  const applied = asNumber(appliedCount.value)
  return applied ?? 0
})
const planLimit = computed(() => {
  const planLimitFromPlan =
      asNumber(subscriptionPlan.value?.auto_response_limit) ??
      asNumber(subscriptionPlan.value?.auto_responses_limit)
  if (planLimitFromPlan !== null) return planLimitFromPlan
  const subscriptionLimit =
      asNumber(activeSubscription.value?.auto_response_limit) ??
      asNumber(activeSubscription.value?.auto_responses_limit)
  if (subscriptionLimit !== null) return subscriptionLimit
  const directLimit =
      asNumber(balance.value?.auto_response_limit) ??
      asNumber(balance.value?.auto_responses_limit)
  if (directLimit !== null) return directLimit
  const credit = balance.value?.credit || {}
  const creditLimit =
      asNumber(credit.limit) ??
      asNumber(credit.total) ??
      asNumber(credit.initial) ??
      asNumber(credit.purchased)
  if (creditLimit !== null) return creditLimit
  const available =
      asNumber(credit.remaining) ??
      asNumber(credit.available) ??
      asNumber(credit.balance) ??
      asNumber(balance.value?.balance)
  if (available !== null) {
    return available + creditsUsed.value
  }
  const savedLimit = asNumber(limit.value)
  if (savedLimit !== null) return savedLimit
  return creditsUsed.value
})
const planUsagePercent = computed(() => {
  if (!planLimit.value) return 0
  return Math.min((creditsUsed.value / planLimit.value) * 100, 100)
})

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

    enabled.value = settings.auto_apply_enabled;
    limit.value = settings.auto_apply_limit;
    appliedCount.value = settings.auto_apply_count;
    saved.value = !!limit.value;
    if (!hhAccountActive.value) {
      enabled.value = false;
    }
  } catch (error) {
    if (error.response?.status === 401) clearAuthStorage();
  }
};

const saveLimit = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
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
    const auto_apply_limit = tempLimit.value || 0;
    const response = await axios.patch(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          auto_apply_enabled: true,
          auto_apply_limit: auto_apply_limit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );

    limit.value = response.data.data.auto_apply_limit;
    saved.value = true;
    editMode.value = false;
  } catch (error) {
    console.error("updateLimit error", error);
    if (error.response?.status === 401) clearAuthStorage();
  }
};

const toggleAutoApply = async () => {
  try {
    if (enabled.value && !hhAccountActive.value) {
      enabled.value = false;
      showHhModal.value = true;
      return;
    }
    const token = localStorage.getItem("token");
    await axios.patch(
        proxy.$locale + "/auth/settings/auto-apply",
        {
          auto_apply_enabled: enabled.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );
    await fetchAutoApplyData();
  } catch (error) {
    console.error("toggleAutoApply error", error);
    if (error.response?.status === 401) {
      clearAuthStorage();
    } else {
      enabled.value = !enabled.value;
    }
  }
};

const closeHhModal = () => {
  showHhModal.value = false;
};

const handleHeadHunterAuth = async () => {
  await goToHeadHunter()
  if (hhUrl.value) {
    window.location.href = hhUrl.value
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push({ name: "register" });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const plan = await axios.get(proxy.$locale + "/plans");

    plans.value = plan.data.data;
    console.log(plan.data.data);

    const { data: meData } = await axios.get(proxy.$locale + "/auth/me", { headers });
    user.value = meData.data;
    //console.log("User data:", meData.data);
    userStatus.value = meData.data.status

    const balanceRes = await axios.get(proxy.$locale + "/v1/balance", { headers });
    balance.value = balanceRes.data;
    saved.value = meData.data?.settings?.auto_apply_limit;
    limit.value = meData.data?.settings?.auto_apply_limit;
    appliedCount.value = meData.data?.settings?.auto_apply_count;
    enabled.value = meData.data?.settings?.auto_apply_enabled;
    if (balance.value?.credit?.count >= 0) {
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

const userStatus = ref(null)

const toggleStatus = async () => {
  if (!user.value) return

  // Eski status asosida yangisini aniqlaymiz
  const newStatus = user.value.status === 'working' ? 'not_working' : 'working'
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Token topilmadi!')
    return
  }

  loading.value = true
  try {
    const response = await axios.post(
        proxy.$locale + '/auth/worked-status-update',
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
    )

    console.log('✅ API javobi:', response.data)

    const updatedStatus = response.data?.status || newStatus

    userStatus.value = updatedStatus
    user.value.status = updatedStatus
  } catch (err) {
    console.error('❌ Xatolik:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'Status yangilashda xatolik yuz berdi')
  } finally {
    loading.value = false
  }
}


// Payment method

const showConfirmModal = ref(false)
const selectedMethod = ref(null)

const showPayment = ref(false)
const selectedPlan = ref(null)

const openPayment = (plan) => {
  selectedPlan.value = plan
  showPayment.value = true
}
const handlePlanClick = (plan) => {
  if (hasActivePlan.value) return
  openPayment(plan)
}

const closePayment = () => {
  showPayment.value = false
  selectedPlan.value = null
}

const closeConfirm = () => {
  showConfirmModal.value = false
  selectedMethod.value = null
}

const pay = (method) => {
  selectedMethod.value = method
  showConfirmModal.value = true
}
const paymentUrl = ref('#')

const confirmPayment = async (e) => {
  if (!selectedPlan.value || !selectedMethod.value) return

  e.preventDefault() // <a> ichida ishlayapti
  const token = localStorage.getItem('token')
  loading.value = true

  try {
    const apiUrl =
        selectedMethod.value === 'click'
            ? proxy.$locale + '/click/booking'
            : proxy.$locale + '/payme/booking'

    const response = await axios.post(
        apiUrl,
        { plan_id: selectedPlan.value.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
    )

    // To‘lov havolasini saqlaymiz
    paymentUrl.value = response.data.payment_url || response.data.url

    // iPhone uchun — URL tayyor bo‘lgach, <a> orqali ochiladi
    if (paymentUrl.value) {
      window.open(paymentUrl.value, '_blank')
      closeConfirm()
      closePayment()
    } else {
      alert('To‘lov havolasi topilmadi!')
    }
  } catch (err) {
    console.error('❌ Xatolik:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'To‘lovni boshlashda xatolik yuz berdi.')
  } finally {
    loading.value = false
  }
}


// Logout method

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
    window.location.href = "/register"
  }
}

const hhUrl = ref(null)
const chatId = ref(null)
onMounted(async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  const chat_id = localStorage.getItem("chatId") || sessionStorage.getItem("chatId")
  try {
    const { data } = await axios.get(proxy.$locale + "/v1/hh-accounts/authorize", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    hhUrl.value = data?.url
    chatId.value = chat_id
  } catch (error) {
    console.error("HH authorize error", error)
  }
})
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
