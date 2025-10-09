<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">
      <div class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{translations.Upload_your_resume}}</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Enter_your_resume_text}}</label>
          <input
              v-model="formData.resumeText"
              class="w-full px-3 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Php Laravel Vue.js Full stack developer"
          >
        </div>

        <div class="text-center text-gray-500">{{translations.or}}</div>

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
            <svg
                class="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="text-gray-500 mb-4">{{translations.dadafhocts}}</p>
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
import { computed, getCurrentInstance, reactive, ref } from "vue";
import { useI18n } from "@/i18n-lite.js";
import axios from "axios";

const { proxy } = getCurrentInstance();
const { translations } = useI18n();

const showLoading = ref(false);
const selectedFile = ref(null);
const btnLoading = ref(false);
const error = ref("");

const formData = reactive({
  chat_id: 1234567,
  resumeText: "",
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const completeRegistration = async () => {
  try {
    btnLoading.value = true;
    error.value = "";

    const res = await uploadResume();
    console.log('res', res)
    window.location('/demo/vacancies');
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message ?? 'Server xatosi');
    error.value = err.response?.data?.message || "Server xatosi";
  } finally {
    btnLoading.value = false;
  }
};

const isStepValid = () => {
  return formData.resumeText?.trim().length > 0 || selectedFile.value;
};
</script>

<style scoped>

</style>