/**
 * Configuração de Ambiente
 * Define URLs, tokens, e variáveis baseadas no ambiente (dev, staging, prod)
 */

const ENV = {
  // Ambiente detectado (desenvolvimento, staging, produção)
  mode: import.meta.env.MODE || 'development',
  
  // URL do servidor backend
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
  
  // Configuração de WebSocket/Socket.io
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  
  // OneSignal App ID para notificações push
  oneSignalAppId: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  
  // API Key (se necessária para chamadas backend)
  apiKey: import.meta.env.VITE_API_KEY || '',
  
  // Ativa modo debug?
  debug: import.meta.env.VITE_DEBUG === 'true' || true,
};

// Valida configurações críticas
if (!ENV.serverUrl) {
  console.warn('⚠️ SERVER_URL não configurada. Usando localhost:3000');
}

export default ENV;
