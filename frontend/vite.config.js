// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Эта строка нужна, чтобы ваш сервер был доступен из локальной сети
    host: true, 

    // Это решение вашей проблемы
    hmr: {
      host: 'localhost',
    },
    // Добавляем ngrok в список разрешенных хостов
    // Регулярное выражение /.ngrok-free\.app$/ разрешает любой адрес,
    // который заканчивается на .ngrok-free.app
    allowedHosts: ['.ngrok-free.app'] 
  }
});