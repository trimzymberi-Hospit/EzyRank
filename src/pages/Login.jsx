import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext";
import logo from '../assets/Logo-Brand half white.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: { username, password },
      });

      // data = { accessToken, user }
      login(data);
      if (user?.role === "SUPERADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-app text-text flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border-4 border-app-secondary shadow-[0_0_40px_rgba(182,0,155,0.25)] p-6">
        <div className="flex-col text-center justify-center items-center gap-2">
            <img src={logo} alt="Ezy One logo" className="h-24 mb-6"/>
        </div>

        <label className="mt-5 block text-sm font-medium">Username</label>
        <input
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-black text-center cursor-pointer disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
 
      
    </div>
  );
}
