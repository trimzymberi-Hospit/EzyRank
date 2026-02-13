import React, { useEffect, useState } from 'react'
import { useServices } from '../api/useServices';
import { useAuth } from '../auth/AuthContext';
import AiReferncedVisitorsCard from '../components/cards/AiReferncedVisitorsCard';
import PieChart from '../components/PieChart';
import SingleCard from '../components/cards/SingleCard';
import ai from '../assets/icons/ai.png'
import aiRef from '../assets/icons/aiRef.png'
import share from '../assets/icons/share.png'
import citation from '../assets/icons/citation.png'
import AreaChartCard from '../components/AreaChartCard';

export default function Geo() {
  const { seo, geo } = useServices();
  const [loading, setLoading] = useState(true);
  const [aiReferenceData, setAiReferencedData] = useState(null);
  const [geoKpis, setGeoKpis] = useState(null)
  const [rankingDistribtuion, setRankingDistribtuion] = useState()
  const [geoPerformanceTrend, setGeoPerformanceTrend] = useState([])
  const [pageVisibilityShare, setpageVisibilityShare] = useState([])

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const aiReferenceData = await geo.getAiRefernceVisitors();
        const geoKpisData = await geo.getGeoKPIs()
        const rankingDistribtuionData = await geo.getRankingDistribution()
        const performanceTrendData = await geo.getPerformanceTrend()
        const pageVisibilityShareData = await geo.getVisibilityShare()
        if (mounted){
          setAiReferencedData(aiReferenceData);
          setGeoKpis(geoKpisData)
          setRankingDistribtuion(rankingDistribtuionData)
          setGeoPerformanceTrend(performanceTrendData)
          setpageVisibilityShare(pageVisibilityShareData)
        } 
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [seo, geo]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row  gap-6 justify-around text-text-secondary w-full">
            <SingleCard tittle={"AI Overview Coverage Keywords"} value={geoKpis && geoKpis?.aiOverviewCoverage?.totalKeywords} loading={loading} img={ai}/>
            <SingleCard tittle={"AI Reference Visitors"} value={aiReferenceData && Object.values(aiReferenceData).reduce((sum, acc) => sum + acc) || 0} loading={loading} img={aiRef}/>
            <SingleCard tittle={"AI Citation Readiness"} value={geoKpis && geoKpis?.aiCitationReadiness?.aiOverviewKeywords} loading={loading} img={citation}/>
            <SingleCard tittle={"GEO Visibility Share"} value={`${pageVisibilityShare.page1Share} %`} loading={loading} img={share}/>
        </div>
          <AreaChartCard titleValue="Performance Trend" titleLabel='GEO Performance daily' data={geoPerformanceTrend}/>
      <div className="flex flex-col lg:flex-row gap-6 justify-around">
          <AiReferncedVisitorsCard data={aiReferenceData} loading={loading}/>
          <PieChart title='GEO Ranking Distribution' data={rankingDistribtuion} loading={loading}/>
      </div>
    </div>
  )
}
