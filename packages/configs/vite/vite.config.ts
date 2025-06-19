import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const CURRENT_WORKING_DIRECTORY = process.cwd();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(CURRENT_WORKING_DIRECTORY, './src'),
    },
  },
});
