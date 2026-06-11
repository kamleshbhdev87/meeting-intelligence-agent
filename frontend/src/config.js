// On HuggingFace Spaces, nginx proxies /api/ to FastAPI
// Locally, we talk directly to port 8000
const isHuggingFace = window.location.hostname.includes('hf.space')
export const API_URL = isHuggingFace 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000')
