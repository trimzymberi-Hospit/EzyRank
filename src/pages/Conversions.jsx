import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx';
import SingleCard from '../components/cards/SingleCard';
import mailIcon from '../assets/icons/mail.png'
import phoneIcon from '../assets/icons/phone.png'
import contactFormIcon from '../assets/icons/contact form.png'
import salesIcon from '../assets/icons/sales.png'
import mapIcon from '../assets/icons/map.png'
import ConversionTable from '../components/ConversionTable';
import { useServices } from '../api/useServices';
import PieChart from '../components/PieChart';
import AreaChartCard from '../components/AreaChartCard';

export default function Conversions() {
  const { user } = useAuth();
  const geoEnabled = user?.geoService !== false;

  const { conversions } = useServices();
  const [loading, setLoading] = useState(true);
  const [leadsConversions, setLeadsConversions] = useState([])
  const [purchaseConversions, setPurchaseConversions] = useState([])

  const totalMailLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Mail"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalPhoneLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Phone"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalContactFormLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Contact"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalMapLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Map"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalPurchase = purchaseConversions?.rows?.reduce(
    (acc, curr) => {
      const value = parseFloat(curr?.dl_value ?? '');
      return acc + (Number.isNaN(value) ? 0 : value);
    },
    0
  )?.toString().slice(0, 7);

  const filteredLeadsRows = leadsConversions?.rows?.filter(
    (conversion) =>
      !conversion?.sessionSource ||
      String(conversion?.sessionSource).toLowerCase().includes("google") ||
      String(conversion?.dl_originsource).toLowerCase().includes("google")
  );

  const filteredPurchaseRows = purchaseConversions?.rows?.filter(
    (conversion) =>
      !conversion?.sessionSource ||
      String(conversion?.sessionSource).toLowerCase().includes("google") ||
      String(conversion?.dl_originsource).toLowerCase().includes("google")
  );

  const leadRowsToShow = geoEnabled ? leadsConversions?.rows : filteredLeadsRows;
  const purchaseRowsToShow = geoEnabled ? purchaseConversions?.rows : filteredPurchaseRows;
  
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [
          leadConversionsResult,
          purchaseConversionsResult,
        ] = await Promise.allSettled([
          conversions.getLeadsConversions(),
          conversions.getPurchaseConversions()
        ])
        if (mounted) {
          if (leadConversionsResult.status === "fulfilled") {
            setLeadsConversions(leadConversionsResult.value);
          }
          if (purchaseConversionsResult.status === "fulfilled") {
            setPurchaseConversions(purchaseConversionsResult.value);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [conversions]);

  return (
    <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row  gap-6 justify-around text-text-secondary w-full">
            <SingleCard tittle={"Phone Clicks"} value={`${new Intl.NumberFormat('de-CH').format(totalPhoneLeads)} CHF`} loading={loading} img={phoneIcon} description={'Total Value of Phone Clicks'}/>
            <SingleCard tittle={"Mail Clicks"} value={`${new Intl.NumberFormat('de-CH').format(totalMailLeads)} CHF`} loading={loading} img={mailIcon} description={'Total Value of Mail Clicks'}/>
            <SingleCard tittle={"Maps Clicks"} value={`${new Intl.NumberFormat('de-CH').format(totalMapLeads)} CHF`} loading={loading} img={mapIcon} description={'Total Value of Map Clicks'}/>
            <SingleCard tittle={"Contact Form Submit"} value={`${new Intl.NumberFormat('de-CH').format(totalContactFormLeads)} CHF`} loading={loading} img={contactFormIcon} description={'Total Value of Contact Form Submit'}/>
            <SingleCard tittle={"Generated"} value={`${new Intl.NumberFormat('de-CH').format(totalPurchase)} CHF`} loading={loading} img={salesIcon} description={'Total Value of purchase from your website'}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
        {leadsConversions?.rows?.length > 0 && (
          <>
            <PieChart
              title='Traffic Distribution'
              data={
                geoEnabled
                  ? [leadsConversions?.totalGoogleConversions, leadsConversions?.totalAiConversions]
                  : [leadsConversions?.totalGoogleConversions]
              }
              description={'The percentage of Traffic Distribution betwen Organic Traffic and AI'}
            />
            <AreaChartCard titleLabel='Leads Performance' metric='conversions' data={[...leadsConversions?.dailyPerformance].reverse()} description={'The number of times lead generated between your selected days'}/>
          </>
        )}
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
        {purchaseConversions?.rows?.length > 0 && (
          <>
            <PieChart
              title='Traffic Distribution'
              data={
                geoEnabled
                  ? [purchaseConversions?.totalGoogleConversions, purchaseConversions?.totalAiConversions]
                  : [purchaseConversions?.totalGoogleConversions]
              }
              description={'The percentage of Traffic Distribution betwen Organic Traffic and AI'}
            />
            <AreaChartCard titleLabel='Purchase Performance' metric='conversions' data={[...purchaseConversions?.dailyPerformance].reverse()} description={'The number of times purchase generated between your selected days'}/>
          </>
        )}
        </div>
        <div className="flex flex-col gap mt-5 justify-around">
        {purchaseRowsToShow?.length > 0 && (
            <>
              <h1 className="text-2xl text-white text-left font-bold font-logo mt-6">
                All Purchase Conversions
              </h1>
              <ConversionTable data={purchaseRowsToShow}/>
            </>
          )}
          {leadRowsToShow?.length > 0 && (
            <>
              <h1 className="text-2xl text-white text-left font-bold font-logo mt-6">
                All Lead Conversions
              </h1>
              <ConversionTable data={leadRowsToShow} />
            </>
          )}
          
        </div>
    </div>
  )
}
