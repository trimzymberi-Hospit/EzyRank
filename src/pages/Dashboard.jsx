import Seo from "./Seo.jsx";
import Geo from "./Geo.jsx";
import Conversions from "./Conversions.jsx";
import WebPerformance from "./WebPerformance.jsx"

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-6">
        <h1 className="text-2xl text-white text-left font-bold font-logo">SEO Metrics</h1>
        <Seo />
        <h1 className="text-2xl text-white text-left font-bold font-logo mt-12">GEO Metrics</h1>
        <Geo />
        <h1 className="text-2xl text-white text-left font-bold font-logo mt-12">Conversions Metrics</h1>
        <Conversions />
        <h1 className="text-2xl text-white text-left font-bold font-logo mt-12">Web Performance Metrics</h1>
        <WebPerformance />
    </div>
  );
}
