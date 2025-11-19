<template>
    <div class="min-h-screen bg-[#f2f2f2]">
        <Header />
        <VacancyShow :show="loadingSkeleton" />

        <div v-if="vacancy" class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
            <!-- Title and Company -->
            <div>
                <div class="flex items-start justify-between mb-2">
                  <h3 class="mb-2 mt-5 text-xl leading-tight font-medium">{{ vacancy.title }}</h3>
                  <!-- Telegram icon -->
                  <!-- <img
                      src="/icons/telegram.svg"
                      alt="Telegram"
                      class="w-6 h-6 mt-5 object-contain ml-2 shrink-0"
                  /> -->
                </div>
                <p class="text-gray-700 font-medium">{{ vacancy.company }}</p>
                <!-- <p class="text-gray-500">Source: {{ vacancy.source_id }}</p> -->
            </div>

            <!-- Description -->
            <div>
                <h2 class="text-xl font-medium mb-2">{{ translations.Job_Description }}</h2>
                <p class="text-gray-600 whitespace-pre-line">
                    {{ vacancy.description }}
                </p>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 border rounded-lg">
                    <p class="text-sm text-gray-500">{{ translations.Contact }}</p>
                    <div class="font-medium space-y-1">
                        <p v-for="phone in vacancy.contact?.phones" :key="phone">{{ phone }}</p>
                      <div>
                        <!-- Agar kategoriya 'Logistics and Supply Chain' bo'lsa -->
                        <div v-if="vacancy.category === 'Logistics and Supply Chain' && vacancy.apply_url">
                          <a
                              :href="vacancy.apply_url"
                              target="_blank"
                              class="text-blue-600 hover:underline"
                          >
                            @{{ translations.connection }}
                          </a>
                        </div>

                        <!-- Aks holda (boshqa kategoriyalar uchun) -->
                        <div v-else-if="vacancy.contact?.telegram_usernames?.length">
                          <p v-for="user in vacancy.contact.telegram_usernames" :key="user">
                            <a
                                :href="`https://t.me/${user.replace('@', '')}`"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                            >
                              {{ user }}
                            </a>
                          </p>
                        </div>
                      </div>
                      <p class="text-sm text-gray-500">{{ translations.manba2 }}</p>
                    </div>
                </div>

               
            </div>

<!--            &lt;!&ndash; Telegram Links &ndash;&gt;-->
<!--            <div class="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2">-->
<!--                -->
<!--                <div v-if="vacancy.target_message_id">-->
<!--                    📥 <a :href="vacancy.target_message_id" target="_blank" class="text-blue-600 hover:underline">-->
<!--                        Shared via Inter-AI Bot-->
<!--                    </a>-->
<!--                </div>-->
<!--            </div>-->

            <!-- Action -->
            <!-- <div>
                <button @click="openTelegramLink"
                    class="block w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-center">
                    {{ translations.all_information }}
                </button>
            </div> -->
            <div class="text-left text-gray-400 text-xs">{{ translations.all_information }} @inter_ai_uz</div>
        </div>
    </div>
    <LoadingModal :show="showLoading" />
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import LoadingModal from "@/components/modal/LodaingModal.vue"
import VacancyShow from "@/components/loading/VacancyShow.vue"
import { useI18n } from "@/i18n-lite"

const { proxy } = getCurrentInstance()
const { translations } = useI18n()

const route = useRoute()
const id = route.params.id
const vacancy = ref(null)
const showLoading = ref(false)
const loadingSkeleton = ref(true)

const fetchVacancy = async () => {
    try {
        showLoading.value = true
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        const res = await fetch(proxy.$locale + `/v1/telegram/vacancies/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const data = await res.json()
        if (data.success) {
            vacancy.value = data.data
        }
    } catch (e) {
        console.error("❌ API error:", e.message)
    } finally {
        showLoading.value = false
        loadingSkeleton.value = false
    }
}

const openTelegramLink = () => {
    if (vacancy.value?.target_message_id) {
        window.open(vacancy.value.target_message_id, "_blank")
    } else if (vacancy.value?.source_message_id) {
        window.open(vacancy.value.source_message_id, "_blank")
    } else {
        alert("Telegram link not available")
    }
}

onMounted(fetchVacancy)
</script>
