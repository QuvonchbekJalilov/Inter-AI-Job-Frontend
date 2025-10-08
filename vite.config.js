import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// ✅ Production uchun to‘liq konfiguratsiya
export default defineConfig(({ command, mode }) => ({
    base: './', // 👈 MUHIM: barcha assets nisbiy yo‘lda yuklanadi
    plugins: [
        vue(),
        vueDevTools(),
    ],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        emptyOutDir: true, // eski build fayllarni avtomatik tozalaydi
        rollupOptions: {
            output: {
                manualChunks: undefined, // CDN caching muammosini oldini oladi
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://api.inter-ai.uz',
                changeOrigin: true,
                secure: false,
            },
        },
    },
}))