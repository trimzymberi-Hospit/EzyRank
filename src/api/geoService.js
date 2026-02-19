export function createGeoService(api) {
    return {
        getAiReferenceVisitors() {
            return api.request("/google-analytics/users-from-ai");
        },

        getAiOverviewCoverage(){
            return api.request("/semrush/ai-overview-coverage");
        },

        getGeoKPIs(){
            return api.request("/semrush/geo-kpis");
        },

        getRankingDistribution(){
            return api.request("/google-search-console/gsc/geo-position-distribution");
          },

          getPerformanceTrend(){
            return api.request(`/google-search-console/gsc/geo-performance-daily?&fillMissingDays=true`);
          },

          getVisibilityShare(){
            return api.request(`/google-search-console/gsc/page-one-visibility-share?`);
          },
    };
  }
  