import type { MockUser, MockCampaign, LoginCredentials, AuthResult } from "@/types/mockup";

// Local storage utilities for managing application state
export const storage = {
  setItem: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Authentication utilities
export const auth = {
  login: (credentials: LoginCredentials): AuthResult => {
    // Mock authentication - in real app, this would make an API call
    if (credentials.username === "dmmaster" && credentials.password === "password123") {
      const user: MockUser = { id: 1, username: "dmmaster", name: "Master DM", email: "dm@dungeon.com" };
      storage.setItem("currentUser", user);
      return { success: true, user };
    }
    return { success: false, error: "Invalid credentials" };
  },

  logout: (): void => {
    storage.removeItem("currentUser");
    storage.removeItem("currentCampaign");
  },

  getCurrentUser: (): MockUser | null => {
    return storage.getItem<MockUser>("currentUser");
  },

  isAuthenticated: (): boolean => {
    return !!storage.getItem<MockUser>("currentUser");
  },
};

// Campaign utilities
export const campaigns = {
  setCurrent: (campaign: MockCampaign): void => {
    storage.setItem("currentCampaign", campaign);
  },

  getCurrent: (): MockCampaign | null => {
    return storage.getItem<MockCampaign>("currentCampaign");
  },

  clearCurrent: (): void => {
    storage.removeItem("currentCampaign");
  },
};
