import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const displayName = user?.companyName

  return (
    <div className="relative cursor-pointer bg-app-third rounded-2xl" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/10 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center text-sm">
          {displayName.slice(0, 1).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-app-foreground leading-4">
            {displayName}
          </div>
        </div>
        <span className="text-app-foreground/80">▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0b1636] shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-1"
        >
          {/* You can add Settings later */}
          {/* <button
            role="menuitem"
            onClick={() => { setOpen(false); navigate("/settings"); }}
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-app-foreground/80 hover:bg-white/10"
          >
            Settings
          </button> */}

          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("/login", { replace: true });
            }}
            className="w-full text-left cursor-pointer rounded-lg px-3 py-2 text-sm text-app-foreground/80 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
