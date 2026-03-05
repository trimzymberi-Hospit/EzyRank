import React, { useEffect, useState } from 'react'
import speed from '../assets/icons/speed.png'
import eye from '../assets/icons/eye.png'
import switch1 from '../assets/icons/switch.png'
import time from '../assets/icons/time.png'
import timer from '../assets/icons/timer.png'
import SingleCard from '../components/cards/SingleCard'
import { useServices } from '../api/useServices'
import ScoreDonutCard from '../components/ScoreDonutCard'

export default function WebPerformance() {

    const platformTypes = {
      desktop : 'Desktop',
      mobile: 'Mobile'
    }
  const { webPerformance } = useServices();
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('Desktop')
  const [webPerformanceData, setWebPerformanceData] = useState()
  
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [
            webPerformanceResult,
        ] = await Promise.allSettled([
            webPerformance.getWebPerformance(),
        ])
        if (mounted) {
          if (webPerformanceResult.status === "fulfilled") {
            setWebPerformanceData(webPerformanceResult.value);
          }

        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [webPerformance]);

  const lcp = platform === platformTypes.desktop ? webPerformanceData?.desktop?.lab?.lcpMs : webPerformanceData?.mobile?.lab?.lcpMs;
  const fcp = platform === platformTypes.desktop ? webPerformanceData?.desktop?.lab?.fcpMs : webPerformanceData?.mobile?.lab?.fcpMs;
  const cls = platform === platformTypes.desktop ? webPerformanceData?.desktop?.lab?.cls : webPerformanceData?.mobile?.lab?.cls;
  const tbt = platform === platformTypes.desktop ? webPerformanceData?.desktop?.lab?.tbtMs : webPerformanceData?.mobile?.lab?.tbtMs;
  const tti = platform === platformTypes.desktop ? webPerformanceData?.desktop?.lab?.ttiMs : webPerformanceData?.mobile?.lab?.ttiMs;
  const performance = platform === platformTypes.desktop ? webPerformanceData?.desktop?.scores?.performance : webPerformanceData?.mobile?.scores?.performance;
  const accessibility = platform === platformTypes.desktop ? webPerformanceData?.desktop?.scores?.accessibility : webPerformanceData?.mobile?.scores?.accessibility;
  const bestPractices = platform === platformTypes.desktop ? webPerformanceData?.desktop?.scores?.bestPractices : webPerformanceData?.mobile?.scores?.bestPractices;
  const seo = platform === platformTypes.desktop ? webPerformanceData?.desktop?.scores?.seo : webPerformanceData?.mobile?.scores?.seo;



  return (
    <div className='w-full flex flex-col gap-6'>
        <div className="flex rounded-2xl bg-[#151c33] w-64" role="group">
            <button 
                type="button" 
                className={`flex justify-center gap-2 text-body w-32 ${platform === platformTypes.desktop ? "bg-app-third" : "bg-[#151c33]"} cursor-pointer hover:text-heading font-medium leading-5  rounded-2xl text-sm px-3 py-2 focus:outline-none`}
                onClick={() => setPlatform(platformTypes.desktop)}
                >
                Desktop
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5 3.00006H6.5C5.37366 2.93715 4.26817 3.32249 3.42502 4.07196C2.58187 4.82143 2.06958 5.87411 2 7.00006V13.0001C2.06958 14.126 2.58187 15.1787 3.42502 15.9282C4.26817 16.6776 5.37366 17.063 6.5 17.0001H17.5C18.6263 17.063 19.7318 16.6776 20.575 15.9282C21.4181 15.1787 21.9304 14.126 22 13.0001V7.00006C21.9304 5.87411 21.4181 4.82143 20.575 4.07196C19.7318 3.32249 18.6263 2.93715 17.5 3.00006V3.00006Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 17V21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.9004 21H7.90039" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <button 
                type="button" 
                className={`flex justify-center gap-2 text-body w-32 ${platform === platformTypes.mobile ? "bg-app-third" : "bg-[#151c33]"} cursor-pointer hover:text-heading font-medium leading-5  rounded-2xl text-sm px-3 py-2 focus:outline-none`}
                onClick={() => setPlatform(platformTypes.mobile)}
                >
                Mobile
                <svg viewBox="0 -0.5 25 25" width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="6.5" y="3" width="12" height="18" rx="3" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect> <path d="M12.5 18.5C12.3665 18.5 12.2409 18.448 12.1465 18.3536C12.052 18.2591 12 18.1336 12 18C12 17.9008 12.0291 17.8047 12.0843 17.7222C12.1394 17.6397 12.217 17.576 12.3086 17.5381C12.3696 17.5128 12.434 17.5 12.5 17.5C12.5327 17.5 12.5655 17.5032 12.5975 17.5096C12.6949 17.529 12.7834 17.5763 12.8536 17.6464C12.9237 17.7166 12.971 17.8051 12.9904 17.9025C13.0098 17.9998 12.9999 18.0997 12.9619 18.1913C12.924 18.283 12.8603 18.3606 12.7778 18.4157C12.6953 18.4709 12.5992 18.5 12.5 18.5Z" fill="#ffffff"></path> <path d="M12.5 19C12.2348 19 11.9804 18.8946 11.7929 18.7071C11.6054 18.5196 11.5 18.2652 11.5 18C11.5 17.8022 11.5586 17.6089 11.6685 17.4444C11.7784 17.28 11.9346 17.1518 12.1173 17.0761C12.3 17.0004 12.5011 16.9806 12.6951 17.0192C12.8891 17.0578 13.0673 17.153 13.2071 17.2929C13.347 17.4327 13.4422 17.6109 13.4808 17.8049C13.5194 17.9989 13.4996 18.2 13.4239 18.3827C13.3482 18.5654 13.22 18.7216 13.0556 18.8315C12.8911 18.9414 12.6978 19 12.5 19Z" fill="#ffffff"></path> </g></svg>
            </button>
        </div>

        <div className="flex flex-col lg:flex-row  gap-6 justify-around text-text-secondary w-full">
            <SingleCard tittle={"LCP"} value={`${(lcp / 1000).toString().slice(0,4)}s`} loading={loading} img={time}/>
            <SingleCard tittle={"FCP"} value={`${(fcp / 1000).toString().slice(0,4)}s`} loading={loading} img={speed}/>
            <SingleCard tittle={"CLS"} value={`${(cls / 1000).toString().slice(0,5)}`} loading={loading} img={switch1}/>
            <SingleCard tittle={"TBT"} value={`${(tbt / 1000).toString().slice(0,4)}s`} loading={loading} img={timer}/>
            <SingleCard tittle={"TTI"} value={`${(tti / 1000).toString().slice(0,4)}s`} loading={loading} img={eye}/>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full justify-around">
            <ScoreDonutCard title='Performance' value={performance} loading={loading}/>
            <ScoreDonutCard title='Accessibility' value={accessibility} loading={loading}/>
            <ScoreDonutCard title='Best Practices' value={bestPractices} loading={loading}/>
            <ScoreDonutCard title='SEO' value={seo} loading={loading}/>
        </div>

    </div>
  )
}
