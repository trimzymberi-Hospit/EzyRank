import React, { useEffect, useState } from 'react'
import SingleCard from '../components/cards/SingleCard';
import mailIcon from '../assets/icons/mail.png'
import phoneIcon from '../assets/icons/phone.png'
import contactFormIcon from '../assets/icons/contact form.png'
import salesIcon from '../assets/icons/sales.png'
import ConversionTable from '../components/ConversionTable';
import { useServices } from '../api/useServices';

export default function Conversions() {

  const { conversions } = useServices();
  const [loading, setLoading] = useState(true);
  const [leadsConversions, setLeadsConversions] = useState([])
  const [purchaseConversions, setPurchaseConversions] = useState([])

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
            <SingleCard tittle={"Phone Clicks"} value={0} loading={loading} img={phoneIcon}/>
            <SingleCard tittle={"Mail Clicks"} value={0} loading={loading} img={mailIcon}/>
            <SingleCard tittle={"Contact Form Submit"} value={0} loading={loading} img={contactFormIcon}/>
            <SingleCard tittle={"Generated"} value={`${purchaseConversions?.reduce((acc, curr) => acc + parseFloat(curr?.dl_value),0)} CHF`} loading={loading} img={salesIcon}/>
        </div>
        <div className="flex flex-col gap mt-5 justify-around">
          {leadsConversions?.length > 0 && (
            <>
              <h1 className="text-2xl text-white text-left font-bold font-logo">
                Lead Conversions
              </h1>
              <ConversionTable data={leadsConversions} />
            </>
          )}
          {purchaseConversions?.length > 0 && (
            <>
              <h1 className='text-2xl text-white text-left font-bold font-logo mt-10'>Purchase Conversions</h1>
              <ConversionTable data={purchaseConversions}/>
            </>
          )}
        </div>

    </div>
  )
}
