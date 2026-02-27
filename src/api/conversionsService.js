export function createConversionsService(api){
    return {
        getLeadsConversions(){
            return api.request('/google-analytics/lead-conversions')
        },

        getPurchaseConversions(){
            return api.request('/google-analytics/purchase-conversions')
        }
    }
}