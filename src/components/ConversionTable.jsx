import React from 'react';

export default function ConversionTable({ data, loading }) {
  return (
    <div className="w-full max-w-full overflow-x-hidden mt-6 bg-app-third rounded-2xl max-h-[510px] overflow-y-auto scrollbar-dark">
      
      {/* Large Screens: Full Table */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="table-auto min-w-max border-collapse text-sm text-left rtl:text-right text-body w-full">
          <thead className="bg-[#0e1e4b] text-body text-sm rounded-base">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Country</th>
              <th className="px-6 py-3 font-medium">Traffic Source</th>
              <th className="px-6 py-3 font-medium">Device</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((conversion, index) => (
                <tr key={index} className="bg-neutral-primary">
                  <th className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {conversion?.dl_description.startsWith(" -") ? conversion?.dl_description.replace("-", "").trim() : conversion?.dl_description}
                  </th>
                  <td className="px-6 py-4">
                    {`${conversion?.date.slice(6, 8)}-${conversion?.date.slice(4, 6)}-${conversion?.date.slice(0, 4)}`}
                  </td>
                  <td className="px-6 py-4">{conversion?.dl_value} CHF</td>
                  <td className="px-6 py-4">{conversion?.country}</td>
                  <td className="px-6 py-4">{conversion?.sessionSource || conversion?.dl_originsource}</td>
                  <td className="px-6 py-4">{conversion?.deviceCategory}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  {loading ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tablet & Mobile Screens: Column Cards */}
      <div className="flex flex-col gap-4 lg:hidden p-4">
        {data && data.length > 0 ? (
          data.map((conversion, index) => (
            <div key={index} className="bg-neutral-primary p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>Title:</strong> {conversion?.dl_description}</div>
              <div>
                <strong>Date:</strong>{' '}
                {`${conversion?.date.slice(6, 8)}-${conversion?.date.slice(4, 6)}-${conversion?.date.slice(0, 4)}`}
              </div>
              <div><strong>Value:</strong> {conversion?.dl_value} CHF</div>
              <div><strong>Country:</strong> {conversion?.country}</div>
              <div><strong>Traffic Source:</strong> {conversion?.sessionSource || conversion?.dl_originsource}</div>
              <div><strong>Device:</strong> {conversion?.deviceCategory}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            {loading ? 'Loading...' : 'No data available'}
          </div>
        )}
      </div>
    </div>
  );
}