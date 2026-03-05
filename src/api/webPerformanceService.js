export function createWebPerformanceService(api){

    return {
        getWebPerformance(){
            return api.request("/website-performance/run-both")
        }
    }
}