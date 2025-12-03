<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex w-full max-w-lg flex-col mb-3"
      >
        <div class="flex items-center">
          <div
            class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer"
          >
            {{ formatDate(item.created_at) }}
          </div>
        </div>
        <div class="flex flex-col bg-white px-4 rounded-tr-2xl">
          <h3 class="mb-2 mt-5 text-xl leading-tight font-medium w-4/5 truncate">
            {{ item.title }}
          </h3>
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="flex items-center text-gray-700 text-sm basis-2/5 truncate">
              <svg
                class="h-4 w-4 text-blue-600 mr-2 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ item.company }}
            </span>
          </div>
          <div class="mb-4 rounded-xl border border-red-100 bg-red-50 py-3 px-4 text-center">
            <p class="text-base uppercase tracking-wide text-red-600">
              Siz ishga taklif etilmadingiz
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  {
    id: 1,
    title: "Senior Backend Developer",
    company: "Example Corp",
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Acme Inc.",
    created_at: "2025-01-12T14:15:00Z",
  },
]

const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
</script>

<style scoped>
.outer:after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  background-image: radial-gradient(
      circle at 100% 100%,
      transparent 8px,
      white calc(4px + 1px)
  );
  bottom: 0;
  right: -8px;
  display: block;
  z-index: 1;
  transform: rotate(270deg);
}
</style>

