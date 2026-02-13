export function createAdminService(api){
    return {

        getAllClients(){
            return api.request("/seo-metrics")
        },

        updateMetrics(id, body){
            return api.request(`/seo-metrics/${id}`, {
                method: "PUT",
                body,
                includeDateRange: false
              });
        }
    }
}