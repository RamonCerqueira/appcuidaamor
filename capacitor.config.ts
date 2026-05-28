import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cuidaeamor.app',
  appName: 'CuidaAmor',
  webDir: 'out',
  server: {
    // Configuração de Live Reload para ambiente de desenvolvimento:
    // O aplicativo nativo vai carregar a interface diretamente do servidor Node.js (Next)
    url: 'http://10.71.0.103:3000',
    cleartext: true
  }
};

export default config;
