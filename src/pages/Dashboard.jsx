import React, { useEffect, useState } from "react";
import SingleCard from "../components/cards/SingleCard.jsx";
import PieChart from "../components/PieChart.jsx";
import AiReferncedVisitorsCard from "../components/cards/AiReferncedVisitorsCard.jsx";
import { useServices } from "../api/useServices.js";
import { useAuth } from "../auth/AuthContext.jsx";
import trafficIcon from '../assets/icons/traffic-icon.png'
import robot from '../assets/icons/robot.png'
import lead from '../assets/icons/lead.png'
import VisibilityIcon from '../assets/icons/visibility.png'



export default function Dashboard() {
    const {user} = useAuth()
    const { seo, geo } = useServices();
    const [loading, setLoading] = useState(true);
    const [aiReferenceData, setAiReferencedData] = useState(null);
    const [countriesVisitors, setCountriesVisitors] = useState(null);
    const [topViewedPages, setTopViewedPages] = useState([]);
    const [chTrafficOrganic, setChTrafficOrganic] = useState();
    const [seoMetricsFromDb, setSeoMetricsFromDb] = useState([])
    
    useEffect(() => {
      let mounted = true;
  
      (async () => {
        setLoading(true);
        try {
          const countriesVisitorsData = await seo.getCountriesVisitors()
          const aiReferenceData = await geo.getAiReferenceVisitors();
          const topViewedPagesData = await seo.getTopVisitedPages();
          const chTrafficOrganicData = await seo.getChTrafficOrganic()
          const seoMetricsFromDbData = await seo.getSeoMetricsFromDb(user.id)
          if (mounted){
            setAiReferencedData(aiReferenceData);
            setCountriesVisitors(countriesVisitorsData)
            setTopViewedPages(topViewedPagesData)
            setChTrafficOrganic(chTrafficOrganicData)
            setSeoMetricsFromDb(seoMetricsFromDbData)
          } 
        } finally {
          if (mounted) setLoading(false);
        }
      })();
  
      return () => { mounted = false; };
    }, [geo, seo]);
  return (
    <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row  gap-6 justify-around text-text-secondary w-full">
            <SingleCard tittle={"Organic Traffic"} value={seoMetricsFromDb?.organicTraffic} loading={loading} img={trafficIcon}/>
            <SingleCard tittle={"AI Reference"} value={aiReferenceData && Object.values(aiReferenceData).reduce((sum, acc) => sum + acc)} loading={loading} img={robot}/>
            <SingleCard tittle={"Lead Clicks"} value={topViewedPages.length > 0 && topViewedPages.find(c => c?.pagePath?.includes("contact") || c?.pagePath?.includes("kontakt"))?.views || 0} loading={loading} img={lead}/>
            <SingleCard tittle={"Visibility Index"} value={seoMetricsFromDb?.visibilityIndex} loading={loading} img={VisibilityIcon}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 justify-around">
            <PieChart title="Website Traffic" data={countriesVisitors} />
            <AiReferncedVisitorsCard data={aiReferenceData} loading={loading}/>
        </div>
    </div>
  );
}
