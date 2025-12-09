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
            <div v-if="hasActivePlan">
              <span class="font-medium text-gray-500">{{ translations.working_status }}</span>
            </div>
            <!-- STATUS CARD -->
            <div v-if="hasActivePlan" class="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
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
<!--          <button-->
<!--              type="button"-->
<!--              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-center block"-->
<!--              @click="showResumeModal = true"-->
<!--          >-->
           <!-- {{ translations.auto_apply?.edit_resume }}-->
<!--          </button>-->
<!--          <a-->
<!--              :href="user?.resumes[0]?.file_url"-->
<!--              target="_blank"-->
<!--              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-center block"-->
<!--          >-->
<!--            {{ translations.resumes?.view_btn || 'Rezyumeni ko‘rish' }}-->
<!--          </a> -->
        </div>

        <!-- <div class="bg-white border border-gray-200 rounded-2xl p-6">
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
          </p> -->

          <!-- Checkbox -->
          <!-- <label class="inline-flex items-center cursor-pointer">
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
          </label> -->

          <!-- Slider + saqlash (asosiy qism) -->
          <!-- <div v-if="enabled" class="mt-4 space-y-4">
            <div class="glass-slider flex items-center gap-3">
              <input
                  type="range"
                  v-model.number="tempLimit"
                  :min="sliderMin"
                  :max="sliderMax"
                  :style="sliderInputStyle"
                  class="slider-input flex-1 appearance-none cursor-pointer focus:outline-none"
                  :disabled="isTrialExhausted || isOutOfCredits"
                  @mousedown="handleSliderPress"
                  @touchstart="handleSliderPress"
                  @mouseup="handleSliderRelease"
                  @touchend="handleSliderRelease"
                  @touchcancel="handleSliderRelease"
                  @mouseleave="handleSliderRelease"
                  @blur="handleSliderRelease"
              />
              <span class="w-12 text-sm text-gray-600 text-right">
                {{ displaySliderValue }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <button
                  @click="handleSaveClick"
                  class="w-full sm:w-48 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500"
                  :disabled="saveDisabled"
              >
                {{ saveButtonText }}
              </button>
            </div>

            <p v-if="isTrialExhausted || isOutOfCredits" class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {{ translations.auto_apply?.subscribe_to_use || 'Auto applydan foydalanish uchun obunani harid qiling' }}
            </p>
          </div> -->
        <!-- </div> -->

        <!-- <div
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
        </div> -->

        <div class="space-y-4">
          <!-- Sizning mavjud HTML kodingizni o‘zgartirmadik -->
          <!-- <div ref="plansSection" class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
            <div class="mb-3 text-xs sm:text-sm text-gray-600 flex justify-between">
              <span>{{ translations.plan?.free_responses }}</span>
              <span class="text-gray-900 font-medium">{{ balanceCreditLimit }} / {{ planLimit }}</span>
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
                  </h4> -->

                    <!-- <span
                      v-if="isPlanActive(plan)"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium self-start translate-y-2"
                  >
                    {{ translations.plan?.current_badge || 'Sizning tarifi' }}
                  </span> -->
                  <!-- <span class="text-xl sm:text-2xl font-normal text-blue-600 translate-y-1.5">
                    {{ formatUZS(plan.price) }} UZS
                    
                  </span>
                </div>
                <div class="text-right mb-2" v-if="plan.fake_price">
                  <span class="text-gray-400 line-through text-xs sm:text-sm">
                    {{ formatUZS(plan.fake_price) }} UZS
                  </span>
                </div> -->











                <!-- <div v-if="isPlanActive(plan)" class="flex items-center justify-between gap-2">
                  <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    {{ translations.plan?.current_badge }}
                  </span>
                  <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    {{ subscriptionPeriod }}
                  </span>
                </div> -->



                <!-- <span
                    v-if="isPlanActive(plan)"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium self-start translate-y-1 "
                >
                  12.12.2025-11.01.2025
                </span> -->



















<!--                
              </div>
            </div> -->
          <!-- </div> -->

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
                  <p class="text-sm text-gray-500 mb-2 whitespace-pre-line">
                    {{ selectedPlan.description }}
                  </p>
                  <div class="text-end mb-3">
              <span class="text-base sm:text-lg font-medium text-blue-600">
                {{ formatUZS(selectedPlan.price) }} UZS
              </span>
                    <br />
                    <span class="text-gray-400 line-through text-xs sm:text-sm">
                {{ formatUZS(selectedPlan.fake_price) }} UZS
              </span>
                  </div>
                </div>

                <h3 class="text-base font-medium mb-4">
                  {{ translations.select_payment_method }}
                </h3>
                <div class="flex items-center justify-center gap-3 sm:gap-4">
                  <a
                      href="#"
                      role="button"
                      class="payment-option"
                      @click.prevent="pay('payme')"
                      @keydown.enter.prevent="pay('payme')"
                  >
                    <img
                        src="../assets/payments/payme.png"
                        alt="payme"
                        class="sm:w-full h-auto object-contain"
                    />
                  </a>

                  <a
                      href="#"
                      role="button"
                      class="payment-option"
                      @click.prevent="pay('click')"
                      @keydown.enter.prevent="pay('click')"
                  >
                    <img
                        src="../assets/payments/click.png"
                        alt="click"
                        class="sm:w-full h-auto object-contain"
                    />
                  </a>
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
                  <!-- Continue: always visible; disabled until URL is ready -->
                  <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click="onContinueClick"
                      @keydown.enter.prevent="onContinueClick"
                      :class="[
                        'bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors',
                        paymentUrl ? 'hover:bg-blue-700' : 'opacity-60 cursor-wait'
                      ]"
                  >
                    <span>{{ translations.payment_confirm?.continue }}</span>
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
  <!-- Resume edit modal -->
  <div
      v-if="showResumeModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
      <h2 class="text-lg font-medium text-gray-800 mb-2">
         {{ translations.auto_apply?.edit_resume }}
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        {{ translations.auto_apply?.resume_description }}
      </p>
      <div class="flex justify-end gap-3">
        <button
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            @click="showResumeModal = false"
        >
          {{ translations.auto_apply?.cancel_button }}
        </button>
        <button
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            @click="openSupportChat"
        >
          {{ translations.auto_apply?.appeal }}
        </button>
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

  <!-- Resume picker (Auto-apply) -->
  <div
      v-if="showResumePicker"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Resumeni tanlang</h2>

      <div v-if="resumesLoading" class="space-y-3">
        <div class="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div class="text-sm text-gray-500">Yuklanmoqda...</div>
      </div>

      <div v-else-if="resumes.length === 0" class="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
        HH dagi ‘published’ rezumelaringiz topilmadi.
      </div>

      <div v-else class="space-y-3 max-h-64 overflow-auto">
        <label
            v-for="r in resumes"
            :key="r.id"
            class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input type="radio" class="h-4 w-4" :value="r.id" v-model="selectedResumeId" />
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ r.title || ('Rezume #' + r.id) }}</p>
            <!-- <p class="text-xs text-gray-500">Status: {{ r.status?.id }}</p> -->
          </div>
        </label>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            @click="closeResumePicker"
        >
          Bekor qilish
        </button>
        <button
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :disabled="!selectedResumeId || savingResumeSelection"
            @click="confirmResumeAndSave"
        >
          <svg v-if="savingResumeSelection" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Tasdiqlash</span>
        </button>
      </div>
    </div>
  </div>
<!--  <div-->
<!--      v-if="showLogoutModal"-->
<!--      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"-->
<!--  >-->
<!--    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">-->
<!--      <h2 class="text-lg font-medium text-gray-800 mb-4">-->
<!--        {{ translations.logout_text }}-->
<!--      </h2>-->
<!--      <div class="flex justify-end gap-3">-->
<!--        <button-->
<!--            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"-->
<!--            @click="showLogoutModal = false"-->
<!--        >-->
<!--          {{ translations.cancel }}-->
<!--        </button>-->
<!--        <button-->
<!--            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"-->
<!--            @click="logout"-->
<!--        >-->
<!--          {{ translations.payment?.logout }}-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
  <LoadingModal :show="showLoading" />
  <div
      v-if="showReloadModal"
      @close="showReloadModal = false"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
      <h2 class="text-lg font-medium text-gray-800 mb-4">
        Iltimos, o‘zgarishlarni ko‘rish uchun sahifani yangilang.
      </h2>
      <div class="flex justify-end gap-3">
        <button
            class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            @click="reloadPage"
        >
          Sahifani yangilash
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref, onMounted, onUnmounted, computed, getCurrentInstance, watch, nextTick} from 'vue'
import axios from 'axios'
import { useI18n } from '@/i18n-lite'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import LoadingModal from "@/components/modal/LodaingModal.vue";
import Profile from "@/components/loading/Profile.vue";
const { translations } = useI18n()
import { toast } from "vue3-toastify"
const { proxy } = getCurrentInstance()

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const amount = ref(100)
const showLogoutModal = ref(false)
const showResumeModal = ref(false)
const showResumePicker = ref(false)
const resumesLoading = ref(false)
const resumes = ref([])
const selectedResumeId = ref(null)
const savingResumeSelection = ref(false)
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
// Support chat URL (same as in Page.vue button)
const supportUrl = 'https://t.me/inter_ai_support_bot'
const openSupportChat = () => {
  window.open(supportUrl, '_blank', 'noopener,noreferrer')
  showResumeModal.value = false
}
// Format UZS amounts with dot as thousands separator without losing precision
const formatUZS = (value) => {
  if (value === null || value === undefined) return '0'
  let str = String(value).trim()
  if (!str) return '0'
  const isNegative = str.startsWith('-')
  // Keep only digits; ignore any existing separators or currency symbols
  str = str.replace(/[^0-9]/g, '')
  if (!str) return '0'
  const withDots = str.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return isNegative ? `-${withDots}` : withDots
}
const plans = ref([])
const activeSubscription = computed(() => {
  // Only consider ACTIVE subscription as current
  const sub = user.value?.subscription
  if (sub && sub.status === 'active') return sub
  const list = user.value?.subscriptions
  if (Array.isArray(list) && list.length) {
    return list.find((item) => item?.status === 'active') || null
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
// Format date to dd.mm.yyyy for badges
const formatDateDMY = (raw) => {
  if (!raw) return null
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}
const subscriptionExpiry = computed(() => {
  const subscription = activeSubscription.value
  if (!subscription) return null
  const raw =
      subscription.expires_at ??
      subscription.expired_at ??
      subscription.ends_at ??
      subscription.end_at ??
      null
  return formatDateDMY(raw)
})
const subscriptionStart = computed(() => {
  const subscription = activeSubscription.value
  if (!subscription) return null
  const raw =
      subscription.starts_at ??
      subscription.start_at ??
      subscription.started_at ??
      subscription.begin_at ??
      subscription.begins_at ??
      null
  return formatDateDMY(raw)
})
const subscriptionPeriod = computed(() => {
  const start = subscriptionStart.value
  const end = subscriptionExpiry.value
  if (start && end) return `${start}-${end}`
  return start || end || ''
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
const sliderMin = 0;
const sliderActive = ref(false);

const progressPercent = computed(() => {
  if (!limit.value) return 0;
  return Math.min((appliedCount.value / limit.value) * 100, 100);
});
const creditsUsed = computed(() => {
  const credit = balance.value?.credit || {}
  // 1) Trial: backend increments credit.limit as used count
  if (!hasActivePlan.value) {
    const trialUsed = asNumber(credit.limit)
    if (trialUsed !== null) return trialUsed
  }
  // 2) Subscription or generic counters
  const subscriptionUsed =
      asNumber(activeSubscription.value?.auto_response_used) ??
      asNumber(activeSubscription.value?.auto_responses_used)
  if (subscriptionUsed !== null) return subscriptionUsed
  const directUsed =
      asNumber(balance.value?.auto_response_used) ??
      asNumber(balance.value?.auto_responses_used)
  if (directUsed !== null) return directUsed
  const creditUsed =
      asNumber(credit.used) ??
      asNumber(credit.used_count) ??
      asNumber(credit.consumed)
  if (creditUsed !== null) return creditUsed
  // 3) Fallback: some backends use credit.limit as a monotonically increasing used counter too
  const limitAsUsed = asNumber(credit.limit)
  if (limitAsUsed !== null) return limitAsUsed
  const applied = asNumber(appliedCount.value)
  return applied ?? 0
})
// For the label: take limit from /balance -> credit.limit
const balanceCreditLimit = computed(() => {
  const credit = balance.value?.credit || {}
  const limitNum = asNumber(credit.limit)
  return limitNum !== null ? limitNum : 0
})
const FREE_TRIAL_LIMIT = 10
const planLimit = computed(() => {
  const planLimitFromPlan =
      asNumber(subscriptionPlan.value?.auto_response_limit) ??
      asNumber(subscriptionPlan.value?.auto_responses_limit)
  if (planLimitFromPlan !== null) return planLimitFromPlan
  const subscriptionLimit =
      asNumber(activeSubscription.value?.auto_response_limit) ??
      asNumber(activeSubscription.value?.auto_responses_limit)
  if (subscriptionLimit !== null) return subscriptionLimit
  if (!hasActivePlan.value) return FREE_TRIAL_LIMIT
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
const DEFAULT_SLIDER_MAX = 500
const planRemaining = computed(() => {
  const total = asNumber(planLimit.value)
  if (total === null || total <= 0) return null
  const used = asNumber(creditsUsed.value)
  if (used === null) return total
  return Math.max(total - used, 0)
})
// prefer derived remaining; fall back to raw balance fields
const remainingCredits = computed(() => {
  const fromPlan = asNumber(planRemaining.value)
  if (fromPlan !== null) return fromPlan
  const credit = balance.value?.credit || {}
  const candidates = [
    credit.remaining, credit.available, credit.balance, credit.count, balance.value?.balance
  ].map(asNumber).filter(v => v !== null)
  return candidates.length ? Math.max(...candidates) : 0
})
const sliderMax = computed(() => {
  const remaining = asNumber(remainingCredits.value)
  if (remaining !== null && remaining > 0) return remaining
  const planBound = asNumber(planRemaining.value)
  if (planBound !== null && planBound > 0) return planBound
  const savedBound = asNumber(limit.value)
  if (savedBound !== null && savedBound > 0) return savedBound
  return DEFAULT_SLIDER_MAX
})
const isTrial = computed(() => !hasActivePlan.value)
const isTrialExhausted = computed(() => isTrial.value && (asNumber(planRemaining.value) ?? 0) <= 0)
const MIN_SEND_LIMIT = 1
const isUpdateDisabled = computed(() => {
  const numeric = asNumber(tempLimit.value)
  if (numeric === null) return true
  if (numeric < MIN_SEND_LIMIT) return true
  return numeric > sliderMax.value
})
const sliderValue = computed(() => {
  const numeric = asNumber(tempLimit.value)
  if (numeric === null) return sliderMin
  if (numeric < sliderMin) return sliderMin
  if (numeric > sliderMax.value) return sliderMax.value
  return numeric
})
const sliderPercent = computed(() => {
  const max = sliderMax.value
  if (max === sliderMin) return 0
  return ((sliderValue.value - sliderMin) / (max - sliderMin)) * 100
})
const sliderInputStyle = computed(() => {
  const percent = sliderPercent.value
  // Expose fill percent via CSS var; render gradient on the track pseudo-element
  return {
    '--aa-percent': `${percent}%`,
    background: 'none',
    boxShadow: 'none'
  }
})
const displaySliderValue = computed(() => sliderValue.value ?? sliderMin)

const handleSliderPress = () => {
  sliderActive.value = true
}
const handleSliderRelease = () => {
  sliderActive.value = false
}

// Clamp slider temp value to current dynamic max/min
const clampTempToBounds = () => {
  const n = asNumber(tempLimit.value)
  const max = asNumber(sliderMax.value)
  if (!Number.isFinite(max)) return
  if (n === null) {
    tempLimit.value = sliderMin
    return
  }
  if (n > max) {
    tempLimit.value = max
    return
  }
  if (n < sliderMin) {
    tempLimit.value = sliderMin
  }
}

// Save cooldown persistence + countdown
let saveCooldownTimerId = null
let saveCooldownTickId = null
const saveCooldownActive = ref(false)
const saveCooldownUntil = ref(null)
const nowTick = ref(Date.now())
const SAVE_COOLDOWN_MS = 60 * 1000
const SAVE_COOLDOWN_KEY = 'aaSaveCooldownUntil'
const stopCooldownTick = () => {
  if (saveCooldownTickId) {
    clearInterval(saveCooldownTickId)
    saveCooldownTickId = null
  }
}
const startCooldownTick = () => {
  if (saveCooldownTickId) return
  saveCooldownTickId = setInterval(() => {
    nowTick.value = Date.now()
  }, 1000)
}
const scheduleCooldownTimer = (remainingMs) => {
  if (saveCooldownTimerId) clearTimeout(saveCooldownTimerId)
  saveCooldownTimerId = setTimeout(() => {
    saveCooldownActive.value = false
    saveCooldownTimerId = null
    localStorage.removeItem(SAVE_COOLDOWN_KEY)
    saveCooldownUntil.value = null
    stopCooldownTick()
  }, Math.max(0, remainingMs))
}
const startSaveCooldown = (durationMs = SAVE_COOLDOWN_MS) => {
  const until = Date.now() + durationMs
  saveCooldownActive.value = true
  localStorage.setItem(SAVE_COOLDOWN_KEY, String(until))
  saveCooldownUntil.value = until
  scheduleCooldownTimer(durationMs)
  startCooldownTick()
}
const countdownSeconds = computed(() => {
  const until = Number(saveCooldownUntil.value)
  if (!saveCooldownActive.value || !Number.isFinite(until)) return 0
  const remaining = Math.max(0, until - nowTick.value)
  return Math.ceil(remaining / 1000)
})
const saveButtonText = computed(() => {
  if (saveCooldownActive.value) {
    const base = translations.value?.auto_apply?.in_progress || 'Jarayonda'
    return `${base} (${countdownSeconds.value}s)`
  }
  return translations.value?.auto_apply?.use_button || 'Ishlatish'
})
const savingLimit = ref(false)
const isOutOfCredits = computed(() => {
  const derived = asNumber(planRemaining.value)
  if (derived !== null) return derived <= 0
  const direct = asNumber(remainingCredits.value)
  if (direct !== null) return direct <= 0
  return false
})
const saveDisabled = computed(() => {
  return (
      isUpdateDisabled.value ||
      isTrialExhausted.value ||
      isOutOfCredits.value ||
      savingLimit.value ||
      saveCooldownActive.value
  )
})

onMounted(() => {
  window.addEventListener('mouseup', handleSliderRelease)
  window.addEventListener('touchend', handleSliderRelease)
  window.addEventListener('touchcancel', handleSliderRelease)
  // Restore cooldown
  const untilStr = localStorage.getItem(SAVE_COOLDOWN_KEY)
  if (untilStr) {
    const until = Number(untilStr)
    if (Number.isFinite(until)) {
      const remaining = until - Date.now()
      if (remaining > 0) {
        saveCooldownActive.value = true
        saveCooldownUntil.value = until
        scheduleCooldownTimer(remaining)
        startCooldownTick()
      } else {
        localStorage.removeItem(SAVE_COOLDOWN_KEY)
      }
    }
  }
  // Ensure initial slider value is within bounds
  clampTempToBounds()
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleSliderRelease)
  window.removeEventListener('touchend', handleSliderRelease)
  window.removeEventListener('touchcancel', handleSliderRelease)
  if (saveCooldownTimerId) {
    clearTimeout(saveCooldownTimerId)
    saveCooldownTimerId = null
  }
  if (saveCooldownTickId) {
    clearInterval(saveCooldownTickId)
    saveCooldownTickId = null
  }
})

// Re-clamp when max changes (e.g., after balance refresh or plan state change)
watch(() => sliderMax.value, () => {
  clampTempToBounds()
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
    autoApplyResumeId.value = settings.resume_id ?? null;
    saved.value = !!limit.value;
    // Slider always starts from 0
    tempLimit.value = sliderMin
    if (!hhAccountActive.value) {
      enabled.value = false;
    }
  } catch (error) {
    if (error.response?.status === 401) clearAuthStorage();
  }
};

// Refresh balance info to reflect latest credit usage/limit
const fetchBalance = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  if (!token) return
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  const balanceRes = await axios.get(proxy.$locale + "/v1/balance", { headers })
  balance.value = balanceRes.data
}

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

const updateLimit = async (resumeId = null) => {
  if (isUpdateDisabled.value || saveCooldownActive.value || savingLimit.value) return
  // Start cooldown immediately and persist across reloads
  startSaveCooldown()
  savingLimit.value = true
  try {
    const token = localStorage.getItem("token");
    const candidate = asNumber(sliderValue.value) ?? 0
    const remaining = asNumber(remainingCredits.value) ?? MIN_SEND_LIMIT
    const auto_apply_limit = Math.max(MIN_SEND_LIMIT, Math.min(candidate, remaining));
    const response = await axios.patch(
        proxy.$locale + "/auth/settings/auto-apply",
        (() => {
          const body = {
            auto_apply_enabled: true,
            auto_apply_limit: auto_apply_limit,
          }
          if (resumeId) body.resume_id = resumeId
          return body
        })(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
    );

    limit.value = response.data.data.auto_apply_limit;
    saved.value = true;
    // reset slider to 0 after saving
    tempLimit.value = sliderMin;
    // Refresh balance so trial usage (credit.limit) and remaining update immediately
    try {
      await fetchBalance();
    } catch (_) { /* ignore */ }
  } catch (error) {
    console.error("updateLimit error", error);
    if (error.response?.status === 401) clearAuthStorage();
  } finally {
    savingLimit.value = false
  }
};

// Open resume picker when clicking Save in slider
const autoApplyResumeId = ref(null)
const handleSaveClick = async () => {
  if (saveDisabled.value) return
  if (!hhAccountActive.value) {
    showHhModal.value = true
    return
  }
  await openResumePicker()
}

const openResumePicker = async () => {
  try {
    showResumePicker.value = true
    resumesLoading.value = true
    selectedResumeId.value = null
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const { data } = await axios.get(proxy.$locale + '/v1/hh-resumes/published', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    resumes.value = Array.isArray(data?.items) ? data.items : []
    // Preselect if previously saved in settings
    if (autoApplyResumeId.value && resumes.value.some(r => String(r.id) === String(autoApplyResumeId.value))) {
      selectedResumeId.value = autoApplyResumeId.value
    }
  } catch (e) {
    toast.error('HH dagi rezumelarni olishda xatolik yuz berdi')
  } finally {
    resumesLoading.value = false
  }
}

const closeResumePicker = () => {
  showResumePicker.value = false
}

const confirmResumeAndSave = async () => {
  if (!selectedResumeId.value) return
  try {
    savingResumeSelection.value = true
    await updateLimit(selectedResumeId.value)
    autoApplyResumeId.value = selectedResumeId.value
    showResumePicker.value = false
    toast.success('Auto-apply sozlamalari saqlandi')
  } catch (e) {
    // updateLimit already handles most errors; show generic if thrown
    if (e?.response?.status === 422) {
      toast.error('Rezyume tanlash talab qilinadi')
    }
  } finally {
    savingResumeSelection.value = false
  }
}

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
    // Always start slider from 0 on initial page load
    tempLimit.value = sliderMin
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

 // qo'shilgan 1 
  // Register listeners to detect return from payment on iOS (tab restored/visible)
  window.addEventListener('pageshow', handlePageShow)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleWindowFocus)
  // Also check immediately in case we returned via a full redirect
  checkPaymentReturn()
 // qo'shilgan 1 tugadi 


});

//qo'shilgan 2
onUnmounted(() => {
  window.removeEventListener('pageshow', handlePageShow)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowFocus)
})
//qo'shilgan 2 tugadi

const userStatus = ref(null)

const toggleStatus = async () => {
  if (!user.value) return

  // Eski status asosida yangisini aniqlaymiz
  const newStatus = user.value.status === 'working' ? 'not_working' : 'working'
  const token = localStorage.getItem('token')

  if (!token) {
    toast.error('Token topilmadi!')
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
    toast.error(translations.value.status_update_24);
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

const paymentUrl = ref(null)

const pay = async (method) => {
  if (!selectedPlan.value) return
  selectedMethod.value = method
  showConfirmModal.value = true
  paymentUrl.value = null

  try {
    const token = localStorage.getItem('token')
    const apiUrl =
        method === 'click'
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
    paymentUrl.value = response.data.payment_url || response.data.url || null
    if (!paymentUrl.value) {
      alert('To‘lov havolasi topilmadi!')
      closeConfirm()
    }
  } catch (err) {
    console.error('❌ Xatolik:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'To‘lovni boshlashda xatolik yuz berdi.')
    closeConfirm()
  } finally {
    // no-op
  }
}

const handleConfirmNavigation = () => {
  closeConfirm()
  closePayment()
}

const requestPaymentUrl = async (method) => {
  const token = localStorage.getItem('token')
  const apiUrl = method === 'click' ? proxy.$locale + '/click/booking' : proxy.$locale + '/payme/booking'
  const response = await axios.post(
      apiUrl,
      { plan_id: selectedPlan.value.id },
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
  )
  return response.data.payment_url || response.data.url || null
}
const showReloadModal = ref(false)



// qo'shilgan 3
const PAYMENT_FLAG_KEY = 'iapp_payment_in_progress'
const setPaymentInProgress = () => {
  try {
    localStorage.setItem(PAYMENT_FLAG_KEY, String(Date.now()))
  } catch (_) { /* ignore */ }
}
const clearPaymentInProgress = () => {
  try {
    localStorage.removeItem(PAYMENT_FLAG_KEY)
  } catch (_) { /* ignore */ }
}
const checkPaymentReturn = () => {
  try {
    const ts = localStorage.getItem(PAYMENT_FLAG_KEY)
    if (ts) {
      showReloadModal.value = true
      clearPaymentInProgress()
    }
  } catch (_) { /* ignore */ }
}
// Detect when user returns to the app/tab (iOS Safari/WebView specifics)
const handlePageShow = () => {
  checkPaymentReturn()
}
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') checkPaymentReturn()
}
const handleWindowFocus = () => {
  checkPaymentReturn()
}
// qo'shilgan 3 tugadi



const reloadPage = () => {
  window.location.reload()
}

const onContinueClick = async (e) => {
  e.preventDefault()
  const win = window.open('about:blank', '_blank')
  if (!win) {
    if (paymentUrl.value) {


//qo'shilgan 4

      // iOS often blocks window.open; navigate in same tab
      // Mark payment in progress so we can detect return and show modal
      setPaymentInProgress()
//qo'shilgan 4 tugadi

      window.location.href = paymentUrl.value
      handleConfirmNavigation()
    }
    return
  }

  try {
    let url = paymentUrl.value
    if (!url) {
      if (!selectedPlan.value || !selectedMethod.value) {
        win.close()
        return
      }
      url = await requestPaymentUrl(selectedMethod.value)
    }

    if (url) {


//qo'shilgan 5      
      // New tab flow: mark payment in progress, navigate popup to provider
      setPaymentInProgress()
//qo'shilgan 5 tugadi



      win.location.href = url
      handleConfirmNavigation()

      // ⏳ 5 soniyadan keyin modalni ko‘rsatamiz
      setTimeout(() => {
        showReloadModal.value = true
      }, 5000)
    } else {
      win.close()
      alert('To‘lov havolasi topilmadi!')
    }
  } catch (err) {
    win.close()
    console.error('❌ Xatolik:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'To‘lovni boshlashda xatolik yuz berdi.')
  }
}


// Logout method

// const logout = async () => {
//   try {
//     const token = localStorage.getItem("token") || sessionStorage.getItem("token")
//     if (token) {
//       await axios.post("/auth/logout", {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
//     }
//   } catch (error) {
//     if (error.response?.status === 401) {
//       clearAuthStorage()
//     }
//   } finally {
//     clearAuthStorage()
//     window.location.href = "/register"
//   }
// }

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
.glass-slider {
  /* Flatten: remove borders/background/blur */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: none;
}
.glass-slider.is-active {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.glass-slider .slider-input {
  height: 32px;
  margin: 0;
  padding: 0;
  border-radius: 9999px;
  background-color: transparent;
}
.glass-slider .slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 30px;
  width: 40px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  border: 1px solid rgba(148, 163, 184, 0.38);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);
  margin-top: -9px;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.glass-slider.is-active .slider-input::-webkit-slider-thumb {
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.7) 0%, rgba(229, 231, 235, 0.45) 45%, rgba(209, 213, 219, 0.35) 100%);
  border-color: rgba(148, 163, 184, 0.38);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.26);
}
.glass-slider .slider-input::-moz-range-thumb {
  height: 30px;
  width: 40px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  border: 1px solid rgba(148, 163, 184, 0.38);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.glass-slider.is-active .slider-input::-moz-range-thumb {
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.7) 0%, rgba(229, 231, 235, 0.45) 45%, rgba(209, 213, 219, 0.35) 100%);
  border-color: rgba(148, 163, 184, 0.38);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.26);
}
.glass-slider .slider-input::-ms-thumb {
  height: 30px;
  width: 40px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  border: 1px solid rgba(148, 163, 184, 0.38);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.glass-slider.is-active .slider-input::-ms-thumb {
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.7) 0%, rgba(229, 231, 235, 0.45) 45%, rgba(209, 213, 219, 0.35) 100%);
  border-color: rgba(148, 163, 184, 0.38);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.26);
}
.glass-slider .slider-input::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 12px;
  border-radius: 9999px;
  background: linear-gradient(90deg,
    #2563eb 0%,
    #2563eb var(--aa-percent, 0%),
    #d4d7de var(--aa-percent, 0%),
    #d4d7de 100%
  );
}
.glass-slider .slider-input::-moz-range-track {
  height: 12px;
  border-radius: 9999px;
  background: linear-gradient(90deg,
    #2563eb 0%,
    #2563eb var(--aa-percent, 0%),
    #d4d7de var(--aa-percent, 0%),
    #d4d7de 100%
  );
}
.glass-slider .slider-input::-ms-track {
  height: 12px;
  border-radius: 9999px;
  background: linear-gradient(90deg,
    #2563eb 0%,
    #2563eb var(--aa-percent, 0%),
    #d4d7de var(--aa-percent, 0%),
    #d4d7de 100%
  );
  border-color: transparent;
  color: transparent;
}
.payment-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: 16px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}
.payment-option:focus-visible,
.payment-option:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.15);
}
.payment-option:active {
  transform: translateY(1px);
}
.payment-option img {
  pointer-events: none;
}
</style>
