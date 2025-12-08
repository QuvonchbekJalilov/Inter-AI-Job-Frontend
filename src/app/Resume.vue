<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-24">
    <!-- Wizard header -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between mb-6">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          @click="goBackHome"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ translations.back }}</span>
        </button>

        <div v-if="mode === 'preview'">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1 text-xs border rounded-full text-gray-600 hover:bg-gray-100"
              @click="downloadPdf('ru')"
            >
              RU PDF
            </button>
            <button
              type="button"
              class="px-3 py-1 text-xs border rounded-full text-gray-600 hover:bg-gray-100"
              @click="downloadPdf('en')"
            >
              EN PDF
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="mode === 'wizard'"
        class="bg-white rounded-2xl shadow p-6 sm:p-8 mb-4"
      >
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 5h6M9 9h6M9 13h3M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
            </svg>
          </div>
          <h1 class="text-lg font-semibold text-gray-900 mb-1">
            {{ translations.resume_create_title }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ translations.Step }} {{ step }} {{ translations.from }} 8
          </p>
        </div>

        <!-- Progress bar -->
        <div class="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            class="h-1 bg-blue-600 rounded-full transition-all duration-300"
            :style="{ width: `${(step / 8) * 100}%` }"
          />
        </div>

        <!-- Steps content -->
        <div class="space-y-6">
          <!-- Step 1: Personal -->
          <section v-if="step === 1" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step1_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step1_subtitle }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
              <!-- Photo upload -->
              <div class="flex flex-col items-center md:items-start gap-3">
                <div
                  class="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200"
                >
                  <img
                    v-if="form.personal.photo_path"
                    :src="photoUrl"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-gray-400 text-xs text-center px-2">
                    {{ translations.resume_photo_label }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    @click="triggerPhotoInput"
                  >
                    {{ translations.resume_change_photo }}
                  </button>
                  <button
                    v-if="form.personal.photo_path"
                    type="button"
                    class="px-3 py-1.5 text-xs rounded-lg text-red-500 hover:bg-red-50"
                    @click="removePhoto"
                  >
                    {{ translations.resume_delete_photo }}
                  </button>
                  <p class="text-xs text-gray-400 max-w-[160px]">
                    {{ translations.resume_photo_hint }}
                  </p>
                </div>
                <input
                  ref="photoInput"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handlePhotoChange"
                />
              </div>

              <!-- Personal fields -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.name }} *</label>
                    <input
                      v-model="form.personal.first_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.surname }} *</label>
                    <input
                      v-model="form.personal.last_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.email }} *</label>
                    <input
                      v-model="form.personal.email"
                      type="email"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.phone }} *</label>
                    <input
                      v-model="form.personal.phone"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_city }} *</label>
                    <input
                      v-model="form.personal.city"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_country }}</label>
                    <input
                      v-model="form.personal.country"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="space-y-2 pt-2 border-t border-gray-100">
                  <p class="text-xs font-medium text-gray-600">
                    {{ translations.resume_prof_links_title }}
                  </p>
                  <input
                    v-model="form.personal.linkedin_url"
                    type="text"
                    :placeholder="translations.resume_linkedin_placeholder"
                    class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <input
                    v-model="form.personal.github_url"
                    type="text"
                    :placeholder="translations.resume_github_placeholder"
                    class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <input
                    v-model="form.personal.portfolio_url"
                    type="text"
                    :placeholder="translations.resume_portfolio_placeholder"
                    class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900">
              <span class="font-semibold">{{ translations.resume_tip_label }}</span>
              <span class="ml-1">
                {{ translations.resume_step1_tip }}
              </span>
            </div>
          </section>

          <!-- Step 2: Job preferences -->
          <section v-else-if="step === 2" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step2_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step2_subtitle }}
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step2_desired_position_label }} *</label>
                <input
                  v-model="form.job.desired_position"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step2_desired_position_placeholder"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step2_desired_salary_label }}</label>
                <input
                  v-model="form.job.desired_salary"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step2_desired_salary_placeholder"
                />
                <p class="mt-1 text-xs text-gray-400">
                  {{ translations.resume_step2_desired_salary_hint }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step2_citizenship_label }} *</label>
                <input
                  v-model="form.job.citizenship"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Uzbekistan"
                />
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-3">
                <h3 class="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <span class="text-purple-500">▣</span> {{ translations.resume_step2_employment_label }} *
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    v-for="opt in employmentOptions"
                    :key="opt.value"
                    class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      :value="opt.value"
                      v-model="form.job.employment_types"
                    />
                    <span class="text-gray-700">{{ translations[opt.labelKey] }}</span>
                  </label>
                </div>
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-3">
                <h3 class="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <span class="text-blue-500">🕒</span> {{ translations.resume_step2_schedule_label }} *
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    v-for="opt in scheduleOptions"
                    :key="opt.value"
                    class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      :value="opt.value"
                      v-model="form.job.work_schedules"
                    />
                    <span class="text-gray-700">{{ translations[opt.labelKey] }}</span>
                  </label>
                </div>
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-2">
                <h3 class="text-xs font-semibold text-gray-700">{{ translations.resume_step2_readiness_label }}</h3>
                <div class="space-y-2 text-sm text-gray-700">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="form.job.ready_to_relocate"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ translations.resume_step2_ready_to_relocate }}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="form.job.ready_for_trips"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ translations.resume_step2_ready_for_trips }}</span>
                  </label>
                </div>
              </div>

              <div class="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900">
                <span class="font-semibold">{{ translations.resume_tip_label }}</span>
                <span class="ml-1">
                  {{ translations.resume_step2_tip }}
                </span>
              </div>
            </div>
          </section>

          <!-- Step 3: Summary -->
          <section v-else-if="step === 3" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step3_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step3_subtitle }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step3_summary_label }} *</label>
              <textarea
                v-model="form.summary.text"
                rows="6"
                class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="translations.resume_step3_summary_placeholder"
              ></textarea>
              <p class="text-xs text-gray-400">
                {{ summaryLength }} {{ translations.resume_step3_characters_suffix }}
              </p>
            </div>

            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 space-y-1">
              <p class="font-semibold mb-1">{{ translations.resume_step3_examples_title }}</p>
              <ul class="list-disc pl-4 space-y-1">
                <li>{{ translations.resume_step3_example1 }}</li>
                <li>{{ translations.resume_step3_example2 }}</li>
                <li>{{ translations.resume_step3_example3 }}</li>
              </ul>
            </div>

            <div class="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-900">
              <span class="font-semibold">{{ translations.resume_tip_label }}</span>
              <span class="ml-1">
                {{ translations.resume_step3_tip }}
              </span>
            </div>
          </section>

          <!-- Step 4: Experiences -->
          <section v-else-if="step === 4" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step4_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step4_subtitle }}
              </p>
            </div>

            <div v-if="form.experiences.length" class="space-y-3">
              <div
                v-for="(exp, index) in form.experiences"
                :key="index"
                class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-start"
              >
                <div>
                  <p class="font-medium text-sm text-gray-900">
                    {{ exp.position }} <span v-if="exp.company" class="text-gray-500">• {{ exp.company }}</span>
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ exp.location }}
                    <span v-if="exp.start_date"> • {{ exp.start_date }}</span>
                    <span v-if="exp.end_date"> – {{ exp.end_date }}</span>
                    <span v-else-if="exp.is_current"> – {{ translations.resume_step4_currently_working_suffix }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <button class="text-blue-600 hover:underline" @click="editExperience(index)">{{ translations.resume_edit }}</button>
                  <button class="text-red-500 hover:underline" @click="removeExperience(index)">{{ translations.resume_delete }}</button>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 space-y-4">
              <h3 class="text-xs font-semibold text-gray-700">{{ translations.resume_step4_add_block_title }}</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step4_position_label }} *</label>
                  <input
                    v-model="experienceForm.position"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step4_company_label }} *</label>
                  <input
                    v-model="experienceForm.company"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_location }}</label>
                <input
                  v-model="experienceForm.location"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_start_date_label }} *</label>
                  <input
                    v-model="experienceForm.start_date"
                    type="month"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_end_date_label }}</label>
                  <input
                    v-model="experienceForm.end_date"
                    type="month"
                    :disabled="experienceForm.is_current"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <label class="mt-1 flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      v-model="experienceForm.is_current"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {{ translations.resume_step4_currently_working_checkbox }}
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step4_responsibilities_label }}</label>
                <textarea
                  v-model="experienceForm.description"
                  rows="3"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step4_responsibilities_placeholder"
                ></textarea>
              </div>

              <button
                type="button"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-medium hover:bg-black"
                @click="saveExperience"
              >
                {{ editingExperienceIndex === null ? translations.resume_step4_add_button : translations.resume_step4_save_button }}
              </button>
            </div>
          </section>

          <!-- Step 5: Education -->
          <section v-else-if="step === 5" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step5_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step5_subtitle }}
              </p>
            </div>

            <div v-if="form.educations.length" class="space-y-3">
              <div
                v-for="(edu, index) in form.educations"
                :key="index"
                class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-start"
              >
                <div>
                  <p class="font-medium text-sm text-gray-900">
                    {{ edu.degree }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ edu.institution }}<span v-if="edu.location"> • {{ edu.location }}</span>
                  </p>
                  <p class="text-xs text-gray-500">
                    <span v-if="edu.start_date">{{ edu.start_date }}</span>
                    <span v-if="edu.end_date"> – {{ edu.end_date }}</span>
                    <span v-else-if="edu.is_current"> – по настоящее время</span>
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <button class="text-blue-600 hover:underline" @click="editEducation(index)">Изменить</button>
                  <button class="text-red-500 hover:underline" @click="removeEducation(index)">Удалить</button>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 space-y-4">
              <h3 class="text-xs font-semibold text-gray-700">Добавить образование</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step5_degree_label }} *</label>
                  <input
                    v-model="educationForm.degree"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step5_institution_label }} *</label>
                  <input
                    v-model="educationForm.institution"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_location }}</label>
                <input
                  v-model="educationForm.location"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_start_date_label }} *</label>
                  <input
                    v-model="educationForm.start_date"
                    type="month"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_end_date_label }}</label>
                  <input
                    v-model="educationForm.end_date"
                    type="month"
                    :disabled="educationForm.is_current"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <label class="mt-1 flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      v-model="educationForm.is_current"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {{ translations.resume_step5_currently_studying_checkbox }}
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step5_gpa_label }}</label>
                <textarea
                  v-model="educationForm.extra_info"
                  rows="3"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step5_gpa_placeholder"
                ></textarea>
              </div>

              <button
                type="button"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-medium hover:bg-black"
                @click="saveEducation"
              >
                {{ editingEducationIndex === null ? translations.resume_step5_add_button : translations.resume_step5_save_button }}
              </button>
            </div>
          </section>

          <!-- Step 6: Skills -->
          <section v-else-if="step === 6" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step6_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step6_subtitle }}
              </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
              <h3 class="text-xs font-semibold text-gray-700">{{ translations.resume_step6_add_skill_title }}</h3>
              <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  v-model="newSkillName"
                  type="text"
                  class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step6_skill_placeholder"
                  @keyup.enter.prevent="addSkill"
                />
                <select
                  v-model="newSkillCategory"
                  class="w-full sm:w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option
                    v-for="(opt, index) in skillCategories"
                    :key="opt?.id || index"
                    :value="opt?.id"
                  >
                    {{ opt && translations[opt.labelKey] }}
                  </option>
                </select>
                <button
                  type="button"
                  class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900"
                  @click="addSkill"
                >
                  {{ translations.resume_step6_add_skill_button }}
                </button>
              </div>
              <p class="text-xs text-gray-400">
                {{ translations.resume_step6_hint_add }}
              </p>
            </div>

            <!-- Skills list (user-entered) -->
            <div
              v-if="form.skills.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="(skill, index) in form.skills"
                :key="index"
                class="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs"
              >
                <span>{{ skill.name }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {{
                    translations['resume_skill_level_' + normalizeSkillLevel(skill.level)]
                      || normalizeSkillLevel(skill.level)
                  }}
                </span>
                <button
                  type="button"
                  class="ml-1 text-blue-500 hover:text-blue-700"
                  @click="removeSkill(skill)"
                >
                  ×
                </button>
              </span>
            </div>

            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 space-y-1">
              <p class="font-semibold mb-1">{{ translations.resume_tip_label }}</p>
              <p>{{ translations.resume_step6_tip }}</p>
              <p>
                <span class="font-semibold">{{ translations.resume_step6_tip_languages_label }}</span> {{ translations.resume_step6_tip_languages_value }}
              </p>
              <p>
                <span class="font-semibold">{{ translations.resume_step6_tip_frameworks_label }}</span> {{ translations.resume_step6_tip_frameworks_value }}
              </p>
              <p>
                <span class="font-semibold">{{ translations.resume_step6_tip_databases_label }}</span> {{ translations.resume_step6_tip_databases_value }}
              </p>
            </div>
          </section>

          <!-- Step 7: Languages -->
          <section v-else-if="step === 7" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step7_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step7_subtitle }}
              </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
              <h3 class="text-xs font-semibold text-gray-700">{{ translations.resume_step7_add_language_title }}</h3>
              <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  v-model="newLanguageName"
                  type="text"
                  class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step7_language_placeholder"
                  @keyup.enter.prevent="addLanguage"
                />
                <select
                  v-model="newLanguageLevel"
                  class="w-full sm:w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option
                    v-for="(opt, index) in languageLevels"
                    :key="opt?.id || index"
                    :value="opt?.id"
                  >
                    {{ opt && translations[opt.labelKey] }}
                  </option>
                </select>
                <button
                  type="button"
                  class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900"
                  @click="addLanguage"
                >
                  {{ translations.resume_step7_add_language_button }}
                </button>
              </div>
            </div>

            <!-- Languages list (user-entered) -->
            <div
              v-if="form.languages.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="(lang, index) in form.languages"
                :key="index"
                class="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs"
              >
                <span>{{ lang.name }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {{ languageLabel(lang.level) }}
                </span>
                <button
                  type="button"
                  class="ml-1 text-blue-500 hover:text-blue-700"
                  @click="removeLanguage(lang)"
                >
                  ×
                </button>
              </span>
            </div>

            <div class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-900 space-y-1">
              <p class="font-semibold mb-1">{{ translations.resume_step7_legend_title }}</p>
              <p><span class="font-semibold">{{ translations.resume_step7_basic_label }}</span> {{ translations.resume_step7_basic_text }}</p>
              <p><span class="font-semibold">{{ translations.resume_step7_intermediate_label }}</span> {{ translations.resume_step7_intermediate_text }}</p>
              <p><span class="font-semibold">{{ translations.resume_step7_advanced_label }}</span> {{ translations.resume_step7_advanced_text }}</p>
              <p><span class="font-semibold">{{ translations.resume_step7_native_label }}</span> {{ translations.resume_step7_native_text }}</p>
              <p class="pt-1 text-center">
                {{ translations.resume_step7_total_languages_prefix }} {{ form.languages.length }}
              </p>
            </div>
          </section>

          <!-- Step 8: Certificates -->
          <section v-else-if="step === 8" class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ translations.resume_step8_title }}</h2>
              <p class="text-sm text-gray-500">
                {{ translations.resume_step8_subtitle }}
              </p>
            </div>

            <div class="space-y-3" v-if="form.certificates.length">
              <div
                v-for="(cert, index) in form.certificates"
                :key="index"
                class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div class="flex justify-between items-start mb-2">
                  <p class="text-sm font-medium text-gray-900">
                    {{ translations.resume_step8_certificate_label }} #{{ index + 1 }}
                  </p>
                  <button
                    type="button"
                    class="text-red-500 text-xs hover:underline"
                    @click="removeCertificate(index)"
                  >
                    {{ translations.resume_delete }}
                  </button>
                </div>
                <p class="text-xs text-gray-700">
                  {{ cert.title }} — {{ cert.organization }}
                </p>
                <p class="text-xs text-gray-500" v-if="cert.issued_at">
                  {{ cert.issued_at }} <span v-if="cert.certificate_id">• {{ cert.certificate_id }}</span>
                </p>
              </div>
            </div>

            <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 space-y-4">
              <h3 class="text-xs font-semibold text-gray-700">{{ translations.resume_step8_add_block_title }}</h3>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step8_title_label }} *</label>
                <input
                  v-model="certificateForm.title"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step8_organization_label }} *</label>
                <input
                  v-model="certificateForm.organization"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step8_issued_at_label }} *</label>
                <input
                  v-model="certificateForm.issued_at"
                  type="month"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step8_certificate_id_label }}</label>
                <input
                  v-model="certificateForm.certificate_id"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-medium hover:bg-black"
                @click="saveCertificate"
              >
                {{ translations.resume_step8_add_button }}
              </button>
            </div>

            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900">
              <span class="font-semibold">{{ translations.resume_tip_label }}</span>
              <span class="ml-1">
                {{ translations.resume_step8_tip }}
              </span>
            </div>
          </section>
        </div>

          <!-- Navigation -->
        <div class="mt-8 flex items-center justify-between">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            :disabled="step === 1"
            @click="prevStep"
          >
            <span class="mr-1">←</span>
            {{ translations.back }}
          </button>

          <div class="flex items-center gap-1">
            <span
              v-for="n in 8"
              :key="n"
              class="h-2 w-2 rounded-full"
              :class="n === step ? 'bg-blue-600' : 'bg-gray-300'"
            />
          </div>

          <button
            v-if="step < 8"
            type="button"
            class="inline-flex items-center px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
            @click="nextStep"
          >
            {{ translations.next }}
            <span class="ml-1">→</span>
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
            :disabled="saving"
            @click="handleFinish"
          >
            <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ translations.resume_preview_button }}
          </button>
        </div>
      </div>

      <!-- Preview mode -->
      <div v-else class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="bg-white rounded-2xl shadow p-6 sm:p-8 mb-6">
          <div class="flex justify-between items-center mb-6">
            <button
              type="button"
              class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              @click="mode = 'wizard'"
            >
              ← {{ translations.resume_preview_back_to_editor }}
            </button>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-3 py-1.5 text-xs border rounded-full text-gray-700 hover:bg-gray-50"
                @click="downloadPdf('ru')"
              >
                {{ translations.resume_preview_pdf_ru }}
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs border rounded-full text-gray-700 hover:bg-gray-50"
                @click="downloadPdf('en')"
              >
                {{ translations.resume_preview_pdf_en }}
              </button>
            </div>
          </div>

          <!-- Header block -->
          <div class="flex gap-6 mb-6">
            <div
              class="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200"
            >
              <img
                v-if="photoUrl"
                :src="photoUrl"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-gray-400 text-xs text-center px-2">
                {{ translations.resume_photo_label }}
              </span>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900">
                      {{ form.personal.first_name }} {{ form.personal.last_name }}
                    </h2>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ form.job.desired_position }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="text-xs text-blue-600 hover:underline"
                    @click="editSection(1)"
                  >
                    {{ translations.resume_edit }}
                  </button>
                </div>

                <div class="mt-4 space-y-1 text-sm text-gray-700">
                  <p v-if="form.personal.phone || form.personal.email">
                    <span v-if="form.personal.phone">{{ form.personal.phone }}</span>
                    <span v-if="form.personal.phone && form.personal.email"> · </span>
                    <span v-if="form.personal.email">{{ form.personal.email }}</span>
                  </p>
                  <p v-if="form.personal.city || form.personal.country">
                    {{ form.personal.city }}<span v-if="form.personal.country">, {{ form.personal.country }}</span>
                  </p>
                  <p v-if="form.personal.linkedin_url">{{ form.personal.linkedin_url }}</p>
                  <p v-if="form.personal.github_url">{{ form.personal.github_url }}</p>
                  <p v-if="form.personal.portfolio_url">{{ form.personal.portfolio_url }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- SUMMARY -->
          <div v-if="form.summary.text" class="border-t pt-4 mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_summary_title }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(3)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <p class="text-sm text-gray-800 whitespace-pre-line">
              {{ form.summary.text }}
            </p>
          </div>

          <!-- JOB PREFERENCES (Step 2) -->
          <div class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_job }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(2)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <div class="text-sm text-gray-800 space-y-1">
              <p v-if="form.job.desired_position">
                <span class="font-semibold">{{ translations.resume_step2_desired_position_label }}:</span>
                <span class="ml-1">{{ form.job.desired_position }}</span>
              </p>
              <p v-if="form.job.desired_salary">
                <span class="font-semibold">{{ translations.resume_step2_desired_salary_label }}:</span>
                <span class="ml-1">{{ form.job.desired_salary }}</span>
              </p>
              <p v-if="form.job.citizenship">
                <span class="font-semibold">{{ translations.resume_step2_citizenship_label }}:</span>
                <span class="ml-1">{{ form.job.citizenship }}</span>
              </p>
              <p v-if="form.job.employment_types && form.job.employment_types.length">
                <span class="font-semibold">{{ translations.resume_step2_employment_label }}:</span>
                <span class="ml-1">
                  {{ form.job.employment_types.map(employmentLabel).join(", ") }}
                </span>
              </p>
              <p v-if="form.job.work_schedules && form.job.work_schedules.length">
                <span class="font-semibold">{{ translations.resume_step2_schedule_label }}:</span>
                <span class="ml-1">
                  {{ form.job.work_schedules.map(scheduleLabel).join(", ") }}
                </span>
              </p>
              <p v-if="form.job.ready_to_relocate || form.job.ready_for_trips">
                <span class="font-semibold">{{ translations.resume_step2_readiness_label }}:</span>
                <span class="ml-1">
                  <span v-if="form.job.ready_to_relocate">
                    {{ translations.resume_step2_ready_to_relocate }}
                  </span>
                  <span v-if="form.job.ready_to_relocate && form.job.ready_for_trips"> · </span>
                  <span v-if="form.job.ready_for_trips">
                    {{ translations.resume_step2_ready_for_trips }}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <!-- EXPERIENCE -->
          <div v-if="form.experiences.length" class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_experience }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(4)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <div
              v-for="(exp, index) in form.experiences"
              :key="index"
              class="flex items-start justify-between text-sm text-gray-800 mt-3"
            >
              <div class="pr-4">
                <p class="font-semibold">
                  {{ exp.position }}
                </p>
                <p class="text-gray-600 text-xs mt-0.5">
                  <span v-if="exp.company">{{ exp.company }}</span>
                  <span v-if="exp.company && exp.location"> | </span>
                  <span v-if="exp.location">{{ exp.location }}</span>
                </p>
                <p
                  v-if="exp.description"
                  class="text-gray-700 text-xs mt-1 whitespace-pre-line"
                >
                  {{ exp.description }}
                </p>
              </div>
              <p class="text-xs text-gray-500 whitespace-nowrap">
                {{ formatPeriod(exp.start_date, exp.end_date, exp.is_current) }}
              </p>
            </div>
          </div>

          <!-- EDUCATION -->
          <div v-if="form.educations.length" class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_education }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(5)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <div
              v-for="(edu, index) in form.educations"
              :key="index"
              class="flex items-start justify-between text-sm text-gray-800 mt-3"
            >
              <div class="pr-4">
                <p class="font-semibold">
                  {{ edu.degree }}
                </p>
                <p class="text-gray-600 text-xs mt-0.5">
                  <span v-if="edu.institution">{{ edu.institution }}</span>
                  <span v-if="edu.institution && edu.location"> | </span>
                  <span v-if="edu.location">{{ edu.location }}</span>
                </p>
                <p
                  v-if="edu.extra_info"
                  class="text-gray-700 text-xs mt-1 whitespace-pre-line"
                >
                  {{ edu.extra_info }}
                </p>
              </div>
              <p class="text-xs text-gray-500 whitespace-nowrap">
                {{ formatPeriod(edu.start_date, edu.end_date, edu.is_current) }}
              </p>
            </div>
          </div>

          <!-- SKILLS -->
          <div v-if="form.skills.length" class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_skills }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(6)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <div class="space-y-1 text-sm text-gray-800">
              <p
                v-for="(skill, index) in form.skills"
                :key="index"
              >
                <span class="font-semibold">
                  {{ skill.name }}
                </span>
                <span class="text-xs text-gray-500 ml-1">
                  {{
                    translations['resume_skill_level_' + normalizeSkillLevel(skill.level)]
                      || normalizeSkillLevel(skill.level)
                  }}
                </span>
              </p>
            </div>
          </div>

          <!-- LANGUAGES -->
          <div v-if="form.languages.length" class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_languages }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(7)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <div class="space-y-1 text-sm text-gray-800">
              <p
                v-for="(lang, index) in form.languages"
                :key="index"
              >
                <span class="font-semibold lowercase">
                  {{ lang.name }}:
                </span>
                <span class="ml-1 text-gray-700 text-xs">
                  {{ languageLabel(lang.level) }}
                </span>
              </p>
            </div>
          </div>

          <!-- CERTIFICATES -->
          <div v-if="form.certificates.length" class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold tracking-wide text-gray-500">
                {{ translations.resume_preview_section_certificates }}
              </h3>
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline"
                @click="editSection(8)"
              >
                {{ translations.resume_edit }}
              </button>
            </div>
            <ul class="space-y-1 text-sm text-gray-800">
              <li
                v-for="(cert, index) in form.certificates"
                :key="index"
                class="flex items-start gap-2"
              >
                <span class="mt-0.5 text-green-500">✓</span>
                <span>
                  <span class="font-semibold">{{ cert.title }}</span>
                  <span v-if="cert.organization"> — {{ cert.organization }}</span>
                  <span v-if="cert.issued_at" class="text-xs text-gray-500">
                    , {{ formatMonthYear(cert.issued_at) }}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <!-- READY BLOCK -->
          <div class="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-900 flex gap-3 items-start">
            <div
              class="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white"
            >
              ✓
            </div>
            <div>
              <p class="font-semibold mb-1">
                {{ translations.resume_preview_ready_title }}
              </p>
              <p class="text-[11px] leading-relaxed">
                {{ translations.resume_preview_ready_text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "@/i18n-lite.js";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { translations } = useI18n();

const step = ref(1);
const mode = ref("wizard"); // 'wizard' | 'preview'

const saving = ref(false);
const loading = ref(false);

const form = reactive({
  personal: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    photo_path: null,
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  },
  job: {
    desired_position: "",
    desired_salary: "",
    citizenship: "",
    employment_types: [],
    work_schedules: [],
    ready_to_relocate: false,
    ready_for_trips: false,
  },
  summary: {
    text: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certificates: [],
});

const photoInput = ref(null);

const photoUrl = computed(() => {
  const path = form.personal.photo_path;
  if (!path) return "";

  // Agar backend to'liq URL qaytargan bo'lsa, o'shani ishlatamiz
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Aks holda API bazasidan domenni olib, /api ni olib tashlab, /storage/ ni qo'shamiz
  const apiBase = proxy?.$locale || "";
  const root = apiBase.replace(/\/api\/?$/, "");

  // backend odatda "resume_photos/..." ni "storage/resume_photos/..." orqali beradi
  const cleaned = String(path).replace(/^storage\//, "").replace(/^\/+/, "");
  return `${root}/storage/${cleaned}`;
});

const employmentOptions = [
  { value: "full_time", labelKey: "resume_employment_full_time" },
  { value: "part_time", labelKey: "resume_employment_part_time" },
  { value: "project", labelKey: "resume_employment_project" },
  { value: "volunteer", labelKey: "resume_employment_volunteer" },
  { value: "internship", labelKey: "resume_employment_internship" },
];

const scheduleOptions = [
  { value: "full_day", labelKey: "resume_schedule_full_day" },
  { value: "shift", labelKey: "resume_schedule_shift" },
  { value: "flex", labelKey: "resume_schedule_flex" },
  { value: "remote", labelKey: "resume_schedule_remote" },
  { value: "rotation", labelKey: "resume_schedule_rotation" },
];

const skillCategories = [
  { id: "basic", labelKey: "resume_skill_level_basic" },
  { id: "middle", labelKey: "resume_skill_level_middle" },
  { id: "strong", labelKey: "resume_skill_level_strong" },
].filter(Boolean);

const languageLevels = [
  { id: "basic", labelKey: "resume_language_level_basic" },
  { id: "intermediate", labelKey: "resume_language_level_intermediate" },
  { id: "advanced", labelKey: "resume_language_level_advanced" },
  { id: "native", labelKey: "resume_language_level_native" },
].filter(Boolean);

const summaryLength = computed(() => form.summary.text?.length || 0);

const experienceForm = reactive({
  position: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
});

const educationForm = reactive({
  degree: "",
  institution: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  extra_info: "",
});

const certificateForm = reactive({
  title: "",
  organization: "",
  issued_at: "",
  certificate_id: "",
});

const editingExperienceIndex = ref(null);
const editingEducationIndex = ref(null);

const newSkillName = ref("");
const newSkillCategory = ref(skillCategories[0]?.id || "basic");

const newLanguageName = ref("");
const newLanguageLevel = ref(languageLevels[0]?.id || "basic");

// Helper for language levels: backend darajalarini ichki id ga moslashtirish
const languageLevelAliases = {
  basic: "basic",
  "Basic (A1-A2)": "basic",
  "Базовый (A1-A2)": "basic",

  intermediate: "intermediate",
  "Intermediate (B1-B2)": "intermediate",
  "Средний (B1-B2)": "intermediate",

  advanced: "advanced",
  "Advanced (C1-C2)": "advanced",
  "Продвинутый (C1-C2)": "advanced",

  native: "native",
  "Native": "native",
  "Родной": "native",
};

const normalizeLanguageLevel = (raw) => {
  if (!raw) return "";
  return languageLevelAliases[raw] || raw;
};

// Helper for skill levels: eski kategoriyalarni (languages, frameworks, ...)
// uchta darajaga (basic/middle/strong) map qilamiz
const skillLevelAliases = {
  basic: "basic",
  middle: "middle",
  strong: "strong",
  languages: "basic",
  frameworks: "middle",
  databases: "middle",
  cloud: "strong",
  tools: "middle",
  soft: "strong",
  other: "basic",
};

const normalizeSkillLevel = (raw) => {
  if (!raw) return "";
  return skillLevelAliases[raw] || raw;
};

const employmentLabel = (value) => {
  const opt = employmentOptions.find((o) => o.value === value);
  if (!opt) return value;
  const dict = translations && translations.value ? translations.value : {};
  return dict[opt.labelKey] || value;
};

const scheduleLabel = (value) => {
  const opt = scheduleOptions.find((o) => o.value === value);
  if (!opt) return value;
  const dict = translations && translations.value ? translations.value : {};
  return dict[opt.labelKey] || value;
};

const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatMonthYear = (value) => {
  if (!value) return "";
  const [year, month] = String(value).split("-");
  const idx = Number(month) - 1;
  const m = monthNamesShort[idx] || month;
  if (!year) return value;
  return `${m} ${year}`;
};

const formatPeriod = (start, end, isCurrent) => {
  const startStr = formatMonthYear(start);
  const endStr = isCurrent ? translations.resume_period_present : formatMonthYear(end);
  if (startStr && endStr) return `${startStr} - ${endStr}`;
  if (startStr) return startStr;
  if (endStr) return endStr;
  return "";
};

const languageLabel = (levelId) => {
  const normalized = normalizeLanguageLevel(levelId);
  if (!normalized) return "";

  const key = `resume_language_level_${normalized}`;
  const dict = translations && translations.value ? translations.value : {};
  const translated = dict[key];
  return translated || normalized;
};

const fetchResume = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.get(`${proxy.$locale}/v1/resume-create`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (data?.data) {
      Object.assign(form.personal, data.data.personal || {});
      Object.assign(form.job, data.data.job || {});
      Object.assign(form.summary, data.data.summary || {});
      form.experiences = data.data.experiences || [];
      form.educations = data.data.educations || [];
      form.skills = (data.data.skills || []).map((s) => ({
        ...s,
        level: normalizeSkillLevel(s.level),
      }));
      form.languages = (data.data.languages || []).map((l) => ({
        ...l,
        level: normalizeLanguageLevel(l.level),
      }));
      form.certificates = data.data.certificates || [];
    }
  } catch (e) {
    console.error("❌ resume-create fetch error:", e.response?.data || e.message);
  } finally {
    loading.value = false;
  }
};

const submitAll = async () => {
  saving.value = true;
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    await axios.post(
      `${proxy.$locale}/v1/resume-create`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.error("❌ resume-create save error:", e.response?.data || e.message);
    throw e;
  } finally {
    saving.value = false;
  }
};

const editSection = (sectionStep) => {
  step.value = sectionStep;
  mode.value = "wizard";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetExperienceForm = () => {
  Object.assign(experienceForm, {
    position: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });
  editingExperienceIndex.value = null;
};

const editExperience = (index) => {
  const exp = form.experiences[index];
  if (!exp) return;
  Object.assign(experienceForm, exp);
  editingExperienceIndex.value = index;
};

const saveExperience = () => {
  const payload = { ...experienceForm };
  if (payload.is_current) {
    payload.end_date = null;
  }
  if (editingExperienceIndex.value === null) {
    form.experiences.push(payload);
  } else {
    form.experiences.splice(editingExperienceIndex.value, 1, payload);
  }
  resetExperienceForm();
};

const removeExperience = (index) => {
  form.experiences.splice(index, 1);
  if (editingExperienceIndex.value === index) resetExperienceForm();
};

const resetEducationForm = () => {
  Object.assign(educationForm, {
    degree: "",
    institution: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    extra_info: "",
  });
  editingEducationIndex.value = null;
};

const editEducation = (index) => {
  const edu = form.educations[index];
  if (!edu) return;
  Object.assign(educationForm, edu);
  editingEducationIndex.value = index;
};

const saveEducation = () => {
  const payload = { ...educationForm };
  if (payload.is_current) payload.end_date = null;
  if (editingEducationIndex.value === null) {
    form.educations.push(payload);
  } else {
    form.educations.splice(editingEducationIndex.value, 1, payload);
  }
  resetEducationForm();
};

const removeEducation = (index) => {
  form.educations.splice(index, 1);
  if (editingEducationIndex.value === index) resetEducationForm();
};

const addSkill = () => {
  if (!newSkillName.value.trim()) return;
  form.skills.push({
    name: newSkillName.value.trim(),
    level: normalizeSkillLevel(newSkillCategory.value),
  });
  newSkillName.value = "";
};

const skillsByCategory = (categoryId) =>
  form.skills.filter((s) => normalizeSkillLevel(s.level) === categoryId && s.name);

const removeSkill = (skill) => {
  form.skills = form.skills.filter((s) => s !== skill);
};

const addLanguage = () => {
  if (!newLanguageName.value.trim()) return;
  console.log("▶ addLanguage", newLanguageName.value, newLanguageLevel.value);
  form.languages.push({
    name: newLanguageName.value.trim(),
    level: normalizeLanguageLevel(newLanguageLevel.value),
  });
  console.log("▶ languages now:", form.languages);
  newLanguageName.value = "";
};

const languagesByLevel = (levelId) =>
  form.languages.filter((l) => normalizeLanguageLevel(l.level) === levelId && l.name);

const removeLanguage = (lang) => {
  form.languages = form.languages.filter((l) => l !== lang);
};

const saveCertificate = () => {
  if (!certificateForm.title || !certificateForm.organization) return;
  form.certificates.push({ ...certificateForm });
  Object.assign(certificateForm, {
    title: "",
    organization: "",
    issued_at: "",
    certificate_id: "",
  });
};

const removeCertificate = (index) => {
  form.certificates.splice(index, 1);
};

const nextStep = () => {
  if (step.value < 8) step.value += 1;
};

const prevStep = () => {
  if (step.value > 1) step.value -= 1;
};

const handleFinish = async () => {
  console.log("▶ handleFinish clicked, step =", step.value, "mode before =", mode.value);
  // Avval preview'ga o'tkazamiz, foydalanuvchi natijani darhol ko'rsin
  mode.value = "preview";
  console.log("▶ mode after =", mode.value);

  try {
    await submitAll(); // barcha form ma'lumotlari, jumladan extra_info backendga POST qilinadi
  } catch (e) {
    console.error("resume preview submit error (ignored for UI):", e.response?.data || e.message);
  }
};

const triggerPhotoInput = () => {
  photoInput.value?.click();
};

const handlePhotoChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.post(
      `${proxy.$locale}/v1/resume-create/photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (data?.path) {
      form.personal.photo_path = data.path;
    }
  } catch (e) {
    console.error("❌ photo upload error:", e.response?.data || e.message);
  } finally {
    event.target.value = "";
  }
};

const removePhoto = async () => {
  if (!form.personal.photo_path) return;

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    await axios.delete(
      `${proxy.$locale}/v1/resume-create/photo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { path: form.personal.photo_path },
      }
    );
    form.personal.photo_path = null;
  } catch (e) {
    console.error("❌ photo delete error:", e.response?.data || e.message);
  }
};

const buildPdfUrl = (lang) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  const base = `${proxy.$locale}/v1/resume-create/pdf`;
  const params = new URLSearchParams({ lang });
  if (token) params.append("token", token);
  return `${base}?${params.toString()}`;
};

const downloadPdf = (lang) => {
  const url = buildPdfUrl(lang);

  // Agar Telegram mini app muhitida bo'lsak, ularning openLink API'sidan foydalanamiz
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg && typeof tg.openLink === "function") {
    tg.openLink(url);
    return;
  }

  // Mobil brauzerlar uchun eng ishonchli usul — to'g'ridan-to'g'ri redirect
  if (typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = url;
    return;
  }

  // Desktopda yangi tabda ochamiz
  window.open(url, "_blank");
};

const goBackHome = () => {
  router.push({ name: "home" });
};

onMounted(fetchResume);
</script>
