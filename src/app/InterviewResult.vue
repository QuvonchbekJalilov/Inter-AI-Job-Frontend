<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Backend endpoint (sizda POST: http://localhost:8000/api/interviews)
 * Shu endpointdan GET /:id ishlaydi deb qabul qildim.
 * Agar sizda boshqa bo‘lsa, VITE_INTERVIEWS_URL ga yozib qo‘ying.
 */
const INTERVIEWS_URL =
    import.meta.env.VITE_INTERVIEWS_URL || "http://localhost:8000/api/interviews";

const route = useRoute();
const router = useRouter();

const props = defineProps({
    id: { type: [String, Number], default: null },
});

const interviewId = computed(() => props.id ?? route.params.id);

const loading = ref(true);
const error = ref("");
const interview = ref(null);

/* ----------------------------- helpers ----------------------------- */
function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleString("uz-UZ", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso || "-";
    }
}

function formatDuration(seconds) {
    const s = Number(seconds || 0);
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}m ${String(ss).padStart(2, "0")}s`;
}

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

function pickVerdict(score) {
    if (score >= 75) return { label: "Yaxshi", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    if (score >= 50) return { label: "O‘rtacha", cls: "bg-amber-50 text-amber-700 ring-amber-200" };
    return { label: "Yomon", cls: "bg-rose-50 text-rose-700 ring-rose-200" };
}

const KEYWORDS = [
    // PHP/Laravel
    "php", "laravel", "eloquent", "middleware", "service container", "di", "dependency injection",
    "composer", "artisan", "migration", "seeder", "factory", "queue", "job", "event", "listener",
    "cache", "redis", "horizon", "sanctum", "passport", "jwt", "csrf", "validation", "policy", "gate",
    "n+1", "eager loading", "repository", "service", "facade", "tdd", "phpunit",
    // DB / MySQL
    "mysql", "index", "transaction", "deadlock", "normaliz", "join", "explain", "query", "optimizer",
    // HTTP / API
    "http", "rest", "status code", "200", "201", "400", "401", "403", "404", "422", "500", "idempotent",
    // Security
    "sql injection", "xss", "csrf", "rate limit", "hash", "bcrypt", "argon",
];

function normalizeText(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function wordCount(s) {
    const t = normalizeText(s);
    if (!t) return 0;
    return t.split(" ").filter(Boolean).length;
}

function keywordHits(s) {
    const t = normalizeText(s);
    let hits = 0;
    for (const k of KEYWORDS) {
        if (t.includes(k)) hits++;
    }
    return hits;
}

function hasStructure(s) {
    const t = normalizeText(s);
    const markers = ["birinchi", "ikkinchi", "uchinchi", "keyin", "so‘ng", "chunki", "sababi", "xulosa", "masalan", "real loyiha", "amaliy"];
    return markers.some(m => t.includes(m));
}

function containsExample(s) {
    const t = normalizeText(s);
    return t.includes("masalan") || t.includes("real") || t.includes("misol");
}

function scoreAnswer(answerText) {
    const wc = wordCount(answerText);
    const hits = keywordHits(answerText);
    const structured = hasStructure(answerText);
    const example = containsExample(answerText);

    // 0..25: Aniqlik (juda qisqa bo‘lsa pasayadi; strukturali bo‘lsa oshadi)
    const clarity =
        clamp(
            (wc >= 18 ? 14 : wc >= 10 ? 10 : wc >= 5 ? 6 : 2) +
            (structured ? 8 : 0) +
            (answerText?.includes(".") || answerText?.includes(";") ? 3 : 0),
            0,
            25
        );

    // 0..25: Texnik chuqurlik (keywordlar)
    const depth = clamp(hits * 3.5, 0, 25);

    // 0..25: Amaliy misol / tajriba
    const practice = clamp((example ? 14 : 2) + (wc >= 35 ? 9 : wc >= 20 ? 6 : 0), 0, 25);

    // 0..25: To‘liqlik (gapni tugatganmi, juda qisqa emasmi)
    const completeness = clamp((wc >= 45 ? 25 : wc >= 30 ? 20 : wc >= 18 ? 14 : wc >= 10 ? 9 : 4), 0, 25);

    const total = Math.round(clarity + depth + practice + completeness);

    const positives = [];
    const improvements = [];

    if (clarity >= 18) positives.push("Javob aniq va mantiqan tuzilgan.");
    if (depth >= 16) positives.push("Texnik terminlar va tushunchalar yaxshi ishlatilgan.");
    if (practice >= 16) positives.push("Amaliy misol / tajriba keltirilgan.");
    if (completeness >= 18) positives.push("Javob yetarlicha to‘liq.");

    if (clarity < 14) improvements.push("Javobni 1–2 punktga bo‘lib, aniqroq tuzing (birinchi/ikkinchi...).");
    if (depth < 12) improvements.push("Ko‘proq texnik detal qo‘shing (terminlar, mexanizm, sabab).");
    if (practice < 12) improvements.push("Bitta real misol keltiring (masalan, qaysi loyihada qanday yechdingiz).");
    if (completeness < 14) improvements.push("Javob juda qisqa — asosiy nuqtalarni to‘ldiring.");

    return {
        total,
        criteria: {
            clarity: Math.round(clarity),
            depth: Math.round(depth),
            practice: Math.round(practice),
            completeness: Math.round(completeness),
        },
        positives: positives.length ? positives : ["Javobni yaxshilash uchun kichik tuzatishlar yetarli."],
        improvements: improvements.length ? improvements : ["Shu darajada davom eting — juda yaxshi!"],
    };
}

/* ----------------------- build Q/A pairs ----------------------- */
const qaList = computed(() => {
    const conv = interview.value?.conversation || [];
    if (!Array.isArray(conv) || conv.length === 0) return [];

    // Savol deb: assistant va ichida "?" bor — deb olamiz
    const questions = [];
    for (let i = 0; i < conv.length; i++) {
        const m = conv[i];
        if (m?.role === "assistant" && typeof m?.text === "string" && m.text.includes("?")) {
            // keyingi user xabarni javob deb olamiz
            let answer = null;
            for (let j = i + 1; j < conv.length; j++) {
                if (conv[j]?.role === "user") {
                    answer = conv[j];
                    break;
                }
                // agar yana assistant kelsa, javob yo‘q deb qoldiramiz
                if (conv[j]?.role === "assistant") break;
            }
            questions.push({
                q: m.text.trim(),
                a: answer?.text?.trim() || "",
                qAt: m.timestamp,
                aAt: answer?.timestamp,
            });
        }
    }

    return questions.map((item, idx) => {
        const analysis = scoreAnswer(item.a);
        const verdict = pickVerdict(analysis.total);
        return {
            index: idx + 1,
            ...item,
            analysis,
            verdict,
        };
    });
});

const overall = computed(() => {
    const list = qaList.value;
    if (!list.length) {
        return {
            score: 0,
            verdict: pickVerdict(0),
            bars: [],
            criteriaAvg: { clarity: 0, depth: 0, practice: 0, completeness: 0 },
            strengths: [],
            weaknesses: [],
        };
    }

    const avg = Math.round(list.reduce((s, x) => s + x.analysis.total, 0) / list.length);

    const criteriaSum = list.reduce(
        (acc, x) => {
            acc.clarity += x.analysis.criteria.clarity;
            acc.depth += x.analysis.criteria.depth;
            acc.practice += x.analysis.criteria.practice;
            acc.completeness += x.analysis.criteria.completeness;
            return acc;
        },
        { clarity: 0, depth: 0, practice: 0, completeness: 0 }
    );

    const criteriaAvg = {
        clarity: Math.round(criteriaSum.clarity / list.length),
        depth: Math.round(criteriaSum.depth / list.length),
        practice: Math.round(criteriaSum.practice / list.length),
        completeness: Math.round(criteriaSum.completeness / list.length),
    };

    const criteriaPairs = [
        { key: "clarity", name: "Aniqlik", val: criteriaAvg.clarity },
        { key: "depth", name: "Chuqurlik", val: criteriaAvg.depth },
        { key: "practice", name: "Amaliyot", val: criteriaAvg.practice },
        { key: "completeness", name: "To‘liqlik", val: criteriaAvg.completeness },
    ].sort((a, b) => b.val - a.val);

    const strengths = criteriaPairs.slice(0, 2).map(x => x.name);
    const weaknesses = criteriaPairs.slice(-2).reverse().map(x => x.name);

    return {
        score: avg,
        verdict: pickVerdict(avg),
        bars: list.map(x => x.analysis.total),
        criteriaAvg,
        strengths,
        weaknesses,
    };
});

/* ----------------------------- fetching ----------------------------- */
async function fetchInterview() {
    loading.value = true;
    error.value = "";

    try {
        const token = getToken();
        const res = await fetch(`${INTERVIEWS_URL}/${encodeURIComponent(interviewId.value)}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!res.ok) throw new Error(`Server xatosi: ${res.status}`);

        const data = await res.json();
        // ba'zi backendlar {data: ...} qaytaradi
        interview.value = data?.data ?? data;
    } catch (e) {
        error.value = e?.message || "Noma’lum xatolik";
        // fallback demo (backend tayyor bo‘lmaganda UI ko‘rinsin)
        interview.value = {
            candidate_name: "Kandidat",
            position: "PHP/Laravel Developer",
            date: new Date().toISOString(),
            duration: 780,
            question_count: 5,
            answer_count: 5,
            status: "completed",
            conversation: [
                { role: "assistant", text: "Laravel service container nima va qachon ishlatasiz?", timestamp: new Date() },
                { role: "user", text: "Service container dependency injection uchun ishlaydi. Masalan, interface binding qilib, controllerda constructor orqali inject qilaman. Real loyihada payment providerlarni interface orqali almashtirishda ishlatganman.", timestamp: new Date() },
                { role: "assistant", text: "Eloquent’da N+1 muammosi nima, qanday yechasiz?", timestamp: new Date() },
                { role: "user", text: "N+1 bu relationlarni alohida query qilib ketishi. eager loading bilan yechaman: with() ishlataman. Shuningdek, queryni optimize qilish va kerakli columnlarni select qilish.", timestamp: new Date() },
                { role: "assistant", text: "HTTP status code’lardan 401 va 403 farqi nima?", timestamp: new Date() },
                { role: "user", text: "401 authentication yo‘q yoki token noto‘g‘ri. 403 esa auth bor, lekin ruxsat yo‘q. Masalan policy/gate bilan tekshiriladi.", timestamp: new Date() },
                { role: "assistant", text: "MySQL index qachon foydali, qachon zarar bo‘lishi mumkin?", timestamp: new Date() },
                { role: "user", text: "Index selectni tezlashtiradi, lekin insert/update sekinlashadi. Katta jadvalda WHERE va JOIN bo‘lsa foydali. EXPLAIN bilan tekshiraman.", timestamp: new Date() },
                { role: "assistant", text: "Queue va job’larni qachon ishlatasiz?", timestamp: new Date() },
                { role: "user", text: "Og‘ir ishlarni fon rejimga chiqaraman: email, report, import. Redis driver, Horizon bilan monitoring qilaman. Retry/backoff va failed jobsni nazorat qilaman.", timestamp: new Date() },
            ],
        };
    } finally {
        loading.value = false;
    }
}

onMounted(fetchInterview);

/* ----------------------------- UI utils ----------------------------- */
const ringStyle = computed(() => {
    const s = clamp(overall.value.score, 0, 100);
    return {
        background: `conic-gradient(from 180deg, rgba(16,185,129,0.9) ${s}%, rgba(226,232,240,1) 0)`,
    };
});

function goBack() {
    router.back();
}
</script>

<template>
    <div class="min-h-dvh bg-gradient-to-br from-slate-50 to-indigo-50">
        <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
            <!-- Top bar -->
            <div class="mb-6 flex items-center justify-between gap-3">
                <button type="button" @click="goBack"
                    class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-black/5 transition hover:bg-slate-50">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    Orqaga
                </button>

                <div class="text-right">
                    <p class="text-xs text-slate-500">Interview ID</p>
                    <p class="text-sm font-semibold text-slate-900">#{{ interviewId }}</p>
                </div>
            </div>

            <!-- Loading / Error -->
            <div v-if="loading" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div class="animate-pulse space-y-4">
                    <div class="h-6 w-56 rounded bg-slate-200"></div>
                    <div class="h-4 w-80 rounded bg-slate-200"></div>
                    <div class="grid gap-4 sm:grid-cols-3">
                        <div class="h-28 rounded-xl bg-slate-200"></div>
                        <div class="h-28 rounded-xl bg-slate-200"></div>
                        <div class="h-28 rounded-xl bg-slate-200"></div>
                    </div>
                </div>
            </div>

            <div v-else class="space-y-6">
                <div v-if="error" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <p class="font-semibold">Eslatma:</p>
                    <p class="text-sm mt-1">
                        Backenddan ma’lumot olinmadi, demo natija ko‘rsatilyapti. ({{ error }})
                    </p>
                </div>

                <!-- Header card -->
                <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div class="min-w-0">
                            <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                Intervyu natijasi
                            </h1>
                            <p class="mt-2 text-sm text-slate-600 sm:text-base">
                                {{ interview?.candidate_name || "Kandidat" }} · {{ interview?.position || "-" }}
                            </p>
                            <div class="mt-4 flex flex-wrap items-center gap-2">
                                <span
                                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1"
                                    :class="overall.verdict.cls">
                                    Umumiy baho: {{ overall.verdict.label }}
                                </span>
                                <span
                                    class="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                    Sana: {{ formatDate(interview?.date) }}
                                </span>
                                <span
                                    class="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                    Davomiylik: {{ formatDuration(interview?.duration) }}
                                </span>
                                <span
                                    class="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                    Savollar: {{ qaList.length || interview?.question_count || 0 }}
                                </span>
                            </div>
                        </div>

                        <!-- Score ring -->
                        <div class="flex items-center gap-5">
                            <div class="relative grid h-24 w-24 place-items-center rounded-full p-[6px]"
                                :style="ringStyle">
                                <div class="grid h-full w-full place-items-center rounded-full bg-white">
                                    <div class="text-center">
                                        <p class="text-xl font-extrabold text-slate-900">{{ overall.score }}</p>
                                        <p class="text-[10px] font-semibold text-slate-500 -mt-1">/ 100</p>
                                    </div>
                                </div>
                            </div>

                            <div class="min-w-[180px]">
                                <p class="text-sm font-semibold text-slate-900">Kuchli tomonlar</p>
                                <p class="text-sm text-slate-600">
                                    {{ overall.strengths.join(" · ") || "—" }}
                                </p>
                                <p class="mt-2 text-sm font-semibold text-slate-900">Yaxshilash kerak</p>
                                <p class="text-sm text-slate-600">
                                    {{ overall.weaknesses.join(" · ") || "—" }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Analytics cards -->
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <p class="text-xs font-semibold text-slate-500">Aniqlik</p>
                        <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ overall.criteriaAvg.clarity }}</p>
                        <div class="mt-3 h-2 w-full rounded-full bg-slate-100">
                            <div class="h-2 rounded-full bg-indigo-600"
                                :style="{ width: overall.criteriaAvg.clarity + '%' }"></div>
                        </div>
                    </div>

                    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <p class="text-xs font-semibold text-slate-500">Texnik chuqurlik</p>
                        <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ overall.criteriaAvg.depth }}</p>
                        <div class="mt-3 h-2 w-full rounded-full bg-slate-100">
                            <div class="h-2 rounded-full bg-indigo-600"
                                :style="{ width: overall.criteriaAvg.depth + '%' }"></div>
                        </div>
                    </div>

                    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <p class="text-xs font-semibold text-slate-500">Amaliyot</p>
                        <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ overall.criteriaAvg.practice }}</p>
                        <div class="mt-3 h-2 w-full rounded-full bg-slate-100">
                            <div class="h-2 rounded-full bg-indigo-600"
                                :style="{ width: overall.criteriaAvg.practice + '%' }"></div>
                        </div>
                    </div>

                    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <p class="text-xs font-semibold text-slate-500">To‘liqlik</p>
                        <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ overall.criteriaAvg.completeness }}
                        </p>
                        <div class="mt-3 h-2 w-full rounded-full bg-slate-100">
                            <div class="h-2 rounded-full bg-indigo-600"
                                :style="{ width: overall.criteriaAvg.completeness + '%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- Score bars -->
                <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <div class="flex items-center justify-between gap-3">
                        <h2 class="text-lg font-extrabold text-slate-900">Savollar bo‘yicha ball</h2>
                        <p class="text-xs text-slate-500">0–100</p>
                    </div>

                    <div v-if="qaList.length" class="mt-5 grid gap-3">
                        <div v-for="item in qaList" :key="item.index" class="flex items-center gap-3">
                            <div class="w-10 text-sm font-semibold text-slate-700">#{{ item.index }}</div>
                            <div class="relative h-3 w-full rounded-full bg-slate-100">
                                <div class="h-3 rounded-full bg-slate-900"
                                    :style="{ width: clamp(item.analysis.total, 0, 100) + '%' }"></div>
                            </div>
                            <div class="w-14 text-right text-sm font-bold text-slate-900">{{ item.analysis.total }}
                            </div>
                        </div>
                    </div>

                    <div v-else class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                        Savol-javoblar topilmadi. (conversation bo‘sh yoki savol belgisi “?” topilmadi)
                    </div>
                </div>

                <!-- Per question analysis -->
                <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h2 class="text-lg font-extrabold text-slate-900">Savol va javoblar tahlili</h2>
                    <p class="mt-1 text-sm text-slate-600">
                        Har bir javob: aniqlik, chuqurlik, amaliyot va to‘liqlik bo‘yicha baholandi.
                    </p>

                    <div class="mt-5 space-y-4" v-if="qaList.length">
                        <details v-for="item in qaList" :key="item.index"
                            class="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5" open>
                            <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="text-sm font-extrabold text-slate-900">Savol #{{ item.index
                                            }}</span>
                                        <span
                                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1"
                                            :class="item.verdict.cls">
                                            {{ item.verdict.label }}
                                        </span>
                                        <span
                                            class="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                            Ball: {{ item.analysis.total }}/100
                                        </span>
                                    </div>
                                    <p class="mt-2 text-sm text-slate-700 line-clamp-2">
                                        {{ item.q }}
                                    </p>
                                </div>

                                <div class="shrink-0">
                                    <svg class="h-5 w-5 text-slate-500 transition group-open:rotate-180"
                                        viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </summary>

                            <div class="mt-4 grid gap-4 lg:grid-cols-2">
                                <!-- Q/A -->
                                <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p class="text-xs font-semibold text-slate-500">Savol</p>
                                    <p class="mt-1 text-sm text-slate-900 whitespace-pre-wrap">{{ item.q }}</p>

                                    <p class="mt-4 text-xs font-semibold text-slate-500">Javob</p>
                                    <p class="mt-1 text-sm text-slate-900 whitespace-pre-wrap">
                                        {{ item.a || "Javob topilmadi." }}
                                    </p>
                                </div>

                                <!-- Criteria -->
                                <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                                    <p class="text-sm font-extrabold text-slate-900">Kriteriyalar</p>

                                    <div class="mt-3 space-y-3">
                                        <div>
                                            <div
                                                class="flex items-center justify-between text-xs font-semibold text-slate-600">
                                                <span>Aniqlik</span><span>{{ item.analysis.criteria.clarity }}/25</span>
                                            </div>
                                            <div class="mt-1 h-2 rounded-full bg-slate-100">
                                                <div class="h-2 rounded-full bg-indigo-600"
                                                    :style="{ width: (item.analysis.criteria.clarity / 25 * 100) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div
                                                class="flex items-center justify-between text-xs font-semibold text-slate-600">
                                                <span>Texnik chuqurlik</span><span>{{ item.analysis.criteria.depth
                                                    }}/25</span>
                                            </div>
                                            <div class="mt-1 h-2 rounded-full bg-slate-100">
                                                <div class="h-2 rounded-full bg-indigo-600"
                                                    :style="{ width: (item.analysis.criteria.depth / 25 * 100) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div
                                                class="flex items-center justify-between text-xs font-semibold text-slate-600">
                                                <span>Amaliyot</span><span>{{ item.analysis.criteria.practice
                                                    }}/25</span>
                                            </div>
                                            <div class="mt-1 h-2 rounded-full bg-slate-100">
                                                <div class="h-2 rounded-full bg-indigo-600"
                                                    :style="{ width: (item.analysis.criteria.practice / 25 * 100) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div
                                                class="flex items-center justify-between text-xs font-semibold text-slate-600">
                                                <span>To‘liqlik</span><span>{{ item.analysis.criteria.completeness
                                                    }}/25</span>
                                            </div>
                                            <div class="mt-1 h-2 rounded-full bg-slate-100">
                                                <div class="h-2 rounded-full bg-indigo-600"
                                                    :style="{ width: (item.analysis.criteria.completeness / 25 * 100) + '%' }">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div class="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                                            <p class="text-xs font-extrabold text-emerald-800">Yaxshi jihatlar</p>
                                            <ul class="mt-2 list-disc pl-4 text-xs text-emerald-800">
                                                <li v-for="(p, i) in item.analysis.positives" :key="i">{{ p }}</li>
                                            </ul>
                                        </div>
                                        <div class="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                                            <p class="text-xs font-extrabold text-amber-800">Yaxshilash</p>
                                            <ul class="mt-2 list-disc pl-4 text-xs text-amber-800">
                                                <li v-for="(t, i) in item.analysis.improvements" :key="i">{{ t }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>

                    <div v-else class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                        Tahlil qilish uchun savol-javoblar topilmadi.
                    </div>
                </div>

                <!-- Footer note -->
                <div class="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-black/5">
                    <p class="font-semibold text-slate-800">Eslatma</p>
                    <p class="mt-1">
                        Bu baholash hozircha front-end heuristikasi asosida. Agar xohlasangiz,
                        backendda AI scoring (Gemini/OpenAI) bilan aniqroq “to‘g‘ri/noto‘g‘ri” tahlil qilib,
                        shu UI’ga real baholarni ulab beramiz.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* line-clamp utility bo‘lmasa ham ishlasin */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>