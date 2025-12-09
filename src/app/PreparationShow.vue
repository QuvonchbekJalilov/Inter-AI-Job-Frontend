<script setup>
import { computed, onBeforeUnmount, onMounted, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

const prepId = computed(() => route.params.id);

// =========================================
// 🟦 BACKEND QUESTIONS
// =========================================
const questions = ref([]);

// =========================================
// UI state
// =========================================
const idx = ref(0);
const state = ref("loading"); // loading | asking | ready | listening | done
const countdown = ref(0);
const countdownTimer = ref(null);

const questionText = computed(() => questions.value[idx.value]?.question || "");
const progressText = computed(() => `${idx.value + 1} / ${questions.value.length}`);
const isAsking = computed(() => state.value === "asking");
const isListening = computed(() => state.value === "listening");

/** speech synthesis (question audio) */
const ttsSupported = computed(
    () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window
);

/** speech recognition (user answer) */
const sttSupported = computed(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition)
);
let recognition = null;
const liveTranscript = ref("");
const finalTranscript = ref("");

/** answers store */
const answers = ref([]);

/** audio-reactive animation */
const micAllowed = ref(true);
const micLevel = ref(0);     // 0..1 (real mic)
const ttsLevel = ref(0.25);  // 0..1 (fake for question)
const visualLevel = computed(() => {
    if (isListening.value) return micLevel.value;
    if (isAsking.value) return ttsLevel.value;
    return 0.15;
});

/** WebAudio for mic analyser */
let audioCtx = null;
let analyser = null;
let micStream = null;
let rafId = null;

/* -------------------- utils -------------------- */
function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

function stopCountdown() {
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
    }
    countdown.value = 0;
}

/* ========================================================
   🟦 BACKENDDAN QUESTIONS YUKLASH
=========================================================== */
async function loadQuestions() {
    state.value = "loading";

    const res = await fetch(
        proxy.$locale + `/v1/mock-interviews/${prepId.value}/questions`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            }
        }
    );

    const data = await res.json();

    questions.value = (data.questions || []).sort((a, b) => a.order - b.order);

    if (questions.value.length === 0) {
        alert("Savollar topilmadi");
        router.push({ name: "conversations" });
        return;
    }

    idx.value = 0;
    state.value = "asking";

    askCurrentQuestion();
}

/**
 * 10s ichida user bosmasa -> nextQuestion()
 */
function startCountdown(seconds = 10) {
    stopCountdown();
    countdown.value = seconds;

    countdownTimer.value = setInterval(() => {
        countdown.value -= 1;

        if (countdown.value <= 0) {
            stopCountdown();

            if (state.value === "ready") {
                answers.value.push({
                    qIndex: idx.value,
                    question: questionText.value,
                    answer: "",
                    autoStopped: true,
                    at: new Date().toISOString(),
                });
                nextQuestion();
            }
        }
    }, 1000);
}

/* -------------------- TTS -------------------- */
function stopTTS() {
    try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch { }
}

function startFakeTTSLevel() {
    let t = 0;
    const tick = () => {
        if (!isAsking.value) return;
        t += 0.08;
        const base = 0.22 + 0.10 * Math.sin(t) + 0.06 * Math.sin(t * 2.3);
        const jitter = (Math.random() - 0.5) * 0.05;
        ttsLevel.value = clamp(base + jitter, 0.08, 0.55);
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function speakQuestion(text) {
    return new Promise((resolve) => {
        if (!ttsSupported.value) {
            setTimeout(resolve, 1200);
            return;
        }

        stopTTS();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "uz-UZ";
        utter.rate = 1.0;
        utter.pitch = 1.0;

        utter.onend = () => resolve();
        utter.onerror = () => resolve();

        const doSpeak = () => {
            try {
                window.speechSynthesis.speak(utter);
            } catch {
                resolve();
            }
        };

        if (window.speechSynthesis.getVoices()?.length) doSpeak();
        else {
            window.speechSynthesis.onvoiceschanged = () => doSpeak();
            doSpeak();
        }
    });
}

/* -------------------- Mic analyser -------------------- */
async function startMicAnalyser() {
    try {
        micAllowed.value = true;
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(micStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);

        const loop = () => {
            if (!analyser) return;

            analyser.getByteTimeDomainData(data);

            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                const v = (data[i] - 128) / 128;
                sum += v * v;
            }
            const rms = Math.sqrt(sum / data.length);

            micLevel.value = clamp(micLevel.value * 0.85 + rms * 1.6, 0, 1);
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
    } catch {
        micAllowed.value = false;
        micLevel.value = 0;
    }
}

function stopMicAnalyser() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    micLevel.value = 0;

    if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
        micStream = null;
    }
    if (audioCtx) {
        audioCtx.close().catch(() => { });
        audioCtx = null;
    }
    analyser = null;
}

/* -------------------- STT (answer) -------------------- */
function initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = "uz-UZ";
    return rec;
}

async function startListening() {
    if (!sttSupported.value) {
        answers.value.push({
            qIndex: idx.value,
            question: questionText.value,
            answer: "",
            autoStopped: true,
            at: new Date().toISOString(),
        });
        nextQuestion();
        return;
    }

    stopCountdown();
    state.value = "listening";
    liveTranscript.value = "";
    finalTranscript.value = "";

    await startMicAnalyser();

    if (!recognition) {
        recognition = initRecognition();
        if (!recognition) return;

        recognition.onresult = (event) => {
            let interim = "";
            let final = "";

            for (let i = 0; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) final += res[0].transcript + " ";
                else interim += res[0].transcript;
            }

            if (final) finalTranscript.value += final;
            liveTranscript.value = (finalTranscript.value + interim).trim();
        };

        recognition.onerror = () => stopListening(true);
        recognition.onend = () => {
            if (state.value === "listening") stopListening(true);
        };
    }

    try {
        recognition.start();
    } catch { }
}

async function stopListening(auto = false) {
    if (state.value !== "listening") return;

    try { recognition?.stop(); } catch { }

    stopMicAnalyser();

    const answerText = (liveTranscript.value || "").trim();

    answers.value.push({
        qIndex: idx.value,
        question: questionText.value,
        answer: answerText,
        autoStopped: auto,
        at: new Date().toISOString(),
    });

    await saveAnswerToBackend(answerData);


    liveTranscript.value = "";
    finalTranscript.value = "";

    nextQuestion();
}

/* -------------------- flow -------------------- */
async function askCurrentQuestion() {
    stopCountdown();
    stopMicAnalyser();
    stopTTS();

    state.value = "asking";
    startFakeTTSLevel();

    await speakQuestion(questionText.value);

    state.value = "ready";
    startCountdown(10);
}

function nextQuestion() {
    stopCountdown();
    stopMicAnalyser();
    stopTTS();

    if (idx.value >= questions.value.length - 1) {
        state.value = "done";
        return;
    }

    idx.value += 1;
    askCurrentQuestion();
}

function handleMainButton() {
    if (state.value === "ready") startListening();
    else if (state.value === "listening") stopListening(false);
}

/* -------------------- lifecycle -------------------- */
onMounted(() => {
    loadQuestions();
});

onBeforeUnmount(() => {
    stopCountdown();
    stopMicAnalyser();
    stopTTS();
    try { recognition?.stop(); } catch { }
});


/** ===============================
 *  🟦 BACKENDGA JAVOB YUBORISH
 *  =============================== */
 async function saveAnswerToBackend(answerObj) {
    try {
        const body = new FormData();
        body.append("question_id", questions.value[answerObj.qIndex].id);
        body.append("answer_text", answerObj.answer || "");
        body.append("duration_seconds", answerObj.duration_seconds || 0);
        body.append("skipped", answerObj.autoStopped ? 1 : 0);

        const res = await fetch(
            proxy.$locale + `/v1/mock-interviews/${prepId.value}/answer`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );

        return await res.json();
    } catch (e) {
        console.error("Answer save failed:", e);
        return null;
    }
}

</script>

<template>
    <div class="min-h-dvh bg-gradient-to-br from-slate-50 to-indigo-50">
        <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
            <!-- header -->
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        Tayyorgarlik
                    </h1>
                    <p class="mt-1 text-sm text-slate-600">
                        ID: <span class="font-semibold text-slate-800">#{{ prepId }}</span>
                        · Savol:
                        <span class="font-semibold text-slate-800">{{ progressText }}</span>
                    </p>
                </div>

                <button type="button" @click="router.back()"
                    class="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-black/5 hover:bg-slate-50">
                    Orqaga
                </button>
            </div>

            <!-- main card -->
            <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                <!-- question -->
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="text-xs font-semibold text-slate-500">Savol</p>
                        <p class="mt-2 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                            {{ questionText }}
                        </p>
                    </div>

                    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1" :class="isAsking
                        ? 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                        : isListening
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : state === 'ready'
                                ? 'bg-amber-50 text-amber-700 ring-amber-200'
                                : 'bg-slate-50 text-slate-700 ring-slate-200'">
                        <template v-if="isAsking">Savol berilmoqda</template>
                        <template v-else-if="isListening">Siz gapiryapsiz</template>
                        <template v-else-if="state === 'ready'">Tayyor</template>
                        <template v-else>Yakun</template>
                    </span>
                </div>

                <!-- center animation -->
                <div class="my-7 grid place-items-center">
                    <div class="relative h-44 w-44 sm:h-52 sm:w-52" :style="{ '--lvl': visualLevel.toFixed(3) }">
                        <div class="blob blob-a"></div>
                        <div class="blob blob-b"></div>
                        <div class="blob blob-c"></div>

                        <div class="center-circle">
                            <!-- mic icon -->
                            <svg v-if="!isListening" class="h-9 w-9 text-white/95" viewBox="0 0 24 24" fill="none"
                                aria-hidden="true">
                                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>

                            <svg v-else class="h-9 w-9 text-white/95" viewBox="0 0 24 24" fill="none"
                                aria-hidden="true">
                                <path d="M9 9v2a3 3 0 0 0 6 0V9" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <p class="mt-4 text-center text-sm text-slate-600">
                        <template v-if="isAsking">Savol audio tarzda o‘qilmoqda…</template>
                        <template v-else-if="state === 'ready'">10 soniya ichida tugmani bosing, aks holda keyingi
                            savolga o‘tadi.</template>
                        <template v-else-if="isListening">Gapiring — javob matn ko‘rinishida yoziladi.</template>
                        <template v-else>Yakunlandi.</template>
                    </p>
                </div>

                <!-- transcript -->
                <div v-if="isListening" class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p class="text-xs font-semibold text-slate-500">Sizning javobingiz (live)</p>
                    <p class="mt-2 whitespace-pre-wrap text-sm text-slate-900">
                        {{ liveTranscript || "..." }}
                    </p>
                    <p v-if="!micAllowed" class="mt-3 text-xs font-semibold text-rose-700">
                        Mikrofon ruxsati yo‘q (HTTPS yoki browser settings tekshiring).
                    </p>
                </div>

                <!-- warnings -->
                <div v-if="!ttsSupported || !sttSupported"
                    class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <p class="text-sm font-semibold">Eslatma</p>
                    <ul class="mt-1 list-disc pl-5 text-sm">
                        <li v-if="!ttsSupported">Savol audio (SpeechSynthesis) brauzeringizda ishlamasligi mumkin.</li>
                        <li v-if="!sttSupported">Ovozdan matnga (SpeechRecognition) qo‘llab-quvvatlanmadi — Chrome/Edge
                            tavsiya.</li>
                    </ul>
                </div>

                <!-- ✅ single bottom button (with countdown inside) -->
                <div class="mt-6">
                    <button type="button"
                        class="h-12 w-full rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="state === 'asking' || state === 'done'" @click="handleMainButton">
                        <template v-if="state === 'ready'">
                            Javob berish
                            <span class="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-extrabold">
                                {{ countdown }}s
                            </span>
                        </template>

                        <template v-else-if="state === 'listening'">
                            Javobni yakunlash
                        </template>

                        <template v-else-if="state === 'done'">
                            Tugadi
                        </template>

                        <template v-else>
                            ...
                        </template>
                    </button>
                </div>
            </div>

            <!-- done screen -->
            <div v-if="state === 'done'" class="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-lg font-extrabold text-slate-900">Tayyorgarlik yakunlandi ✅</h2>
                        <p class="mt-1 text-sm text-slate-600">
                            Javoblar soni: <span class="font-semibold text-slate-900">{{ answers.length }}</span>
                        </p>
                    </div>

                    <button type="button"
                        class="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
                        @click="router.push({ name: 'conversations' })">
                        Suhbatlar ro‘yxatiga
                    </button>
                </div>

                <div class="mt-5 space-y-3">
                    <details v-for="(a, i) in answers" :key="i" class="rounded-xl border border-slate-200 p-4" open>
                        <summary class="cursor-pointer text-sm font-bold text-slate-900">
                            #{{ i + 1 }} — {{ a.question }}
                            <span v-if="!a.answer" class="ml-2 text-xs font-semibold text-rose-600">(Javob
                                berilmadi)</span>
                        </summary>
                        <p class="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                            {{ a.answer || "Javob berilmadi." }}
                        </p>
                    </details>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ---------- Blob animation (audio reactive) ---------- */
:root {
    --lvl: 0.2;
    /* 0..1 */
}

.blob {
    position: absolute;
    inset: 0;
    border-radius: 48% 52% 62% 38% / 44% 46% 54% 56%;
    will-change: transform, border-radius, opacity;
}

.blob-a {
    background: rgba(99, 102, 241, 0.12);
    transform: scale(calc(1 + var(--lvl) * 0.55));
    animation: morphA 4.2s ease-in-out infinite;
}

.blob-b {
    inset: 12px;
    background: rgba(99, 102, 241, 0.22);
    transform: scale(calc(1 + var(--lvl) * 0.42));
    animation: morphB 3.6s ease-in-out infinite reverse;
}

.blob-c {
    inset: 26px;
    background: rgba(99, 102, 241, 0.36);
    transform: scale(calc(1 + var(--lvl) * 0.32));
    animation: morphC 3.0s ease-in-out infinite;
}

.center-circle {
    position: absolute;
    inset: 0;
    margin: auto;
    height: 74px;
    width: 74px;
    border-radius: 9999px;
    display: grid;
    place-items: center;
    background: rgba(79, 70, 229, 0.95);
    box-shadow: 0 18px 40px rgba(79, 70, 229, 0.28), inset 0 0 0 8px rgba(255, 255, 255, 0.18);
    transform: scale(calc(1 + var(--lvl) * 0.20));
    transition: transform 80ms linear;
}

@keyframes morphA {

    0%,
    100% {
        border-radius: 48% 52% 62% 38% / 44% 46% 54% 56%;
        rotate: 0deg;
    }

    50% {
        border-radius: 56% 44% 38% 62% / 52% 58% 42% 48%;
        rotate: 14deg;
    }
}

@keyframes morphB {

    0%,
    100% {
        border-radius: 58% 42% 55% 45% / 44% 54% 46% 56%;
        rotate: 0deg;
    }

    50% {
        border-radius: 42% 58% 45% 55% / 60% 40% 60% 40%;
        rotate: -12deg;
    }
}

@keyframes morphC {

    0%,
    100% {
        border-radius: 46% 54% 44% 56% / 52% 44% 56% 48%;
        rotate: 0deg;
    }

    50% {
        border-radius: 62% 38% 58% 42% / 44% 62% 38% 56%;
        rotate: 10deg;
    }
}
</style>