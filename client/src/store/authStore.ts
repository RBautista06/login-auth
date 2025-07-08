// Import Zustand's create function
import { create } from "zustand";

// Your backend API endpoint for authentication
const API_URL = "http://localhost:3000/api/auth";

// Define the shape of the user (you can expand this as needed)
interface User {
  _id: string;
  name: string;
  email: string;
  message: null;
  // Add more fields if needed
}

// Define the shape of the auth store state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  message: null;
  password: string | null;

  signup: (email: string, password: string, name: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Create the Zustand store with full types
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  code: null,
  message: null,
  password: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || "Something went wrong", isLoading: false });
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error: any) {
      console.error(error);
      set({ isLoading: false, error: error.message });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message); // this will show in the front end what error is in the backend
      // ✅ You MUST receive `data.user` from the backend
      if (data.user) {
        set({
          isLoading: false,
          isAuthenticated: true,
          user: data.user,
          isCheckingAuth: false, // optional
        });
      } else {
        throw new Error("No user returned");
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.user) {
        set({ isCheckingAuth: false, isAuthenticated: true, user: data.user });
      } else {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      }
    } catch (error: any) {
      set({ isCheckingAuth: false, error: error.message });
      console.log(error);
      throw error;
    }
  },
  logout: async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    set({
      user: null,
      isAuthenticated: false,
    });
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log("Success:", data.message);
      set({ isLoading: false, message: data.message });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      set({ isLoading: false, message: data.message });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },
}));
