import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist', 
        rollupOptions: {
            input: '/src/app.ts' 
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), 
        },
    },
    server: {
        port: 4000, // 设置开发服务器端口
    }
});