import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initialize fingerprint
let fingerprintPromise = null;

const getFingerprint = async () => {
  if (!fingerprintPromise) {
    fingerprintPromise = FingerprintJS.load().then(fp => fp.get());
  }
  const result = await fingerprintPromise;
  return result.visitorId;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// API methods
export const pollAPI = {
  // Create a new poll
  createPoll: async (pollData) => {
    const response = await api.post('/polls', pollData);
    return response.data;
  },

  // Get poll by share link
  getPoll: async (shareLink) => {
    const response = await api.get(`/polls/${shareLink}`);
    return response.data;
  },

  // Vote on a poll
  vote: async (shareLink, optionIndex) => {
    const fingerprint = await getFingerprint();
    const response = await api.post(`/polls/${shareLink}/vote`, {
      optionIndex,
      fingerprint,
    });
    return response.data;
  },

  // Get poll results
  getResults: async (shareLink) => {
    const response = await api.get(`/polls/${shareLink}/results`);
    return response.data;
  },
};

export default api;
