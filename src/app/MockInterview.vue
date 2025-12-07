<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Real-time PHP/Laravel Interview
      </h1>
      <p class="text-gray-600 mb-6">Voice Interview with AI - O'zbek tilida</p>

      <!-- Candidate Info Form -->
      <div v-if="!isRecording && messages.length === 0" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Kandidat ma'lumotlari</h3>
        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="candidateInfo.name"
            type="text"
            placeholder="Ism familiya"
            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            v-model="candidateInfo.position"
            type="text"
            placeholder="Lavozim"
            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- Status Bar -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-4">
            <div>
              <span class="text-sm text-gray-600">Status: </span>
              <span
                class="font-semibold"
                :class="{
                  'text-green-600': status === 'recording',
                  'text-blue-600': status === 'connected',
                  'text-yellow-600': status === 'connecting',
                  'text-red-600': status.includes('error'),
                  'text-gray-600': status === 'idle',
                }"
              >
                {{ status }}
              </span>
            </div>
            <div v-if="isAISpeaking" class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-red-600 font-semibold">AI gapirmoqda</span>
            </div>
            <div v-if="isUserListening" class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-green-600 font-semibold">Siz gapiryapsiz (STT)</span>
            </div>
          </div>
          <div class="text-sm text-gray-600">
            Savollar: {{ questionCount }} | Javoblar: {{ answerCount }}
          </div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex gap-4 mb-6">
        <button
          @click="toggleInterview"
          :disabled="status === 'connecting' || (!candidateInfo.name && !isRecording)"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
        >
          <svg v-if="!isRecording" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isRecording ? "Intervyuni To'xtatish" : "Intervyuni Boshlash" }}
        </button>

        <button
          @click="manualSave"
          :disabled="messages.length === 0 || isSaving"
          class="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"
            />
          </svg>
          {{ isSaving ? "Saqlanmoqda..." : "Saqlash" }}
        </button>
      </div>

      <!-- Current Speaking / STT Preview -->
      <div v-if="currentTranscript" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div class="flex items-start gap-2">
          <div class="w-2 h-2 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
          <div>
            <p class="text-xs text-blue-600 font-semibold mb-1">
              {{ isAISpeaking ? "AI gapirmoqda..." : isUserListening ? "Siz gapiryapsiz..." : "Matn" }}
            </p>
            <p class="text-gray-700">{{ currentTranscript }}</p>
          </div>
        </div>
      </div>

      <!-- Messages Display -->
      <div class="bg-gray-50 rounded-lg p-6 h-96 overflow-y-auto" ref="messagesContainer">
        <div v-if="messages.length === 0" class="text-center text-gray-400 mt-20">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clip-rule="evenodd"
            />
          </svg>
          <p>"Intervyuni Boshlash" tugmasini bosing</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] p-4 rounded-lg"
              :class="msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow'"
            >
              <p class="text-xs opacity-75 mb-1">
                {{ msg.role === "user" ? "Siz" : "Intervyuer" }}
              </p>
              <p class="whitespace-pre-wrap">{{ msg.text }}</p>
              <p class="text-xs opacity-75 mt-2">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="saveSuccess" class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <p class="text-green-700 font-semibold">✓ Interview muvaffaqiyatli saqlandi!</p>
      </div>

      <div v-if="saveError" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
        <p class="text-red-700 font-semibold">✗ Xatolik: {{ saveError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, nextTick } from "vue";
  
  const GEMINI_API_KEY =
    import.meta.env.VITE_GEMINI_API_KEY ||
    "AIzaSyA7B3PoALp4-q1tJ8CRQplD1YHvvv9V4DU"; // prod’da .env dan ol
  
  const BACKEND_URL = "http://localhost:8000/api/interviews";
  
  // === STATE ===
  const messages = ref([]);
  const isRecording = ref(false);
  const status = ref("idle");
  const currentTranscript = ref("");
  const isSaving = ref(false);
  const saveSuccess = ref(false);
  const saveError = ref("");
  const candidateInfo = ref({
    name: "",
    position: "PHP/Laravel Developer",
  });
  
  const questionCount = ref(0);
  const answerCount = ref(0);
  const isAISpeaking = ref(false);
  const isUserListening = ref(false);
  const messagesContainer = ref(null);
  
  // STT holati (debug uchun)
  const speechSupported = ref(true);
  const sttStatus = ref("");
  
  // === INTERNAL ===
  let ws = null;
  let playbackCtx = null;
  let playbackTime = 0;
  let interviewStartTime = null;
  let interviewTimeoutId = null;
  let lastAssistantAt = 0;
  let lastUserAt = 0;
  let aiSpeakingTimeout = null;
  
  // browser SpeechRecognition
  let recognition = null;
  let recognitionFinalText = "";
  
  // === UTIL ===
  function formatTime(date) {
    return new Date(date).toLocaleTimeString("uz-UZ");
  }
  
  function scrollToBottom() {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  }
  
  // === MESSAGES ===
  function addMessage(role, text) {
    if (!text || text.trim().length === 0) return;
  
    const now = Date.now();
    const trimmed = text.trim();
    const list = [...messages.value];
    const last = list[list.length - 1];
  
    if (role === "assistant") {
      if (last && last.role === "assistant" && now - lastAssistantAt < 800) {
        last.text += " " + trimmed;
        list[list.length - 1] = last;
      } else {
        list.push({ role, text: trimmed, timestamp: new Date() });
        if (trimmed.includes("?")) {
          questionCount.value++;
          console.log("📊 Savol #" + questionCount.value);
        }
      }
      lastAssistantAt = now;
    } else if (role === "user") {
      if (last && last.role === "user" && now - lastUserAt < 1500) {
        last.text += " " + trimmed;
        list[list.length - 1] = last;
      } else {
        list.push({ role, text: trimmed, timestamp: new Date() });
        answerCount.value++;
        console.log("📊 Javob #" + answerCount.value);
      }
      lastUserAt = now;
    } else {
      list.push({ role, text: trimmed, timestamp: new Date() });
    }
  
    messages.value = list;
    scrollToBottom();
    checkInterviewCompletion();
  }
  
  function checkInterviewCompletion() {
    if (questionCount.value >= 5 && answerCount.value >= 5) {
      console.log("✅ Intervyu yakunlandi (5/5)!");
      setTimeout(() => {
        saveInterview(true);
        stopInterview();
      }, 2000);
    }
  }
  
  // === AUDIO PLAYBACK (Gemini output) ===
  function base64ToBytes(b64) {
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      arr[i] = raw.charCodeAt(i);
    }
    return arr;
  }
  
  async function bufferAudio(base64PCM) {
    if (!playbackCtx || !base64PCM) return;
  
    try {
      const bytes = base64ToBytes(base64PCM);
      if (!bytes.byteLength) return;
  
      const int16 = new Int16Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength / 2
      );
      const float32 = new Float32Array(int16.length);
  
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }
  
      const sampleRate = 24000;
      const audioBuffer = playbackCtx.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);
  
      const source = playbackCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(playbackCtx.destination);
  
      const now = playbackCtx.currentTime;
      const startAt = Math.max(now, playbackTime);
  
      isAISpeaking.value = true;
      if (aiSpeakingTimeout) clearTimeout(aiSpeakingTimeout);
      source.onended = () => {
        aiSpeakingTimeout = setTimeout(() => {
          isAISpeaking.value = false;
          // AI gapirib bo'ldi → endi userni eshitamiz
          startUserListening();
        }, 500);
      };
  
      source.start(startAt);
      playbackTime = startAt + audioBuffer.duration;
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  }
  
  // === BROWSER STT (UZ) ===
  function initRecognition() {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
  
    if (!SR) {
      console.warn("SpeechRecognition qo'llab-quvvatlanmaydi");
      speechSupported.value = false;
      sttStatus.value =
        "Brauzeringiz STT ni qo'llamaydi. Iltimos Chrome/Edge va HTTPS yoki localhost'dan foydalaning.";
      return null;
    }
  
    speechSupported.value = true;
  
    const rec = new SR();
    rec.lang = "uz-UZ"; // brauzer support bullying, lekin shunday turadi
    rec.interimResults = true;
    rec.continuous = false;
    return rec;
  }
  
  function startUserListening() {
    if (isUserListening.value) return;
  
    if (!recognition) {
      recognition = initRecognition();
      if (!recognition) return;
  
      recognition.onstart = () => {
        console.log("🎤 STT boshlandi");
        isUserListening.value = true;
        currentTranscript.value = "";
        recognitionFinalText = "";
        sttStatus.value = "STT ishga tushdi, gapiring...";
      };
  
      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) final += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (final) recognitionFinalText = final;
        currentTranscript.value = final || interim;
        sttStatus.value =
          "STT natija: " + (final || interim || "").substring(0, 80);
      };
  
      recognition.onerror = (e) => {
        console.error("STT error:", e);
        sttStatus.value = "STT xato: " + e.error;
      };
  
      recognition.onend = () => {
        console.log("🎤 STT tugadi:", recognitionFinalText);
        isUserListening.value = false;
  
        if (recognitionFinalText && recognitionFinalText.trim().length > 2) {
          const txt = recognitionFinalText.trim();
          addMessage("user", txt);
          sendUserTurnToGemini(txt);
        } else {
          sttStatus.value = "Hech narsa tanilmadi, yana harakat qilib ko'ring.";
        }
  
        recognitionFinalText = "";
        currentTranscript.value = "";
      };
    }
  
    recognitionFinalText = "";
    try {
      recognition.start();
    } catch (e) {
      console.warn("STT start error (ehtimol allaqachon ishlayapti):", e);
    }
  }
  
  // === GEMINI WS HANDLING ===
  async function handleWSMessage(event) {
    let text;
    if (typeof event.data === "string") {
      text = event.data;
    } else if (event.data instanceof Blob) {
      text = await event.data.text();
    } else if (event.data instanceof ArrayBuffer) {
      text = new TextDecoder("utf-8").decode(event.data);
    } else {
      return;
    }
  
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e);
      return;
    }
  
    if (data.setupComplete !== undefined) {
      console.log("✅ Gemini setupComplete");
      // birinchi bo'lib AI salomlashadi
      sendInitialPrompt();
      return;
    }
  
    if (data.serverContent) {
      const sc = data.serverContent;
  
      // AI javobi
      if (sc.modelTurn) {
        if (sc.modelTurn.parts) {
          let fullTxt = "";
          for (const part of sc.modelTurn.parts) {
            if (part.text) {
              fullTxt += part.text;
            }
            if (part.inlineData && part.inlineData.mimeType) {
              if (part.inlineData.mimeType.startsWith("audio/pcm")) {
                await bufferAudio(part.inlineData.data);
              }
            }
          }
          if (fullTxt) {
            currentTranscript.value = fullTxt;
          }
        }
  
        if (sc.modelTurn.turnComplete && currentTranscript.value) {
          addMessage("assistant", currentTranscript.value);
          currentTranscript.value = "";
        }
      }
  
      // inputTranscription’ni ishlatmaymiz (STTni o'zimiz qilamiz)
      return;
    }
  
    // fallback (odatda kerak bo'lmaydi)
    if (data.inputTranscription && data.inputTranscription.text) {
      addMessage("user", data.inputTranscription.text);
      return;
    }
    if (data.outputTranscription && data.outputTranscription.text) {
      addMessage("assistant", data.outputTranscription.text);
      return;
    }
  }
  
  // === USER → GEMINI (kandidat javobi) ===
  function sendUserTurnToGemini(text) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
    const payloadText = `Bu kandidatning navbatdagi javobi (o'zbek tilida, lotin yozuvida):
  
  "${text}"
  
  Iltimos, shu javob mazmuniga mos ravishda PHP/Laravel bo'yicha navbatdagi bitta savol bering. 
  Savolingiz juda qisqa bo'lsin (1–2 gap), va takroriy umumiy savollar bermang.`;
  
    ws.send(
      JSON.stringify({
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: payloadText }],
            },
          ],
          turnComplete: true,
        },
      })
    );
  }
  
  // birinchi trigger: “Intervyuni boshlang”
  function sendInitialPrompt() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    console.log("🚀 Boshlang'ich prompt yuborilmoqda...");
    ws.send(
      JSON.stringify({
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: "Intervyuni hozir boshlang." }],
            },
          ],
          turnComplete: true,
        },
      })
    );
  }
  
  // === INTERVIEW CONTROL ===
  async function startInterview() {
    if (!candidateInfo.value.name) {
      alert("Iltimos, ismingizni kiriting!");
      return;
    }
  
    status.value = "connecting";
    messages.value = [];
    currentTranscript.value = "";
    saveSuccess.value = false;
    saveError.value = "";
    questionCount.value = 0;
    answerCount.value = 0;
    isAISpeaking.value = false;
    isUserListening.value = false;
    interviewStartTime = new Date();
    lastAssistantAt = 0;
    lastUserAt = 0;
  
    const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(
      GEMINI_API_KEY
    )}`;
  
    ws = new WebSocket(WS_URL);
  
    ws.onopen = () => {
      console.log("🌐 WebSocket connected");
      status.value = "connected";
  
      playbackCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000,
        latencyHint: "interactive",
      });
      playbackCtx.resume();
      playbackTime = playbackCtx.currentTime;
  
      interviewTimeoutId = setTimeout(() => {
        console.log("⏰ 10 daqiqa tugadi");
        saveInterview(true);
        stopInterview();
      }, 10 * 60 * 1000);
  
      const systemText = `Siz professional PHP/Laravel bo'yicha SENIOR darajadagi texnik intervyuer rolidasiz.
  Kandidat: "${candidateInfo.value.name}".
  
  QOIDALAR:
  - FAQAT o'zbek tilida gapiring (lotin yozuvida).
  - Har bir javobingiz 1–2 gapdan oshmasin.
  - Tabiiy, muloyim ohangda gapiring.
  
  INTERVYUNI BOSHLASH:
  Intervyuni quyidagi gap bilan boshlang (buni o'zgartirmang):
  
  "Assalomu alaykum, ${candidateInfo.value.name}. PHP va Laravel bo'yicha texnik suhbatga xush kelibsiz. Iltimos, o'zingiz haqingizda qisqacha gapirib bering."
  
  SAVOL STRATEGIYASI:
  - Jami ANIQ 5 TA asosiy savol bering.
  - Har xabarda faqat 1 ta savol bering.
  - Mavzular: PHP, Laravel, MySQL, HTTP, REST API, dizayn patternlar, real project tajribasi.
  - HAR DOIM yangi savolni kandidatning oxirgi JAVOBIGA mos qilib bering.
  - Bir xil savolni takrorlamang, umumiy gap bilan cheklanib qolmang.
  
  USER JAVOBI:
  - Kandidatning har bir javobi sizga matn ko'rinishida keladi.
  - Siz shu matnga qarab, qisqa fikr bildirishingiz mumkin (1 gap), keyin navbatdagi savolni bering.
  
  YAKUN:
  - 5-savoldan keyin qisqacha xulosa bering.
  - Yakunda shunday deng:
  "Rahmat, ${candidateInfo.value.name}. Intervyu shu yerda yakunlandi. Sizga omad tilayman."`;
  
      ws.send(
        JSON.stringify({
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generationConfig: {
              responseModalities: ["AUDIO"],
              maxOutputTokens: 200,
              temperature: 0.7,
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Charon", // xohlasang boshqasiga almashtirasan
                  },
                },
              },
            },
            systemInstruction: {
              role: "user",
              parts: [{ text: systemText }],
            },
            // STTni GEMINI tomonda ishlatmaymiz – hammasini text bilan boshqaramiz
            realtimeInputConfig: {
              automaticActivityDetection: {},
            },
          },
        })
      );
    };
  
    ws.onmessage = handleWSMessage;
  
    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      status.value = "error: connection failed";
    };
  
    ws.onclose = (ev) => {
      console.log("🔌 WebSocket closed", ev.code, ev.reason);
      if (status.value !== "idle") {
        status.value = "disconnected";
      }
    };
  
    isRecording.value = true;
  }
  
  function stopInterview() {
    isRecording.value = false;
    status.value = "idle";
    isAISpeaking.value = false;
    isUserListening.value = false;
  
    if (interviewTimeoutId) {
      clearTimeout(interviewTimeoutId);
      interviewTimeoutId = null;
    }
    if (aiSpeakingTimeout) {
      clearTimeout(aiSpeakingTimeout);
      aiSpeakingTimeout = null;
    }
    if (recognition) {
      try {
        recognition.stop();
      } catch {}
    }
    if (playbackCtx) {
      playbackCtx.close();
      playbackCtx = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
    playbackTime = 0;
  }
  
  function toggleInterview() {
    if (!isRecording.value) startInterview();
    else stopInterview();
  }
  
  // === SAVE TO BACKEND ===
  async function saveInterview(autoSave = false) {
    if (messages.value.length === 0) {
      if (!autoSave) alert("Saqlash uchun xabarlar yo'q!");
      return;
    }
    if (isSaving.value) return;
  
    isSaving.value = true;
    saveError.value = "";
    saveSuccess.value = false;
  
    try {
      const duration = interviewStartTime
        ? Math.floor((new Date() - interviewStartTime) / 1000)
        : 0;
  
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: candidateInfo.value.name,
          position: candidateInfo.value.position,
          date: interviewStartTime.toISOString(),
          conversation: messages.value,
          duration,
          question_count: questionCount.value,
          answer_count: answerCount.value,
          status: "completed",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Server xatosi: " + response.status);
      }
  
      const data = await response.json();
      console.log("✅ Interview saqlandi:", data);
      saveSuccess.value = true;
      setTimeout(() => (saveSuccess.value = false), 5000);
    } catch (error) {
      console.error("❌ Save error:", error);
      saveError.value = error.message;
    } finally {
      isSaving.value = false;
    }
  }
  
  function manualSave() {
    saveInterview(false);
  }
  </script>
  

<style scoped>
.overflow-y-auto {
  scroll-behavior: smooth;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
