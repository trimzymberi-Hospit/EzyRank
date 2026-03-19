import React, { useEffect, useMemo, useRef, useState } from "react";
import ApexCharts from "apexcharts";

function getColorForValue(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "#6B7280"; // gray fallback
  if (v < 30) return "#EF4444"; // red
  if (v <= 70) return "#F59E0B"; // yellow
  return "#22C55E"; // green
}

export default function ScoreDonutCard({ title, value, loading, description}) {
  const chartElRef = useRef(null);
  const chartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false)


  const color = useMemo(() => getColorForValue(value), [value]);

  const safeValue = useMemo(() => {
    const v = Number(value);
    if (!Number.isFinite(v)) return 'Not Available';
    return Math.max(0, Math.min(100, v));
  }, [value]);

  useEffect(() => {
    // If loading, ensure the chart is destroyed (spinner will be shown)
    if (loading) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    if (!chartElRef.current) return;

    const options = {
      series: [safeValue],
      colors: [color],
      chart: {
        height: 240,
        width: "100%",
        type: "radialBar",
        sparkline: { enabled: true },
        animations: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 270,
          hollow: {
            size: "72%",
            background: "transparent",
          },
          track: {
            background: "rgba(255,255,255,0.08)",
            strokeWidth: "100%",
          },
          dataLabels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "34px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              color: "#FFFFFF",
              offsetY: 10,
              formatter: (val) => `${Math.round(val)}`,
            },
          },
        },
      },
      stroke: {
        lineCap: "round",
      },
      tooltip: { enabled: false },
    };

    // destroy previous
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new ApexCharts(chartElRef.current, options);
    chartRef.current.render();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [loading, safeValue, color]);

  return (
    <div className="max-w-sm w-full h-[360px] bg-app-third rounded-2xl shadow-xs p-4 md:p-6">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-xl font-semibold text-heading">{title}</h5>

        {/* small status dot */}
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: loading ? "#91038c" : color }}
          aria-hidden="true"
        />
        
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center">
          {/* Spinner ring - color fixed to #91038c */}
          <svg
              aria-hidden="true"
              className="w-24 h-24 text-neutral-tertiary mt-2 animate-spin fill-brand"
              viewBox="0 0 100 101"
              fill="#a30097"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#a30097"
              />
            </svg>
        </div>
        
      ) : (
        <div ref={chartElRef} className="py-2" />
      )}
      <div className="relative flex justify-end items-center mb-4">
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
  );
}