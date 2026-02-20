// API Configuration
// These are public API endpoints used by the application

export const API_URL = 'https://hinime-two.vercel.app/api';

// Proxy server for CORS handling (subtitles, etc.)
export const PROXY_URL = 'https://zenime-1-qejh.onrender.com/?url=';

// M3U8 proxy servers for video streaming - multiple for fallback
export const M3U8_PROXY_URL = 'https://proxyfy-two.vercel.app/m3u8-proxy?url=';

// List of M3U8 proxy servers ordered by priority
export const M3U8_PROXIES = [
  'https://proxyfy-two.vercel.app/m3u8-proxy?url=',
  'https://m3u8-proxy-cors-anywhere.onrender.com/cors?url=',
  'https://cors-anywhere-oxpk.onrender.com/?url=',
];

// Timeout in ms before trying the next proxy
export const PROXY_TIMEOUT_MS = 8000;
