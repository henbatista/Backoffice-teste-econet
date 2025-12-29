import { defineStore } from "pinia";

const STORAGE_KEY = "auth_user";

export interface AuthUser {
  name: string;
  email: string;
}

const readUser = (): AuthUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    return null;
  }
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: readUser() as AuthUser | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    userName: (state) => (state.user ? state.user.name : "Usuário"),
  },
  actions: {
    login(payload: AuthUser) {
      const user = {
        name: payload.name,
        email: payload.email,
      };
      this.user = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
