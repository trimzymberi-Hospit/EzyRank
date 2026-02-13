export function createSeoService(api) {
    return {
      // example endpoint: GET /seo/overview?startDate&endDate

      //   getKeywords({ country }) {
      //     return api.request(`/seo/keywords?country=${encodeURIComponent(country)}`);
      //   },
      getCountriesVisitors() {
        return api.request("/google-analytics/switzerland-and-users-share");
      },

      getTopKeywords() {
        return api.request("/semrush/top-keywords");
      },

      getChTrafficOrganic() {
        return api.request("/semrush/ch-traffic-organic");
      },

      getRankingDistribution(){
        return api.request("/google-search-console/gsc/ranking-distribution");
      },

      getTopVisitedPages() {
        return api.request(`/google-analytics/top-pages-ogranic-views`);
      },

      getPerformanceTrend() {
        return api.request(`/google-search-console/gsc/performance-trend?&aggregation=daily`);
      },

      getSeoMetricsFromDb(id) {
        return api.request(`/seo-metrics/${id}`, {
          includeDateRange: false
        });
      },
    };
  }
  