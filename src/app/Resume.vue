<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-24">
    <!-- Wizard / Preview header -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between mb-6">
        <!-- Back button: wizardda home'ga, previewda wizard'ga qaytaradi -->
        <!-- <button
          type="button"
              class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              @click="mode = 'wizard'"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ translations.resume_preview_back_to_editor }}</span>
        </button> -->

        <!-- <button
          type="button"
          class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          @click="handleBack"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ translations.back }}</span>
        </button> -->

                    <!-- <button
              type="button"
              class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              @click="mode = 'wizard'"
            >
              ← {{ translations.resume_preview_back_to_editor }}
            </button> -->

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
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.name }} *
                    </label>
                    <input
                      v-model="form.personal.first_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="errors.step1.first_name" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.first_name }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.surname }} *
                    </label>
                    <input
                      v-model="form.personal.last_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="errors.step1.last_name" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.last_name }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.email }} *
                    </label>
                    <input
                      v-model="form.personal.email"
                      type="email"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="errors.step1.email" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.email }}
                    </p>
                  </div>
<!--                  <div>-->
<!--                    <label class="block text-xs font-medium text-gray-700 mb-1">-->
<!--                      {{ translations.phone }} *-->
<!--                    </label>-->
<!--                    <input-->
<!--                      v-model="form.personal.phone"-->
<!--                      type="text"-->
<!--                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"-->
<!--                    />-->
<!--                  </div>-->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      {{ translations.phone }}
                    </label>
                    <input
                        ref="phoneInput"
                        id="phone"
                        type="tel"
                        v-model="form.personal.phone"
                        class="w-full px-3 py-2 bg-gray-100 border rounded-lg
           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
           focus:outline-none focus:bg-white"
                        placeholder="33 505 20 05"
                    />
                    <p v-if="errors.step1.phone" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.phone }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.resume_city }} *
                    </label>
                    <input
                      v-model="form.personal.city"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="errors.step1.city" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.city }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.resume_country }} *
                    </label>
                    <input
                      v-model="form.personal.country"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="errors.step1.country" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.country }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.resume_gender_label }} *
                    </label>
                    <select
                      v-model="form.personal.gender"
                      class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        {{ translations.resume_gender_placeholder }}
                      </option>
                      <option
                        v-for="opt in genderOptions"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ translations[opt.labelKey] }}
                      </option>
                    </select>
                    <p v-if="errors.step1.gender" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.gender }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ translations.resume_birth_date_label }} *
                    </label>
                    <div class="flex gap-2">
                      <div class="w-1/3">
                        <label class="block text-[10px] font-medium text-gray-500 mb-0.5">
                          {{ translations.resume_birth_day_label }} *
                        </label>
                        <input
                          v-model="birthDay"
                          type="number"
                          min="1"
                          max="31"
                          class="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="10"
                        />
                      </div>
                      <div class="w-1/3">
                        <label class="block text-[10px] font-medium text-gray-500 mb-0.5">
                          {{ translations.resume_birth_month_label }} *
                        </label>
                        <input
                          v-model="birthMonth"
                          type="number"
                          min="1"
                          max="12"
                          class="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="12"
                        />
                      </div>
                      <div class="w-1/3">
                        <label class="block text-[10px] font-medium text-gray-500 mb-0.5">
                          {{ translations.resume_birth_year_label }} *
                        </label>
                        <input
                          v-model="birthYear"
                          type="number"
                          min="1950"
                          max="2020"
                          class="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          @input="onBirthYearInput"
                          placeholder="2000"
                        />
                      </div>
                    </div>
                    <p v-if="errors.step1.birth_date" class="mt-1 text-xs text-red-500">
                      {{ errors.step1.birth_date }}
                    </p>
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
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  {{ translations.resume_step2_desired_position_label }}
                  <span v-if="step2Active" class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.job.desired_position"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step2_desired_position_placeholder"
                />
                <p v-if="errors.step2.desired_position" class="mt-1 text-xs text-red-500">
                  {{ errors.step2.desired_position }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step2_desired_salary_label }}</label>
                <div class="flex gap-2">
                  <input
                    v-model="salaryInput"
                    type="text"
                    class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :placeholder="translations.resume_step2_desired_salary_placeholder"
                  />
                  <select
                    v-model="salaryCurrency"
                    class="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UZS">UZS</option>
                    <option value="USD">USD $</option>
                    <option value="RUB">RUB ₽</option>
                  </select>
                </div>
                <p class="mt-1 text-xs text-gray-400">
                  {{ translations.resume_step2_desired_salary_hint }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  {{ translations.resume_step2_citizenship_label }}
                  <span v-if="step2Active" class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.job.citizenship"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="translations.resume_step2_citizenship_placeholder"
                />
                <p v-if="errors.step2.citizenship" class="mt-1 text-xs text-red-500">
                  {{ errors.step2.citizenship }}
                </p>
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-3">
                <h3 class="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <span class="text-purple-500">▣</span>
                  {{ translations.resume_step2_employment_label }}
                  <span v-if="step2Active" class="text-red-500">*</span>
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
                <p v-if="errors.step2.employment_types" class="mt-1 text-xs text-red-500">
                  {{ errors.step2.employment_types }}
                </p>
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-3">
                <h3 class="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <span class="text-blue-500">🕒</span>
                  {{ translations.resume_step2_schedule_label }}
                  <span v-if="step2Active" class="text-red-500">*</span>
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
                <p v-if="errors.step2.work_schedules" class="mt-1 text-xs text-red-500">
                  {{ errors.step2.work_schedules }}
                </p>
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
              <p v-if="errors.step3.summary" class="text-xs text-red-500">
                {{ errors.step3.summary }}
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
                  <p v-if="errors.step4.position" class="mt-1 text-xs text-red-500">
                    {{ errors.step4.position }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step4_company_label }} *</label>
                  <input
                    v-model="experienceForm.company"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.step4.company" class="mt-1 text-xs text-red-500">
                    {{ errors.step4.company }}
                  </p>
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
                  <p v-if="errors.step4.start_date" class="mt-1 text-xs text-red-500">
                    {{ errors.step4.start_date }}
                  </p>
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
                class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                @click="saveExperience"
              >
                {{ editingExperienceIndex === null ? translations.resume_step4_add_button : translations.resume_step4_save_button }}
              </button>
              <p v-if="errors.step4.general" class="mt-2 text-xs text-red-500">
                {{ errors.step4.general }}
              </p>
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
                    <span v-else-if="edu.is_current"> – {{ translations.resume_period_present }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <button class="text-blue-600 hover:underline" @click="editEducation(index)">
                    {{ translations.resume_edit }}
                  </button>
                  <button class="text-red-500 hover:underline" @click="removeEducation(index)">
                    {{ translations.resume_delete }}
                  </button>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 space-y-4">
              <h3 class="text-xs font-semibold text-gray-700">
                {{ translations.resume_step5_add_block_title }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step5_degree_label }} *</label>
                  <input
                    v-model="educationForm.degree"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.step5.degree" class="mt-1 text-xs text-red-500">
                    {{ errors.step5.degree }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ translations.resume_step5_institution_label }} *</label>
                  <input
                    v-model="educationForm.institution"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.step5.institution" class="mt-1 text-xs text-red-500">
                    {{ errors.step5.institution }}
                  </p>
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
                  <p v-if="errors.step5.start_date" class="mt-1 text-xs text-red-500">
                    {{ errors.step5.start_date }}
                  </p>
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
                class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                @click="saveEducation"
              >
                {{ editingEducationIndex === null ? translations.resume_step5_add_button : translations.resume_step5_save_button }}
              </button>
              <p v-if="errors.step5.general" class="mt-2 text-xs text-red-500">
                {{ errors.step5.general }}
              </p>
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
                  class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
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
                  class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
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
                class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
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
            class="inline-flex items-center px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            @click="nextStep"
          >
            {{ translations.next }}
            <span class="ml-1">→</span>
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
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
        <div v-if="mode === 'preview'" class="flex justify-between items-center mb-6">
          <button
            type="button"
            class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            @click="mode = 'wizard'"
          >
            ← {{ translations.resume_preview_back_to_editor }}
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700"
            @click="openDownloadModal()"
          >
            {{ translations.resume_download_button }}
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow p-6 sm:p-8 mb-6">

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
                  <p v-if="form.personal.gender">
                    {{ translations.resume_gender_label }}:
                    {{ genderLabel(form.personal.gender) }}
                  </p>
                  <p v-if="form.personal.birth_date">
                    {{ translations.resume_birth_date_label }}:
                    {{ birthDateDisplay }}
                  </p>
                  <p v-if="form.personal.linkedin_url">{{ form.personal.linkedin_url }}</p>
                  <p v-if="form.personal.github_url">{{ form.personal.github_url }}</p>
                  <p v-if="form.personal.portfolio_url">{{ form.personal.portfolio_url }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- SUMMARY -->
          <div v-if="form.summary.text" class="mt-4 pt-4 border-t-2 border-gray-300">
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
            <div class="pt-3 mt-1">
              <p class="text-sm text-gray-800 whitespace-pre-line">
                {{ form.summary.text }}
              </p>
            </div>
          </div>

          <!-- JOB PREFERENCES (Step 2) -->
          <div class="mt-6 pt-4">
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
            <div class="border-t pt-3 mt-1 text-sm text-gray-800 space-y-1">
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
          <div v-if="form.experiences.length" class="mt-6 pt-4">
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
            <div class="border-t pt-3 mt-1">
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
          </div>

          <!-- EDUCATION -->
          <div v-if="form.educations.length" class="mt-6 pt-4">
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
            <div class="border-t pt-3 mt-1">
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
          </div>

          <!-- SKILLS -->
          <div v-if="form.skills.length" class="mt-6 pt-4">
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
            <div class="border-t pt-3 mt-1 space-y-1 text-sm text-gray-800">
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
          <div v-if="form.languages.length" class="mt-6 pt-4">
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
            <div class="border-t pt-3 mt-1 space-y-1 text-sm text-gray-800">
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
          <div v-if="form.certificates.length" class="mt-6 pt-4">
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
            <ul class="border-t pt-3 mt-1 space-y-1 text-sm text-gray-800">
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

    <!-- Download modal: faqat tilni tanlash (PDF Telegramga yuboriladi) -->
    <div
      v-if="mode === 'preview' && showDownloadModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-2xl shadow-lg w-80 max-w-full p-5">
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ translations.resume_download_lang_modal_title }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ translations.resume_download_lang_modal_text }}
          </p>
          <div class="space-y-2 mt-2">
            <button
              type="button"
              class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              @click="handleDownload('ru')"
            >
              {{ translations.resume_download_lang_ru }}
            </button>
            <button
              type="button"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-blue-600 hover:bg-gray-50"
              @click="handleDownload('en')"
            >
              {{ translations.resume_download_lang_en }}
            </button>
          </div>
          <button
            type="button"
            class="mt-4 w-full text-xs text-gray-500 hover:text-gray-700"
            @click="closeDownloadModal"
          >
            {{ translations.resume_download_modal_cancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useI18n } from "@/i18n-lite.js";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

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
    gender: "",
    birth_date: "2000",
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

const genderOptions = [
  { value: "male", labelKey: "resume_gender_male" },
  { value: "female", labelKey: "resume_gender_female" },
];

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

// Download modal state
const showDownloadModal = ref(false);
const selectedDownloadLang = ref("ru"); // 'ru' | 'en'

// Step 2: salary currency
const salaryInput = ref("");
const salaryCurrency = ref("UZS"); // 'UZS' | 'USD' | 'RUB'

// Tug'ilgan sana uchun UI (kun va oy faqat frontda)
const birthDay = ref("10");
const birthMonth = ref("01");
const birthYear = ref("2000");

// Validation errors for steps
const errors = reactive({
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
});

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

const genderLabel = (value) => {
  if (!value) return "";
  const dict = translations && translations.value ? translations.value : {};
  if (value === "male") return dict.resume_gender_male || "Male";
  if (value === "female") return dict.resume_gender_female || "Female";
  return value;
};

const birthDateDisplay = computed(() => {
  // Previewda to'g'ridan-to'g'ri backendga ketadigan qiymatni ko'rsatamiz
  return form.personal.birth_date ? String(form.personal.birth_date) : "";
});

const onBirthYearInput = (event) => {
  let raw = event.target.value || "";
  // faqat raqamlar, 4 ta belgigacha, lekin oraliqni bu yerda emas, validatsiyada tekshiramiz
  raw = raw.replace(/\D/g, "").slice(0, 4);
  birthYear.value = raw;
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

      // Tug'ilgan sana: backend "DD-MM-YYYY" yoki eski formatda faqat "YYYY" qaytarishi mumkin
      const bd = data.data.personal?.birth_date;
      if (bd) {
        const fullMatch = String(bd).match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (fullMatch) {
          birthDay.value = fullMatch[1].padStart(2, "0");
          birthMonth.value = fullMatch[2].padStart(2, "0");
          birthYear.value = fullMatch[3];
          form.personal.birth_date = `${birthDay.value}-${birthMonth.value}-${birthYear.value}`;
        } else if (/^\d{4}$/.test(String(bd))) {
          birthYear.value = String(bd);
          form.personal.birth_date = String(bd);
        }
      }

      // Step 2: desired salary parsing (e.g. "1000-2000 UZS", "1000-2000 $", "1000-2000 ₽")
      if (form.job.desired_salary) {
        const raw = String(form.job.desired_salary).trim();
        let currency = "UZS";
        let amount = raw;

        const match = raw.match(/^(.*)\s+(UZS|USD|\$|RUB|₽)$/i);
        if (match) {
          amount = match[1].trim();
          const cur = match[2].toUpperCase();
          if (cur === "UZS") currency = "UZS";
          else if (cur === "USD" || cur === "$") currency = "USD";
          else currency = "RUB";
        }

        salaryInput.value = amount;
        salaryCurrency.value = currency;
      } else {
        salaryInput.value = "";
        salaryCurrency.value = "UZS";
      }

      // Agar backendda rezyume mavjud bo'lsa, sahifani darhol preview rejimida ochamiz
      mode.value = "preview";
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

    // Form nusxasini yaratib, maoshni valyutaga qarab formatlaymiz
    const payload = JSON.parse(JSON.stringify(form));

    // Tug'ilgan sana: foydalanuvchi kiritgan kun-oy-yilni "DD-MM-YYYY" ko'rinishida yuboramiz
    const year = birthYear.value ? String(birthYear.value).trim() : "";
    const day = birthDay.value ? String(birthDay.value).padStart(2, "0") : "";
    const month = birthMonth.value ? String(birthMonth.value).padStart(2, "0") : "";
    if (day && month && year) {
      payload.personal.birth_date = `${day}-${month}-${year}`;
      form.personal.birth_date = payload.personal.birth_date;
    } else {
      payload.personal.birth_date = "";
    }

    let formattedSalary = "";
    if (salaryInput.value && String(salaryInput.value).trim()) {
      const clean = String(salaryInput.value).trim();
      let suffix = "";
      if (salaryCurrency.value === "USD") suffix = " $";
      else if (salaryCurrency.value === "RUB") suffix = " ₽";
      else suffix = " UZS";
      formattedSalary = `${clean}${suffix}`;
      payload.job.desired_salary = formattedSalary;
    } else {
      payload.job.desired_salary = "";
    }

    // Preview'da ham ko'rinishi uchun form holatini yangilaymiz
    form.job.desired_salary = formattedSalary;

    await axios.post(`${proxy.$locale}/v1/resume-create`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
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
  // Agar foydalanuvchi to'ldirishni boshlagan bo'lsa, minimal maydonlarni tekshiramiz
  errors.step4 = {};
  const dirty = isExperienceFormDirty();
  if (dirty) {
    let ok = true;
    if (isEmptyString(experienceForm.position)) {
      errors.step4.position = translations.value.resume_error_experience_position_required;
      ok = false;
    }
    if (isEmptyString(experienceForm.company)) {
      errors.step4.company = translations.value.resume_error_experience_company_required;
      ok = false;
    }
    if (isEmptyString(experienceForm.start_date)) {
      errors.step4.start_date = translations.value.resume_error_experience_start_date_required;
      ok = false;
    }
    if (!ok) return;
  }

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
  // Agar foydalanuvchi to'ldirishni boshlagan bo'lsa, minimal maydonlarni tekshiramiz
  errors.step5 = {};
  const dirty = isEducationFormDirty();
  if (dirty) {
    let ok = true;
    if (isEmptyString(educationForm.degree)) {
      errors.step5.degree = translations.value.resume_error_education_degree_required;
      ok = false;
    }
    if (isEmptyString(educationForm.institution)) {
      errors.step5.institution = translations.value.resume_error_education_institution_required;
      ok = false;
    }
    if (isEmptyString(educationForm.start_date)) {
      errors.step5.start_date = translations.value.resume_error_education_start_date_required;
      ok = false;
    }
    if (!ok) return;
  }

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

const isEmptyString = (val) => !val || !String(val).trim();

const validateStep1 = () => {
  errors.step1 = {};
  let ok = true;

  if (isEmptyString(form.personal.first_name)) {
    errors.step1.first_name = translations.value.resume_error_first_name_required;
    ok = false;
  }
  if (isEmptyString(form.personal.last_name)) {
    errors.step1.last_name = translations.value.resume_error_last_name_required;
    ok = false;
  }
  if (isEmptyString(form.personal.email)) {
    errors.step1.email = translations.value.resume_error_email_required;
    ok = false;
  }
  if (isEmptyString(form.personal.phone)) {
    errors.step1.phone = translations.value.resume_error_phone_required;
    ok = false;
  }
  if (isEmptyString(form.personal.city)) {
    errors.step1.city = translations.value.resume_error_city_required;
    ok = false;
  }
  if (isEmptyString(form.personal.country)) {
    errors.step1.country = translations.value.resume_error_country_required;
    ok = false;
  }
  if (isEmptyString(form.personal.gender)) {
    errors.step1.gender = translations.value.resume_error_gender_required;
    ok = false;
  }

  // Tug'ilgan sana (kun, oy, yil) majburiy
  if (!birthDay.value || !birthMonth.value || !birthYear.value) {
    errors.step1.birth_date = translations.value.resume_error_birth_date_required;
    ok = false;
  } else {
    const yearNum = Number(birthYear.value);
    if (
      Number.isNaN(yearNum) ||
      yearNum < 1950 ||
      yearNum > 2020
    ) {
      errors.step1.birth_date = translations.value.resume_error_birth_year_range;
      ok = false;
    }
  }

  return ok;
};

const step2Active = computed(() => {
  return (
    !isEmptyString(form.job.desired_position) ||
    !isEmptyString(form.job.citizenship) ||
    (form.job.employment_types && form.job.employment_types.length > 0) ||
    (form.job.work_schedules && form.job.work_schedules.length > 0)
  );
});

const validateStep2 = () => {
  errors.step2 = {};

  // Agar umuman hech narsa kiritilmagan bo'lsa, 2-step optional
  if (!step2Active.value) {
    return true;
  }

  let ok = true;

  if (isEmptyString(form.job.desired_position)) {
    errors.step2.desired_position = translations.value.resume_error_desired_position_required;
    ok = false;
  }
  if (isEmptyString(form.job.citizenship)) {
    errors.step2.citizenship = translations.value.resume_error_citizenship_required;
    ok = false;
  }
  if (!form.job.employment_types || form.job.employment_types.length === 0) {
    errors.step2.employment_types = translations.value.resume_error_employment_required;
    ok = false;
  }
  if (!form.job.work_schedules || form.job.work_schedules.length === 0) {
    errors.step2.work_schedules = translations.value.resume_error_schedule_required;
    ok = false;
  }

  return ok;
};

const validateStep3 = () => {
  errors.step3 = {};
  const len = form.summary.text ? form.summary.text.trim().length : 0;
  if (len < 3) {
    errors.step3.summary = translations.value.resume_error_summary_too_short;
    return false;
  }
  return true;
};

const isExperienceFormDirty = () =>
  !isEmptyString(experienceForm.position) ||
  !isEmptyString(experienceForm.company) ||
  !isEmptyString(experienceForm.location) ||
  !isEmptyString(experienceForm.start_date) ||
  !isEmptyString(experienceForm.end_date) ||
  !isEmptyString(experienceForm.description) ||
  !!experienceForm.is_current;

const validateStep4 = () => {
  errors.step4 = {};
  const hasExperiences = form.experiences && form.experiences.length > 0;
  const dirty = isExperienceFormDirty();

  // Hech narsa kiritilmagan va tajriba qo'shilmagan bo'lsa, optional
  if (!dirty && !hasExperiences) {
    return true;
  }

  let ok = true;

  if (dirty) {
    if (isEmptyString(experienceForm.position)) {
      errors.step4.position = translations.value.resume_error_experience_position_required;
      ok = false;
    }
    if (isEmptyString(experienceForm.company)) {
      errors.step4.company = translations.value.resume_error_experience_company_required;
      ok = false;
    }
    if (isEmptyString(experienceForm.start_date)) {
      errors.step4.start_date = translations.value.resume_error_experience_start_date_required;
      ok = false;
    }
  }

  if (!hasExperiences) {
    errors.step4.general = translations.value.resume_error_experience_add_required;
    ok = false;
  }

  return ok;
};

const isEducationFormDirty = () =>
  !isEmptyString(educationForm.degree) ||
  !isEmptyString(educationForm.institution) ||
  !isEmptyString(educationForm.location) ||
  !isEmptyString(educationForm.start_date) ||
  !isEmptyString(educationForm.end_date) ||
  !isEmptyString(educationForm.extra_info) ||
  !!educationForm.is_current;

const validateStep5 = () => {
  errors.step5 = {};
  const hasEducations = form.educations && form.educations.length > 0;
  const dirty = isEducationFormDirty();

  // Hech narsa kiritilmagan va ta'lim qo'shilmagan bo'lsa, optional
  if (!dirty && !hasEducations) {
    return true;
  }

  let ok = true;

  if (dirty) {
    if (isEmptyString(educationForm.degree)) {
      errors.step5.degree = translations.value.resume_error_education_degree_required;
      ok = false;
    }
    if (isEmptyString(educationForm.institution)) {
      errors.step5.institution = translations.value.resume_error_education_institution_required;
      ok = false;
    }
    if (isEmptyString(educationForm.start_date)) {
      errors.step5.start_date = translations.value.resume_error_education_start_date_required;
      ok = false;
    }
  }

  if (!hasEducations) {
    errors.step5.general = translations.value.resume_error_education_add_required;
    ok = false;
  }

  return ok;
};

const nextStep = () => {
  let valid = true;

  if (step.value === 1) {
    valid = validateStep1();
  } else if (step.value === 2) {
    valid = validateStep2();
  } else if (step.value === 3) {
    valid = validateStep3();
  } else if (step.value === 4) {
    valid = validateStep4();
  } else if (step.value === 5) {
    valid = validateStep5();
  }

  if (!valid) return;

  if (step.value < 8) step.value += 1;
};

const prevStep = () => {
  if (step.value > 1) step.value -= 1;
};

const handleFinish = async () => {
  console.log("▶ handleFinish clicked, step =", step.value, "mode before =", mode.value);
  // Yakunlashdan oldin 5-gacha bo'lgan steplarni ham tekshirib chiqamiz
  if (
    !validateStep1() ||
    !validateStep2() ||
    !validateStep3() ||
    !validateStep4() ||
    !validateStep5()
  ) {
    return;
  }
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
  const base = `${proxy.$locale}/v1/resume-create/pdf`;
  const params = new URLSearchParams({ lang });

  // Agar token bo'lsa, har doim query'ga qo'shamiz:
  // backenddagi query.token middleware uni Authorization headerga aylantiradi.
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  if (token) {
    params.append("token", token);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

const downloadPdf = (lang) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  if (!token) {
    toast.error("Token topilmadi. Iltimos, qayta kiring.");
    return;
  }

  // Telegram chatga yuborish: backend PDFni yaratib, bot orqali jo'natadi
  const url = `${proxy.$locale}/v1/resume-create/pdf/send-to-telegram?lang=${encodeURIComponent(
    lang
  )}&token=${encodeURIComponent(token)}`;

  axios
    .post(
      url,
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then(() => {
      toast.success("PDF Telegram chatga yuborildi. Chatdan yuklab olishingiz mumkin.");
    })
    .catch((e) => {
      console.error("❌ send-to-telegram error:", e.response?.data || e.message);
      toast.error("PDFni Telegram chatga yuborishda xatolik yuz berdi.");
    });
};

const downloadDocx = (lang) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  if (!token) {
    toast.error("Token topilmadi. Iltimos, qayta kiring.");
    return;
  }

  // DOCX faylini Telegram chatga yuborish (backend tavsiya qilgan ko'rinishda)
  axios
    .post(
      `${proxy.$locale}/v1/resume-create/docx/send-to-telegram`,
      null,
      {
        params: {
          lang,
          token,
        },
      }
    )
    .then(() => {
      toast.success("DOCX fayl Telegram chatga yuborildi. Chatdan yuklab olishingiz mumkin.");
    })
    .catch((e) => {
      console.error("❌ send-docx-to-telegram error:", e.response?.data || e.message);
      toast.error("DOCX faylini Telegram chatga yuborishda xatolik yuz berdi.");
    });
};

const handleBack = () => {
  // Agar preview rejimida bo'lsak, faqat wizardga qaytamiz
  if (mode.value === "preview") {
    mode.value = "wizard";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Aks holda bosh sahifaga qaytamiz
  goBackHome();
};

const goBackHome = () => {
  router.push({ name: "home" });
};

const openDownloadModal = () => {
  showDownloadModal.value = true;
};

const closeDownloadModal = () => {
  showDownloadModal.value = false;
};

const handleDownload = (lang) => {
  selectedDownloadLang.value = lang;
  // Faqat PDF ni Telegram chatga yuboramiz
  downloadPdf(selectedDownloadLang.value);
  showDownloadModal.value = false;
};
const phoneInput = ref(null);

onMounted(async () => {
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
      let digits = phoneInput.value.value.replace(/\D/g, "").slice(0, 9);

      // Format: 91 955 55 55   (2-3-2-2)
      let grouped = "";

      if (digits.length <= 2) {
        grouped = digits;
      } else if (digits.length <= 5) {
        grouped = `${digits.slice(0, 2)} ${digits.slice(2)}`;
      } else if (digits.length <= 7) {
        grouped = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      } else {
        grouped = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
      }

      form.personal.phone = grouped;
      phoneInput.value.value = grouped;
    });
  }
})
onMounted(fetchResume);
</script>

<style scoped>
/* 1) Chrome autofill sariqni butunlay o‘chiradi */
input:-webkit-autofill,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: inherit !important;
  transition: background-color 100000s ease-in-out 0s;
  box-shadow: 0 0 0px 1000px white inset !important;
}

/* 2) Browser default outline (sariq/orange)ni to‘liq o‘chiradi */
input:focus,
input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 3) Faqat ko‘k border ishlaydi */
#phone:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.3) !important;
}

</style>
