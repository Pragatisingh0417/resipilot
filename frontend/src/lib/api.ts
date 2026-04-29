import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE,
  // withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {  
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR (IMPROVED)
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // ❌ Avoid infinite redirect loop
    if (status === 401) {
      const isLoginPage = window.location.pathname.includes("/login");

      localStorage.removeItem("token");

      if (!isLoginPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

// ✅ API METHODS
export const api = {
  get: (url: string, params?: any) =>
    client.get(url, { params }).then((r) => r.data),

  post: (url: string, data?: any) =>
    client.post(url, data).then((r) => r.data),

  put: (url: string, data?: any) =>
    client.put(url, data).then((r) => r.data),

  del: (url: string) =>
    client.delete(url).then((r) => r.data),

  // ✅ STREAM (FIXED + ROBUST)
  stream: async (url: string, data?: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    // ❌ Handle auth failure here also
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    return res;
  },
};

export default client;