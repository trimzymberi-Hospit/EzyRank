import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useAuthedApi() {
  const { token, logout } = useAuth();
  const nav = useNavigate();

  async function request(url, options = {}) {
    try {
      return await apiFetch(url, { ...options, token });
    } catch (err) {
      if (err.status === 401) {
        logout();
        nav("/login", { replace: true });
      }
      throw err;
    }
  }

  return { request };
}
