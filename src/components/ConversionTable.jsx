import React from 'react'

export default function ConversionTable({data, loading}) {
  return (
    <div class="w-full mt-6 overflow-x-auto bg-app-third rounded-2xl ">
        <table class="w-full text-sm text-left rtl:text-right text-body">
           
            <thead class="text-sm text-body bg-[#0e1e4b]  rounded-base">
                <tr>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Tittle
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Date
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Value
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Country
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Traffic Source
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                        Device
                    </th>
                </tr>
            </thead>
            <tbody>
                    {data && data.length > 0 && data.map( (conversion) => (   
                    <tr className='bg-neutral-primary '>
                        <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                            {conversion?.dl_description}
                        </th>
                        <td class="px-6 py-4">
                            { `${conversion?.date.slice(6, 8)}-${conversion?.date.slice(4, 6)}-${conversion?.date.slice(0, 4)}`}
                        </td>
                        <td class="px-6 py-4">
                            {conversion?.dl_value} {conversion?.dl_currency}
                        </td>
                        <td class="px-6 py-4">
                            {conversion?.country}
                        </td>   
                        <td class="px-6 py-4">
                            {conversion?.sessionSource}
                        </td>
                        <td class="px-6 py-4">
                            {conversion?.deviceCategory}
                        </td>                               
                    </tr>    
                    ))}
               
            </tbody>
        </table>
    </div>
  )
}
