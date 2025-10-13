<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">
      <div class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{translations.Upload_your_resume}}</h2>
        <div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{translations.name}} {{translations.surname}}</label>
              <input
                  v-model="formData.firstName"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Ismoil Usmonov"
              >
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Telefon raqam
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
          </div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Enter_your_resume_text}}</label>
          <input
              v-model="formData.resumeText"
              class="w-full px-3 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Php Laravel Vue.js Full stack developer"
          >
        </div>

<!--        <div class="text-center text-gray-500">{{translations.or}}</div>-->

        <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Upload_your_resume_file}}</label>
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        >
          <input
              id="resumeUpload"
              type="file"
              class="hidden"
              @change="handleFileUpload"
          />
          <label for="resumeUpload" class="block cursor-pointer">
            <span class="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              {{translations.select_file}}
            </span>
          </label>
        </div>

        <div class="flex gap-3">
          <button
              @click="completeRegistration"
              :disabled="!isStepValid() || btnLoading"
              :class="[
                'flex-1 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
                (!isStepValid() || btnLoading)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              ]"
          >
            <span v-if="btnLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ btnLoading ? translations.loading : translations.finish }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, ref, onMounted } from "vue";
import { useI18n } from "@/i18n-lite.js";
import axios from "axios";
import intlTelInput from "intl-tel-input";

const { proxy } = getCurrentInstance();
const { translations } = useI18n();

const showLoading = ref(false);
const selectedFile = ref(null);
const btnLoading = ref(false);
const error = ref("");

const formData = reactive({
  chat_id: null,
  resumeText: "",
  firstName: "",
  phone: "",
  select_file: "",
});

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadResume = async () => {
  const resumeForm = new FormData();
  resumeForm.append("title", formData.resumeText);
  resumeForm.append("chat_id", formData.chat_id);

  if (selectedFile.value) {
    resumeForm.append("file", selectedFile.value);
  }

  return axios.post(proxy.$locale + "/v1/demo/resume/store", resumeForm, {
    headers: { Accept: "application/json" },
  });
};

const completeRegistration = async () => {
  try {
    btnLoading.value = true;
    error.value = "";

    const res = await uploadResume();
    console.log("res", res);
    window.location.href = "/demo-vacancy";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message ?? "Server xatosi");
    error.value = err.response?.data?.message || "Server xatosi";
  } finally {
    btnLoading.value = false;
  }
};

const isStepValid = () => {
  return formData.resumeText?.trim().length > 0 || selectedFile.value;
};
const chatId = computed(() => {});
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get("chat_id");
  const locale = params.get("locale") || "uz";

  if (chatId) {
    localStorage.setItem("chat_id", chatId);
    formData.chat_id = chatId;
    console.log("Chat ID saqlandi:", chatId);
  } else {
    const savedChatId = localStorage.getItem("chat_id");
    if (savedChatId) {
      formData.chat_id = savedChatId;
      console.log("Chat ID localStorage’dan olindi:", savedChatId);
    }
  }

  if (locale) {
    localStorage.setItem("locale", locale);
  }
});
const phoneInput = ref(null);

onMounted(() => {
  if (phoneInput.value) {
    const iti = intlTelInput(phoneInput.value, {
      initialCountry: "uz",
      onlyCountries: ["uz"],
      preferredCountries: ["uz"],
      allowDropdown: false,
      separateDialCode: true,
      nationalMode: false,
    });

    phoneInput.value.addEventListener("input", () => {
      const digits = phoneInput.value.value.replace(/\D/g, '');
      if (digits.length > 9) {
        iti.setNumber("+998" + digits.slice(0, 9));
      }
    });
  }
});
</script>

<style scoped>

</style>