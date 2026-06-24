import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 52136,
        watch: {
            // Prevent Vite from watching Visual Studio's internal .vs folder
            ignored: ['**/.vs/**']
        }
    }
})