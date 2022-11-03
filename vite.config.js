import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: false,
    mode: 'development',
    build: {
        emptyOutDir: false,
        outDir: 'public/app',
        assetsDir: 'build',
        rollupOptions: {
            input: 'src/main.js',
            output: {
                assetFileNames: 'build/[name].[ext]',
                entryFileNames: 'build/[name].js'
            }
        }
    },
    plugins: [
        svelte({
            compilerOptions: {
                css: false
            }
        })
    ]
});