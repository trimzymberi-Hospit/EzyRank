import React, { useEffect, useState } from 'react'
import SingleCard from '../components/cards/SingleCard';
import mailIcon from '../assets/icons/mail.png'
import phoneIcon from '../assets/icons/phone.png'
import contactFormIcon from '../assets/icons/contact form.png'
import salesIcon from '../assets/icons/sales.png'
import ConversionTable from '../components/ConversionTable';
import { useServices } from '../api/useServices';
import PieChart from '../components/PieChart';
import AreaChartCard from '../components/AreaChartCard';

export default function Conversions() {

  const { conversions } = useServices();
  const [loading, setLoading] = useState(true);
  const [leadsConversions, setLeadsConversions] = useState([])
  const [purchaseConversions, setPurchaseConversions] = useState([])

  const totalMailLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Mail"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalPhoneLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Phone"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalContactFormLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Contact"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalMapLeads = leadsConversions?.rows?.filter(lead => lead["dl_description"]?.includes("Map"))?.reduce((acc, curr) => acc + parseFloat(curr["dl_value"]), 0)
  const totalPurchase = purchaseConversions?.rows?.reduce((acc, curr) => acc + parseFloat(curr?.dl_value),0)
  
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
          if (leadConversionsResult.status === "fulfilled") {
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
            <SingleCard tittle={"Phone Clicks"} value={totalPhoneLeads || 0} loading={loading} img={phoneIcon}/>
            <SingleCard tittle={"Mail Clicks"} value={totalMailLeads} loading={loading} img={mailIcon}/>
            <SingleCard tittle={"Maps Clicks"} value={totalMapLeads} loading={loading} img={mailIcon}/>
            <SingleCard tittle={"Contact Form Submit"} value={totalContactFormLeads || 0} loading={loading} img={contactFormIcon}/>
            <SingleCard tittle={"Generated"} value={`${totalPurchase} CHF`} loading={loading} img={salesIcon}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
        {leadsConversions?.rows?.length > 0 && (
          <>
            <PieChart title='Traffic Distribution' data={[leadsConversions?.totalGoogleConversions, leadsConversions?.totalAiConversions]}/>
            <AreaChartCard titleLabel='Leads Performance' metric='conversions' data={leadsConversions?.dailyPerformance}/>
          </>
        )}
        {purchaseConversions?.rows?.length > 0 && (
          <>
            <PieChart title='Traffic Distribution' data={[purchaseConversions?.totalGoogleConversions, purchaseConversions?.totalAiConversions]}/>
            <AreaChartCard titleLabel='Purchase Performance' metric='conversions' data={purchaseConversions?.dailyPerformance}/>
          </>
        )}
        </div>
        <div className="flex flex-col gap mt-5 justify-around">
          {leadsConversions?.rows?.length > 0 && (
            <>
              <h1 className="text-2xl text-white text-left font-bold font-logo">
                All Lead Conversions
              </h1>
              <ConversionTable data={leadsConversions?.rows} />
            </>
          )}
          {purchaseConversions?.rows?.length > 0 && (
            <>
              <h1 className="text-2xl text-white text-left font-bold font-logo">
                All Purchase Conversions
              </h1>
              <ConversionTable data={purchaseConversions?.rows}/>
            </>
          )}
        </div>
    </div>
  )
}
