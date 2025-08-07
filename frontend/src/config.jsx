const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://handwritten-numbers-production.up.railway.app/api"
  : "http://localhost:8000/api";

export const API_ENDPOINTS = {
  predict: `${API_BASE_URL}/predict`,
};