import React from 'react'
import chatGpt from '../../assets/chat-gpt.png'
import perplexity from '../../assets/perplexity.png'
import gemini from '../../assets/gemini.webp'
import copilot from '../../assets/copilot.webp'
import grok from '../../assets/grok.webp'

export default function AiReferncedVisitorsCard({data, loading}) {
  return (
    <div className='flex md:min-w-1/2 min-w-full gap-6 rounded-2xl w-full p-6 flex-col bg-app-third text-text-secondary'>
        <h1 className="mb-6 text-xl text-white">AI Referenced Visitors</h1>
            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={chatGpt} className="w-8 h-8" alt="chatgpt logo" />
                    <h4 className="text-lg text-white">Chat gpt</h4>
                </div>
                <h4 className="text-lg text-white">{data?.chatgpt || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={perplexity} className="w-8 h-8" alt="perplexity logo" />
                    <h4 className="text-lg text-white">Perplexity</h4>
                </div>
                <h4 className="text-lg text-white">{data?.perplexity || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={gemini} className="w-8 h-8" alt="gemini logo" />
                    <h4 className="text-lg text-white">Gemini</h4>
                </div>
                <h4 className="text-lg text-white">{data?.gemini || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={copilot} className="w-8 h-8" alt="chatgpt logo" />
                    <h4 className="text-lg text-white">Copilot</h4>
                </div>
                <h4 className="text-lg text-white">{data?.copilot || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={grok} className="w-8 h-8" alt="chatgpt logo" />
                    <h4 className="text-lg text-white">Grok</h4>
                </div>
                <h4 className="text-lg text-white">{data?.grok || 0}</h4>
            </div>
    </div>
  )
}
