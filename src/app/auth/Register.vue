<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">

      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
        <h3>{{ token }}</h3>
        <h2 class="text-xl font-medium text-gray-800">{{ translations.tell_us_about_yourself }}</h2>
      </div>

      <div class="space-y-6">
        <!-- Name and Surname -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ translations.name }} {{ translations.surname }}
          </label>
          <input
              v-model="formData.firstName"
              type="text"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Ismoil Usmonov"
          >
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            {{ translations.phone }}
          </label>
          <input
              ref="phoneInput"
              id="phone"
              type="tel"
              v-model="formData.phone"
              class="w-full px-3 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="901234567"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ translations.Enter_your_resume_text }}
          </label>
          <input
              v-model="formData.resumeText"
              class="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="translations.resume_placeholder"
          >
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ translations.Upload_your_resume_file }}
        </label>
        <input
            ref="resumeInput"
            id="resumeUpload"
            type="file"
            class="hidden"
            @change="handleFileUpload"
        />
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        >
          <div class="flex flex-col items-center gap-4">
            <template v-if="hasResumeFile">
              <div class="flex items-center gap-2 text-green-600">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span class="font-medium text-sm sm:text-base text-green-700">{{ translations.resume_file_ready }}</span>
              </div>
              <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
<!--                <button-->
<!--                    type="button"-->
<!--                    class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"-->
<!--                    @click="viewResume"-->
<!--                >-->
<!--                  {{ translations.resume_view }}-->
<!--                </button>-->
                <button
                    type="button"
                    class="px-6 sm:px-8 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                    @click="openFileDialog"
                >
                  {{ translations.resume_change }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="text-sm text-gray-500">
                {{ translations.resume_upload_hint }}
              </div>
              <button
                  type="button"
                  class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                  @click="openFileDialog"
              >
                {{ translations.select_file }}
              </button>
            </template>
          </div>
        </div>
        <Offer v-model="acceptedOffer" :locale="locale" />

        <button
            @click="completeRegistration"
            :disabled="!isStepValid() || btnLoading || !acceptedOffer"
            :class="[
              'w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
              (!isStepValid() || btnLoading || !acceptedOffer)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
                >
            <span
                v-if="btnLoading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
          <span>{{ btnLoading ? translations.finish : translations.finish }}</span>
        </button>

      </div>
      <div class="flex items-stretch w-full max-w-md mx-auto gap-2 pt-6">
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
    </div>

  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import { useI18n } from '@/i18n-lite.js'
import {ref, reactive, computed, getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios"
import LoadingModal from "@/components/modal/LodaingModal.vue";
import { toast } from "vue3-toastify"
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import Offer from "@/components/Offer.vue";

const { proxy } = getCurrentInstance()
const { translations } = useI18n()
const router = useRouter()
const showLoading = ref(false)
const resumeInput = ref(null)

const formData = reactive({
  firstName: '',
  phone: '',
  resumeText: '',
  resumeFile: null,
  resumeFileUrl: null,
})


const selectedFile = ref(null)
const loading = ref(false)
const btnLoading = ref(false)
const error = ref("")
const hasResumeFile = computed(() => Boolean(formData.resumeFileUrl))
const acceptedOffer = ref(false)

// onMounted(() => {
//   const params = new URLSearchParams(window.location.search);
//   const chatId = params.get("chat_id");
//   const locale = params.get("locale") || "uz";

//   if (chatId) {
//     localStorage.setItem("chat_id", chatId);
//     formData.chat_id = chatId;
//   } else {
//     const savedChatId = localStorage.getItem("chat_id");
//     if (savedChatId) {
//       formData.chat_id = savedChatId;
//     }
//   }

//   if (locale) {
//     localStorage.setItem("locale", locale);
//   }
// });

const isSuccess = (resp) => {
  if (!resp) return false
  const s = resp.status
  return s === true || s === 'success' || s === 'ok'
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (formData.resumeFileUrl) {
    URL.revokeObjectURL(formData.resumeFileUrl)
  }

  selectedFile.value = file
  formData.resumeFile = file
  formData.resumeFileUrl = URL.createObjectURL(file) // preview uchun
  event.target.value = ''
}

const openFileDialog = () => {
  resumeInput.value?.click()
}

const viewResume = () => {
  if (formData.resumeFileUrl) {
    window.open(formData.resumeFileUrl, "_blank", "noopener")
  }
}

const uploadResume = async (token) => {
  if (!selectedFile.value) return

  const resumeForm = new FormData()
  resumeForm.append("title", formData.resumeText)
  resumeForm.append("file", selectedFile.value)

  await axios.post(proxy.$locale + "/v1/resumes", resumeForm, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

const touched = reactive({
  firstName: false,
})

const valid = reactive({
  get names() {
    return formData.firstName.trim().length > 0
  },
})

const isValid = computed(() => valid.names)

const isStepValid = () => {
  return (
      formData.firstName &&
      formData.phone
  )
}

const submitRegistration = async () => {
  touched.firstName = true
  error.value = ''
  showLoading.value = true

  if (!isValid.value || !isStepValid()) {
    return
  }

  loading.value = true
  const chatId = localStorage.getItem("chat_id");
  const locale = localStorage.getItem("locale");
  try {
    const { data } = await axios.post(proxy.$locale + '/auth/register', {
      first_name: formData.firstName,
      phone: formData.phone,
      resume_text: formData.resumeText,
      chat_id: chatId,
      language: locale,
    })

   // console.log('✅ Registration success:', data)

    if (!isSuccess(data)) {
      toast.error(
          locale.value === 'uz'
              ? "❗ Ushbu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan."
              : locale.value === 'ru'
                  ? "❗ Этот номер телефона уже зарегистрирован."
                  : "❗ This phone number is already registered."
      )
      showLoading.value = false
      loading.value = false
      return
    }

    if (isSuccess(data)) {
      const storage = localStorage
      storage.setItem('token', data.data.token)
      storage.setItem('user', JSON.stringify(data.data.user))
      storage.setItem('expires_at', data.data.expires_at)

      try {
        await uploadResume(data.data.token)
      } catch (e) {
        console.warn('Resume upload failed:', e)
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      await axios.post(
          proxy.$locale + "/v1/vacancy-matches/run",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
      )

      router.push({ name: 'home' })
      window.location.href = "/";
    } else {
      error.value = data.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    }
  } catch (e) {
    if (e.response?.status === 422) {
      toast.error(
          locale.value === 'uz'
              ? "❗ Ushbu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan."
              : locale.value === 'ru'
                  ? "❗ Этот номер телефона уже зарегистрирован."
                  : "❗ This phone number is already registered."
      )
    } else {
      toast.error(
          locale.value === 'uz'
              ? "❌ Server bilan bog‘lanishda xatolik yuz berdi."
              : locale.value === 'ru'
                  ? "❌ Произошла ошибка при подключении к серверу."
                  : "❌ An error occurred while connecting to the server."
      )
      error.value = e.response?.data?.message || 'Server bilan bog‘lanishda xatolik.'
    }
  } finally {
    showLoading.value = false
    loading.value = false
  }
}


const completeRegistration = async () => {
  touched.firstName = true
  error.value = ''

  if (!isValid.value || !isStepValid()) return

  btnLoading.value = true
  try {
    await submitRegistration()
  } catch (err) {
    console.error("❌ Error:", err)
  } finally {
    btnLoading.value = false
  }
}

const { locale } = useI18n()

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

const phoneInput = ref(null);

token = localStorage.getItem("token") || sessionStorage.getItem("token")
onMounted(async () => {
  showLoading.value = true

  // 1️⃣ URL paramlarni o‘qi
  const urlParams = new URLSearchParams(window.location.search)
  const chatIdFromUrl = urlParams.get("chat_id")
  const localeFromUrl = urlParams.get("locale") || "uz"

  // 2️⃣ LocalStorage ni to‘ldir
  if (chatIdFromUrl) localStorage.setItem("chat_id", chatIdFromUrl)
  if (localeFromUrl) localStorage.setItem("locale", localeFromUrl)

  const chatId = localStorage.getItem("chat_id")
  const token = localStorage.getItem("token")

  try {
    // 3️⃣ Token borligini tekshir
    if (token) {
      console.log("🔍 check-token so‘rov yuborilmoqda...")
      await axios.get(proxy.$locale + "/auth/check-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("✅ check-token javob oldi!")
      window.location.href = "/"
      return
    }

    // 4️⃣ Token yo‘q, lekin chat_id bor bo‘lsa login qil
    if (chatId) {
      console.log("💬 Chat ID orqali login:", chatId)
      const res = await axios.post(proxy.$locale + "/auth/chat-id-login", { chat_id: chatId })
      const TOKEN = res.data?.data?.token

      if (TOKEN) {
        console.log("✅ Chat ID orqali token olindi")
        localStorage.setItem("token", TOKEN)
        window.location.href = "/"
        return
      }
    }
  } catch (error) {
    console.error("❌ Token yoki chat login xatosi:", error)
    localStorage.removeItem("token")
  } finally {
    showLoading.value = false
  }

  // 5️⃣ Tel inputni sozlash (bu joyni oxiriga qo‘y)
  if (phoneInput.value) {
    const iti = intlTelInput(phoneInput.value, {
      initialCountry: "uz",
      onlyCountries: ["uz"],
      preferredCountries: ["uz"],
      allowDropdown: false,
      separateDialCode: true,
      nationalMode: false,
    })
    phoneInput.value.addEventListener("input", () => {
      const digits = phoneInput.value.value.replace(/\D/g, "")
      if (digits.length > 9) {
        iti.setNumber("+998" + digits.slice(0, 9))
      }
    })
  }
})

// onMounted(async () => {
//   showLoading.value = true

//   const urlParams = new URLSearchParams(window.location.search)
//   const chatIdFromUrl = urlParams.get("chat_id")

//   if (chatIdFromUrl) {
//     localStorage.setItem("chat_id", chatIdFromUrl)
//   }

//   const chatId = localStorage.getItem("chat_id")
//   const token = localStorage.getItem("token")

//   try {
//     if (token) {
//       await axios.get("/api/auth/check-token", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       window.location.href = "/"
//       return
//     }

//     if (chatId) {
//       console.log("Chat ID saqlandi:", chatId, token)
//       const res = await axios.post("/api/auth/chat-id-login", { chat_id: chatId })
//       const TOKEN = res.data?.data?.token

//       if (TOKEN) {
//         localStorage.setItem("token", TOKEN)
//         window.location.href = "/"
//         return
//       }
//     }
//   } catch (error) {
//     console.error("Chat ID orqali login xatosi:", error)
//     localStorage.removeItem("token") 
//   } finally {
//     showLoading.value = false
//   }
// })

//onMounted(() => {
//  if (phoneInput.value) {
//    const iti = intlTelInput(phoneInput.value, {
//      initialCountry: "uz",
//      onlyCountries: ["uz"],
//      preferredCountries: ["uz"],
//      allowDropdown: false,
//      separateDialCode: true,
//      nationalMode: false,
//    });

//    phoneInput.value.addEventListener("input", () => {
      // const digits = phoneInput.value.value.replace(/\D/g, '');
//       if (digits.length > 9) {
//         iti.setNumber("+998" + digits.slice(0, 9));
//       }
//     });
//   }
// });
</script>
