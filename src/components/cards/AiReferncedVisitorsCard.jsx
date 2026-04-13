import React, { useState } from 'react'
import chatGpt from '../../assets/chat-gpt.png'
import perplexity from '../../assets/perplexity.png'
import gemini from '../../assets/gemini.webp'
import copilot from '../../assets/copilot.webp'
import grok from '../../assets/grok.webp'
import claude from '../../assets/claude.png'

export default function AiReferncedVisitorsCard({data, loading, description}) {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex md:w-1/2  gap-6 rounded-2xl w-full p-6 flex-col bg-app-third text-text-secondary'>
        <div className='w-full flex justify-between items-center'>
            <h1 className="mb-6 text-xl text-white">AI Referenced Visitors</h1>
            <div className="relative flex justify-end items-center">
              <svg
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                viewBox="0 0 24 24"
                height={20}
                width={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <g strokeWidth="0"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18.01L12.01 17.9989"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
      
              {isOpen && (
                <p className="absolute text-gray-300 bottom-7 right-0 w-60 bg-blue-900 text-xs p-3 rounded-xl shadow-lg z-20">
                  {description}
                </p>
              )}
            </div>
        </div>
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
                    <img src={copilot} className="w-8 h-8" alt="copilot logo" />
                    <h4 className="text-lg text-white">Copilot</h4>
                </div>
                <h4 className="text-lg text-white">{data?.copilot || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={grok} className="w-8 h-8" alt="grok logo" />
                    <h4 className="text-lg text-white">Grok</h4>
                </div>
                <h4 className="text-lg text-white">{data?.grok || 0}</h4>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-3'>
                    <img src={claude} className="w-8 h-8" alt="claude logo" />
                    <h4 className="text-lg text-white">Claude</h4>
                </div>
                <h4 className="text-lg text-white">{data?.claude || 0}</h4>
            </div>
    </div>
  )
}
