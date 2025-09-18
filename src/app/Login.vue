<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white text-black rounded-2xl shadow-lg p-7">
      <!-- Logo -->
      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-3" />
        <h1 class="text-xl font-semibold">{{translations.login_in}}</h1>
        <p class="text-sm text-gray-500">{{translations.enter_your_email_and_password}}</p>
      </div>

      <!-- Error banner -->
      <div v-if="error" class="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">{{translations.email}}</label>
          <input
              id="email"
              v-model.trim="form.email"
              type="email"
              inputmode="email"
              autocomplete="email"
              required
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="name@company.com"
          />
          <p v-if="touched.email && !valid.email" class="mt-1 text-xs text-red-600">
            Yaroqli email kiriting
          </p>
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">{{ translations.password }}</label>
            <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="forgotPassword"
            >
              {{translations.forgot_password}}
            </button>
          </div>

          <div class="relative">
            <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="form.password"
                autocomplete="current-password"
                required
                minlength="6"
                class="w-full px-3 py-2 pr-10 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="********"
                @blur="touched.password = true"
            />
            <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                @click="showPassword = !showPassword"
                aria-label="Parolni ko'rsatish"
            >
              <!-- Simple eye icon -->
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 5 12 5s8.577 2.51 9.964 6.678c.07.214.07.45 0 .644C20.577 16.49 16.64 19 12 19S3.423 16.49 2.036 12.322z"/>
                <circle cx="12" cy="12" r="3" stroke-width="1.8" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M3 3l18 18M10.584 10.59A3 3 0 0113.41 13.41M9.88 5.1A8.966 8.966 0 0112 5c4.64 0 8.577 2.51 9.964 6.678.07.214.07.45 0 .644-.46 1.404-1.24 2.642-2.26 3.66M6.62 6.62C4.88 7.54 3.45 9.03 2.036 12.322a1.012 1.012 0 000 .644C3.423 16.49 7.36 19 12 19c1.33 0 2.6-.2 3.78-.58"/>
              </svg>
            </button>
          </div>
          <p v-if="touched.password && !valid.password" class="mt-1 text-xs text-red-600">
            Parol kamida 6 ta belgi bo‘lsin
          </p>
        </div>
        <!-- Submit -->
        <button
            type="submit"
            :disabled="!isValid || loading"
            :class="[
            'w-full py-3 rounded-lg font-medium transition-colors',
            (!isValid || loading)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          <span v-if="!loading">{{ translations.login }}</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            {{translations.sending}}
          </span>
        </button>
      </form>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500">
       {{translations.dont_have_an_account}}
        <RouterLink to="/register" class="text-blue-600 hover:underline">{{translations.register}}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
  remember: true,
});

const touched = reactive({
  email: false,
  password: false,
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const valid = reactive({
  get email() {
    // oddiy tekshiruv
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  },
  get password() {
    return form.password.length >= 6;
  },
});

const isValid = computed(() => valid.email && valid.password);

function forgotPassword() {
  // kerakli route yoki modal
  router.push({ name: "ForgotPassword" });
}

async function onSubmit() {
  touched.email = true;
  touched.password = true;
  error.value = "";

  if (!isValid.value) return;

  loading.value = true;
  try {
    // Bu yerda real login API chaqirasiz:
    // const res = await api.post('/auth/login', { email: form.email, password: form.password });
    // token saqlash, remember bo‘lsa localStorage, aks holda sessionStorage:
    // (demo maqsadida 800ms kutish)
    await new Promise(r => setTimeout(r, 800));

    const fakeToken = "demo-token";
    (form.remember ? localStorage : sessionStorage).setItem("token", fakeToken);

    // muvaffaqiyatli bo‘lsa dashboard/profile ga o‘tkazamiz
    router.push({ name: "Profile" });
  } catch (e) {
    error.value = "Email yoki parol noto‘g‘ri.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ixtiyoriy: autofill fonini neytral qilish (Chrome) */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #f3f4f6 inset !important;
}
</style>
