import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useDateRange } from "../context/DateRangeContext.jsx";

import { createApiClient } from "./apiClient.js";
import { createSeoService } from "./seoService.js";
import { createGeoService } from "./geoService.js";
import { createDashboardService } from "./dashboardService.js";
import { createAdminService } from "./adminService.js"


export function useServices() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { startDate, endDate } = useDateRange();

  const api = useMemo(() => {
    return createApiClient({
      getToken: () => token,
      getDateRange: () => ({ startDate, endDate }),
      onUnauthorized: () => {
        logout();
        navigate("/login", { replace: true });
      },

    });
  }, [token, startDate, endDate, logout, navigate]);

  return useMemo(() => {
    return {
      seo: createSeoService(api),
      geo: createGeoService(api),
      dashboard: createDashboardService(api),
      admin: createAdminService(api)
    };
  }, [api]);
}
