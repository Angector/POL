import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// اگر اسم ریپو عوض شد، مقدار base هم باید تغییر کند
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/mind-citadel/',
  server: {
    port: 5173,
  },
});
