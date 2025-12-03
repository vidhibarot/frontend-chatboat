import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
console.log("opammmm", API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  register: async (email: string, password: string, fullName?: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      fullName,
    });
    return data;
  },
};

// Session APIs
export const sessionAPI = {
  getAll: async () => {
    const { data } = await api.get("/sessions");
    return data;
  },
  create: async (userId: string, userName?: string, userEmail?: string) => {
    const { data } = await api.post("/sessions", {
      userId,
      userName,
      userEmail,
    });
    return data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/sessions/${id}/status`, { status });
    return data;
  },
};

// Message APIs
export const messageAPI = {
  getBySession: async (sessionId: string) => {
    const { data } = await api.get(`/chat/messages/${sessionId}`);
    return data;
  },
  create: async (
    sessionId: string,
    senderType: "user" | "admin",
    content: string,
    senderId?: string
  ) => {
    const { data } = await api.post("/chat/messages", {
      sessionId,
      senderType,
      senderId,
      content,
    });
    return data;
  },
  markAsRead: async (id: string) => {
    const { data } = await api.patch(`/chat/messages/${id}/read`);
    return data;
  },
};
