import { ref, shallowRef, provide, inject, watch } from 'vue'

const I18N_KEY = Symbol('i18n')

// Vite will replace these imports at build time
const loaders = import.meta.glob('./lang/*.json')
const supported = ['uz', 'ru', 'en']

function createI18n(defaultLocale = (localStorage.getItem('locale') || 'uz')) {
  const locale = ref(supported.includes(defaultLocale) ? defaultLocale : 'uz')
  const translations = shallowRef({})

  const load = async (l) => {
    const path = `./lang/${l}.json`
    const loader = loaders[path]
    if (!loader) {
      console.warn(`[i18n-lite] Missing loader for locale: ${l}`)
      translations.value = {}
      return
    }
    try {
      const mod = await loader()
      translations.value = mod?.default || mod || {}
    } catch (e) {
      console.error('[i18n-lite] Failed to load locale', l, e)
      translations.value = {}
    }
  }

  // Load initial and react to changes
  watch(
    locale,
    (l) => {
      localStorage.setItem('locale', l)
      load(l)
    },
    { immediate: true }
  )

  const setLocale = (l) => {
    if (supported.includes(l)) locale.value = l
  }

  const t = (key, vars) => {
    const raw = translations.value?.[key]
    if (raw == null) return key
    if (!vars) return raw
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
      String(raw)
    )
  }

  return { locale, translations, t, setLocale, supported }
}

export function provideI18n(i18n = createI18n()) {
  provide(I18N_KEY, i18n)
  return i18n
}

export function useI18n() {
  const i18n = inject(I18N_KEY)
  if (!i18n) throw new Error('i18n not provided: call provideI18n() in root component')
  return i18n
}

