import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// TODO: cambia este nombre por el nombre REAL del repo
const repoName = 'quiz-angostura';

export default defineConfig({
  plugins: [react()],
});
