export function createDashboardService(api) {
    return {
      getAi() {
        return api.request("/dashboard/kpis");
      },
  
      getProfile() {
        return api.request("/me", { includeDateRange: false });
      },
    };
  }
  