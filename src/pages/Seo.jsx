import React, { useEffect, useState } from 'react'
import SingleCard from '../components/cards/SingleCard'
import { useServices } from "../api/useServices.js";
import PieChart from '../components/PieChart.jsx';
import TopKeywordsVolume from '../components/cards/TopKeywordsVolume.jsx';
import TopViewedPagesCard from '../components/cards/TopViewedPagesCard.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import trafficIcon from '../assets/icons/traffic-icon.png'
import VisibilityIcon from '../assets/icons/visibility.png'
import switzerland from '../assets/icons/switzerland.png'
import score from '../assets/icons/score.png'
import links from '../assets/icons/links.png'
import AreaChartCard from '../components/AreaChartCard.jsx';
import keywords from '../assets/icons/keywords.png'
import LegendAreaChart from '../components/cards/LegendAreaChart.jsx';


export default function Seo() {
  const {user} = useAuth()
  const { seo } = useServices();
  const [loading, setLoading] = useState(true); 
  const [topKeywords, settopKeywords] = useState([]);
  const [topViewedPages, setTopViewedPages] = useState([]);
  const [chTrafficOrganic, setChTrafficOrganic] = useState();
  const [rankingDistribtuion, setRankingDistribtuion] = useState()
  const [performanceTrend, setPerformanceTrend] = useState([])
  const [seoMetricsFromDb, setSeoMetricsFromDb] = useState([])
  const [countriesVisitors, setCountriesVisitors] = useState(null);

    useEffect(() => {
      let mounted = true;
  
      (async () => {
        setLoading(true);
        try {
          const [
            countriesVisitorsResult,
            topKeywordsResult,
            topViewedPagesResult,
            chTrafficOrganicResult,
            rankingDistribtuionResult,
            performanceTrendResult,
            seoMetricsFromDbResult,
          ] = await Promise.allSettled([
            seo.getCountriesVisitors(),
            seo.getTopKeywords(),
            seo.getTopVisitedPages(),
            seo.getChTrafficOrganic(),
            seo.getRankingDistribution(),
            seo.getPerformanceTrend(),
            seo.getSeoMetricsFromDb(user.id),
          ]);

          if (mounted) {
            if (countriesVisitorsResult.status === "fulfilled") {
              setCountriesVisitors(countriesVisitorsResult.value);
            }
            if (topKeywordsResult.status === "fulfilled") {
              settopKeywords(topKeywordsResult.value);
            }
            if (topViewedPagesResult.status === "fulfilled") {
              setTopViewedPages(topViewedPagesResult.value);
            }
            if (chTrafficOrganicResult.status === "fulfilled") {
              setChTrafficOrganic(chTrafficOrganicResult.value);
            }
            if (rankingDistribtuionResult.status === "fulfilled") {
              setRankingDistribtuion(rankingDistribtuionResult.value);
            }
            if (performanceTrendResult.status === "fulfilled") {
              setPerformanceTrend(performanceTrendResult.value);
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
    }, [seo]);

  return (
    <div className="w-full flex flex-col gap-6">
         <div className="flex flex-col lg:flex-row  gap-6 justify-around text-text-secondary w-full">
            <SingleCard tittle={"Organic Traffic"} value={new Intl.NumberFormat('de-CH').format(seoMetricsFromDb?.organicTraffic)} loading={loading} img={trafficIcon}/>
            <SingleCard tittle={"Visibility Index"} value={seoMetricsFromDb?.visibilityIndex} loading={loading} img={VisibilityIcon}/>
            <SingleCard tittle={"Switzerland Traffic"} value={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.organicTraffic)} loading={loading} img={switzerland}/>
            <SingleCard tittle={"Authority Score"} value={chTrafficOrganic?.authorityScore} loading={loading} img={score}/>
            <SingleCard tittle={"Backlinks Tottal"} value={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.totalBacklinks)} loading={loading} img={links}/>
            <SingleCard tittle={"Organic Keywords"} value={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.organicKeywords)} loading={loading} img={keywords}/>
        </div>
            <AreaChartCard metric='impressions' titleValue="Performance Trend" titleLabel='Impressions Performance daily' data={[...performanceTrend].filter(c => c.impressions !== 0)} desc="Notice: it takes 1 day for correct data!"/>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
            <PieChart title='Ranking Distribution' data={rankingDistribtuion}/>
            <PieChart title="Website Traffic By Country" data={countriesVisitors} />
            <TopKeywordsVolume data={topKeywords} tittle="Top Keywords"/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
            <TopViewedPagesCard title="Top Visited Pages" data={topViewedPages} loading={loading}/>
            <LegendAreaChart weeks={seoMetricsFromDb?.backLinksLast6Months?.weeks} titleLabel='New vs Lost backlinks (weekly)'/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
             
        </div>
    </div>
  )
}
