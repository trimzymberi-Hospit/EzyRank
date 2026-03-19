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
            <SingleCard tittle={"Organic Traffic"} value={new Intl.NumberFormat('de-CH').format(seoMetricsFromDb?.organicTraffic)} loading={loading} img={trafficIcon} description={'The estimated number of visitors coming to your website from unpaid search results (like Google), without ads. This value reflects the latest available data and does not change with the date filter!'}/>
            <SingleCard tittle={"Visibility Index"} value={seoMetricsFromDb?.visibilityIndex} loading={loading} img={VisibilityIcon} description={'A score that shows how visible your website is in search engine results based on your keyword rankings. Higher visibility means your site appears more often and in better positions. This value reflects the latest available data and does not change with the date filter!'}/>
            <SingleCard tittle={"CH Organic Traffic"} value={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.organicTraffic)} loading={loading} img={switzerland} description={'The estimated number of visitors coming to your website from Switzerland through organic (unpaid) search results. This value reflects the latest available data and does not change with the date filter!'}/>
            <SingleCard tittle={"Authority Score"} value={chTrafficOrganic?.authorityScore} loading={loading} img={score} description={'A metric that indicates how strong and trustworthy your website is, based on factors like backlinks and overall SEO performance. Higher scores suggest better ability to rank. This value reflects the latest available data and does not change with the date filter!'}/>
            <SingleCard tittle={"Organic Keywords"} value={new Intl.NumberFormat('de-CH').format(seoMetricsFromDb?.organicKeywords)} loading={loading} img={keywords} description={'The number of search terms (keywords) for which your website appears in search engine results. This value reflects the latest available data and does not change with the date filter!'}/>
            <SingleCard tittle={"CH Organic Keywords"} value={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.organicKeywords)} loading={loading} img={switzerland} description={'The number of search terms (keywords) for which your website appears in search engine results from Switzerland. This value reflects the latest available data and does not change with the date filter!'}/>
        </div>
            <AreaChartCard description={'The number of times your website appeared in Google search results each day, even if no one clicked on it.'} metric='impressions' titleValue="Performance Trend" titleLabel='Impressions Performance daily' data={[...performanceTrend].filter(c => c.impressions !== 0)} desc="Notice: it takes 1 day for correct data!"/>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
            <PieChart title='Ranking Distribution' data={rankingDistribtuion} 
            description={`Ranking Distribution Shows how your keywords are spread across search ranking positions.Top 3% of keywords in positions 1–3 (highest visibility).4–10% of keywords on page 1 (strong visibility).11–20% of keywords on page 2 (moderate visibility).21–100% of keywords beyond page 2 (low visibility, growth opportunity). This value reflects the latest available data and does not change with the date filter!`}/>
            <PieChart title="Website Traffic By Country" data={countriesVisitors} description={'Percentage breakdown of your website traffic by top 5 most visited countries.'}/>
            <TopKeywordsVolume data={topKeywords} tittle="Top Keywords" description={'Shows your highest-ranking keywords and their current positions in search results. This value reflects the latest available data and does not change with the date filter!'}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
            <TopViewedPagesCard title="Top Visited Pages" data={topViewedPages} loading={loading} description={'Your websites pages visitors order from Hight to Low'}/>
            <LegendAreaChart weeks={seoMetricsFromDb?.backLinksLast6Months?.weeks} titleLabel='New vs Lost backlinks (weekly)' description={'New and Lost Backlinks total number between 6 days for Last 6 Months. This value reflects the latest available data and does not change with the date filter!'} total={new Intl.NumberFormat('de-CH').format(chTrafficOrganic?.totalBacklinks)}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
             
        </div>
    </div>
  )
}
