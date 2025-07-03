// Import Zustand's create function
import { create } from "zustand";

// Your backend API endpoint for authentication
const API_URL = "http://localhost:3000/api/auth";

// Define the shape of the user (you can expand this as needed)
interface User {
  _id: string;
  name: string;
  email: string;
  // Add more fields if needed
}

// Define the shape of the auth store state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;

  signup: (email: string, password: string, name: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
}

// Create the Zustand store with full types
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  code: null,

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
}));
