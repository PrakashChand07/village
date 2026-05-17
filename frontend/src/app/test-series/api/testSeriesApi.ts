import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Auth ──────────────────────────────────────────────────────
export const userAuthAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    axios.post(`${API_BASE}/user/auth/register`, data),

  verifyOTP: (data: { email: string; otp: string }) =>
    axios.post(`${API_BASE}/user/auth/verify-otp`, data),

  login: (data: { email: string; password: string }) =>
    axios.post(`${API_BASE}/user/auth/login`, data),

  getMe: (token: string) =>
    axios.get(`${API_BASE}/user/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
};

// ── Test Series ───────────────────────────────────────────────
export const testSeriesAPI = {
  getAll: (params?: { category?: string; difficulty?: string }) =>
    axios.get(`${API_BASE}/test-series`, { params }),

  getById: (id: string) =>
    axios.get(`${API_BASE}/test-series/${id}`),
};

// ── Tests ─────────────────────────────────────────────────────
export const testsAPI = {
  getBySeries: (seriesId: string) =>
    axios.get(`${API_BASE}/tests/series/${seriesId}`),

  getById: (id: string) =>
    axios.get(`${API_BASE}/tests/${id}`),
};

// ── Questions ─────────────────────────────────────────────────
export const questionsAPI = {
  getForTest: (testId: string, token: string) =>
    axios.get(`${API_BASE}/questions/test/${testId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ── Attempts ─────────────────────────────────────────────────
export const attemptsAPI = {
  submit: (data: { testId: string; answers: { questionId: string; selectedOption: number | null }[]; timeTaken: number }, token: string) =>
    axios.post(`${API_BASE}/attempts`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getById: (id: string, token: string) =>
    axios.get(`${API_BASE}/attempts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getMyHistory: (token: string) =>
    axios.get(`${API_BASE}/attempts/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ── Payment ───────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (testSeriesId: string, token: string) =>
    axios.post(`${API_BASE}/payment/create-order`, { testSeriesId }, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; testSeriesId: string }, token: string) =>
    axios.post(`${API_BASE}/payment/verify`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getMyPurchases: (token: string) =>
    axios.get(`${API_BASE}/payment/my-purchases`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  checkAccess: (seriesId: string, token: string) =>
    axios.get(`${API_BASE}/payment/check-access/${seriesId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
