import path from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
    // Load all environment variables
    const env = loadEnv(mode, process.cwd(), '');
    // const GEMINI_API_KEY_VALUE = env.VITE_GEMINI_API_KEY; // REMOVED

    return {
        base: './', // <--- fixes blank page on Vercel
        server: {
            port: 5173,
            host: '0.0.0.0',
        },
        plugins: [react()],
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                        ui: ['lucide-react', 'framer-motion', 'swiper'],
                        firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
                    },
                },
            },
        },
        define: {
            // 'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(GEMINI_API_KEY_VALUE), // REMOVED FOR SECURITY
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            },
        },
    };
});
