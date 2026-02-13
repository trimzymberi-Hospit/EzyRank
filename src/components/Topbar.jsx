import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu.jsx";
import DateRangePicker from "./DateRangePicker.jsx";
import { useAuth } from "../auth/AuthContext";


export default function Topbar({ onMenuClick }) {
  const {user} = useAuth()
  const location = useLocation();
  const TITLE_MAP = {
    "/dashboard": "Dashboard",
    "/seo": "SEO",
    "/geo": "GEO",
  };

  const title = TITLE_MAP[location.pathname] || "Dashboard";

  return (
    <header className="h-20 flex mt-8 md:mt-0 items-center justify-between px-4 bg-app">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-app-foreground"
          aria-label="Open menu"
        >
          ☰
        </button>

        
      </div>
      {user?.role === "ADMIN" && <DateRangePicker />}
      <UserMenu />
    </header>
  );
}
