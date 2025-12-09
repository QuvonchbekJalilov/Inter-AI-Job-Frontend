<template>
  <div class="min-h-dvh bg-gradient-to-br from-slate-50 to-indigo-50">
    <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Suhbatlar
        </h1>
        <p class="mt-1 text-sm text-slate-600 sm:text-base">
          Kerakli suhbatni tanlang va tayyorgarlikni boshlang.
        </p>
      </div>

      <!-- Resume tekshirilyapti -->
      <div v-if="loadingResume" class="text-center py-20">
        <div class="animate-spin h-8 w-8 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-slate-600">Ma'lumotlar yuklanmoqda...</p>
      </div>

      <!-- Resume yo‘q -->
      <div v-else-if="!hasResume" class="text-center py-20">
        <h2 class="text-xl font-bold mb-2">Resume topilmadi</h2>
        <p class="text-slate-600 mb-6">Mock interview boshlash uchun resume yuklashingiz kerak.</p>

        <button @click="goResumeBuilder"
          class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:scale-95">
          Resume tayyorlash
        </button>
      </div>

      <!-- Agar resume bor bo‘lsa, Generate Interview button chiqadi -->
      <div v-else class="mb-8">
        <button v-if="pendingCount === 0" @click="generateInterview"
          class="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95">
          🎯 Yangi Mock Interview yaratish
        </button>

        <!-- Progress (ixtiyoriy) -->
        <div v-if="generating" class="mt-4">
          <div class="w-full bg-slate-200 rounded-full h-4">
            <div class="bg-indigo-600 h-4 rounded-full transition-all duration-300" :style="{ width: progress + '%' }">
            </div>
          </div>

          <p class="text-indigo-700 text-sm text-center mt-2">
            Savollar generatsiya qilinmoqda... {{ progress }}%
          </p>
        </div>
      </div>


      <!-- Interview cards -->
      <div v-if="cards.length > 0" class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="c in cards" :key="c.id"
          class="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">

          <!-- Left highlight bar -->
          <div class="absolute left-0 top-0 h-full w-1.5 bg-indigo-600"></div>

          <div class="p-4 pl-6 sm:p-6 sm:pl-7">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 sm:text-xs">
                  {{ c.tag }}
                </span>

                <span
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 sm:text-xs"
                  :class="c.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-amber-50 text-amber-700 ring-amber-200'">
                  {{ c.status === 'completed' ? "Yakunlangan" : "Kutilmoqda" }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M8 3v3M16 3v3M4.5 9.5h15M6.5 21h11A2 2 0 0 0 19.5 19V7A2 2 0 0 0 17.5 5h-11A2 2 0 0 0 4.5 7v12A2 2 0 0 0 6.5 21Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="font-medium whitespace-nowrap">{{ c.date }}</span>
              </div>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-slate-700 sm:mt-5 sm:text-[15px]">
              {{ c.text }}
            </p>

            <div class="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-4">
              <button v-if="c.status !== 'completed'"
                class="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] sm:h-12 sm:flex-1"
                @click="goPreparation(c)">
                Tayyorgarlik
              </button>

              <button v-else
                class="h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] sm:h-12 sm:flex-1"
                @click="goResult(c)">
                Natija
              </button>
            </div>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance()
const router = useRouter();

// STATE
const loadingResume = ref(true);
const hasResume = ref(false);
const cards = ref([]);
const pendingCount = ref(0);

const generating = ref(false);
const progress = ref(0);

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

// PAGE LOAD
onMounted(async () => {
  await checkResume();
  if (hasResume.value) {
    await fetchInterviews();
  }
});

// ===============================
// 1️⃣ Resume Eligibility Check
// ===============================
async function checkResume() {
  const res = await fetch(
    proxy.$locale + `/v1/check-resume-eligibility`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  );

  const data = await res.json();
  console.log('✅ Resume eligibility:', data);
  hasResume.value = data.eligible;
  loadingResume.value = false;
}

// ===============================
// 2️⃣ Fetch Mock Interviews
// ===============================
async function fetchInterviews() {
  const res = await fetch(
    proxy.$locale + `/v1/mock-interviews`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  );

  const data = await res.json();
  console.log('✅ Mock Interviews:', data);
  const list = data.mock_interview || [];

  pendingCount.value = list.filter(i => i.status !== "completed").length;

  cards.value = list.map(i => ({
    id: i.id,
    tag: i.interview_type === "general" ? "Oddiy suhbat" : "Texnik suhbat",
    date: new Date(i.created_at).toLocaleDateString(),
    text: i.title,
    status: i.status ?? "pending"
  }));
}

// ===============================
// 3️⃣ Generate Mock Interview
// ===============================
async function generateInterview() {
  generating.value = true;
  progress.value = 0;

  await fetch(
    proxy.$locale + `/v1/generate-questions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    }
  );

  // fake progress (agar realtime qo‘shmoqchi bo‘lsang ayt)
  const interval = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(interval);
      generating.value = false;
      fetchInterviews();
    }
  }, 400);
}

// ===============================
// Navigation buttons
// ===============================
function goPreparation(card) {
  router.push({ name: "preparation", params: { id: card.id } });
}

function goResult(card) {
  router.push({ name: "interviewResult", params: { id: card.id } });
}

function goResumeBuilder() {
  router.push({ name: "resume" });
}
</script>