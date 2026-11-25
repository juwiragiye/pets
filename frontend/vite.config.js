
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],

    server: {
        port: 5173,
        strictPort: true,
    },

    test: {
        environment: 'jsdom',
        include: ['tests/**/*.test.js'],

        clearMocks: true,
        restoreMocks: true,
        unstubGlobals: true,

        coverage: {
            provider: 'v8',
            include: ['src/**/*.js'],
            reporter: ['text', 'html'],
        },
    },
});
