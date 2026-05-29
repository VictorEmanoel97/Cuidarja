import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cuidarja.app',
  appName: 'CuidarJá',
  webDir: 'dist', // Apontando para o build do Vite
  server: {
    // Configurável por ambiente via .env
    url: process.env.VITE_SERVER_URL || 'http://localhost:3000',
    cleartext: process.env.NODE_ENV !== 'production'
  }
};

export default config;
