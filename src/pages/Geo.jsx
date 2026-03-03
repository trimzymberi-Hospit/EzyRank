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
  const {user} = useAuth()
  const { seo, geo } = useServices();
  const [loading, setLoading] = useState(true);
  const [aiReferenceData, setAiReferencedData] = useState(null);
  const [geoKpis, setGeoKpis] = useState(null)
  const [rankingDistribtuion, setRankingDistribtuion] = useState()
  const [geoPerformanceTrend, setGeoPerformanceTrend] = useState([])
  const [pageVisibilityShare, setpageVisibilityShare] = useState([])
  const [seoMetricsFromDb, setSeoMetricsFromDb] = useState()

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [
          aiReferenceResult,
          geoKpisResult,
          rankingDistribtuionResult,
          performanceTrendResult,
          pageVisibilityShareResult,
          seoMetricsFromDbResult,
        ] = await Promise.allSettled([
          geo.getAiReferenceVisitors(),
          geo.getGeoKPIs(),
          geo.getRankingDistribution(),
          geo.getPerformanceTrend(),
          geo.getVisibilityShare(),
          seo.getSeoMetricsFromDb(user.id),
        ]);

        if (mounted) {
          if (aiReferenceResult.status === "fulfilled") {
            setAiReferencedData(aiReferenceResult.value);
          }
          if (geoKpisResult.status === "fulfilled") {
            setGeoKpis(geoKpisResult.value);
          }
          if (rankingDistribtuionResult.status === "fulfilled") {
            setRankingDistribtuion(rankingDistribtuionResult.value);
          }
          if (performanceTrendResult.status === "fulfilled") {
            setGeoPerformanceTrend(performanceTrendResult.value);
          }
          if (pageVisibilityShareResult.status === "fulfilled") {
            setpageVisibilityShare(pageVisibilityShareResult.value);
          }
          if (seoMetricsFromDbResult.status === "fulfilled") {
            setSeoMetricsFromDb(seoMetricsFromDbResult.value);
          }
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
            <SingleCard tittle={"AI Citations"} value={seoMetricsFromDb?.aICitationReadiness} loading={loading} img={citation}/>
            <SingleCard tittle={"GEO Visibility Share"} value={`${pageVisibilityShare.page1Share} %`} loading={loading} img={share}/>
        </div>
          <AreaChartCard metric='impressions' titleValue="Performance Trend" titleLabel='GEO Performance daily' data={geoPerformanceTrend} desc="Notice: it takes 1-3 days for correct data!"/>
      <div className="flex flex-col lg:flex-row gap-6 justify-around">
          <AiReferncedVisitorsCard data={aiReferenceData} loading={loading}/>
          <PieChart title='GEO Ranking Distribution' data={rankingDistribtuion} loading={loading}/>
      </div>
    </div>
  )
}
