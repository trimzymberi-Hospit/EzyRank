import React, { useEffect, useMemo, useRef } from "react";
import ApexCharts from "apexcharts";

// Reads your CSS variable --color-fg-brand (fallback included)
function getBrandColor() {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue("--color-fg-brand").trim() || "#1447E6";
}

function formatK(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

function pctChange(current, previous) {
  const c = Number(current);
  const p = Number(previous);
  if (!Number.isFinite(c) || !Number.isFinite(p) || p === 0) return null;
  return ((c - p) / p) * 100;
}

/**
 * Props:
 * - titleValue: number (e.g. total clicks or impressions for latest period)
 * - titleLabel: string (e.g. "Users this week" / "Clicks this week")
 * - data: [{ date: "2026-W1", clicks: 432, impressions: 33627 }, ...]
 * - metric: "clicks" | "impressions"  (which series to plot)
 */
export default function AreaChartCard({
  titleValue,
  titleLabel = "Users this month",
  data = [],
  metric = "clicks",
  desc
}) {
  const chartElRef = useRef(null);
  const chartRef = useRef(null);

  const prepared = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];

    const categories = safe.map((d) => d.date);
    const seriesData = safe.map((d) => Number(d?.[metric]) || 0);

    const latest = seriesData.length ? seriesData[seriesData.length - 1] : null;
    const prev = seriesData.length > 1 ? seriesData[seriesData.length - 2] : null;

    const change = pctChange(latest, prev);

    // If user passed titleValue, use it; else use latest metric value
    const displayValue = titleValue ?? latest;

    return { categories, seriesData, latest, prev, change, displayValue };
  }, [data, metric, titleValue]);

  useEffect(() => {
    if (!chartElRef.current) return;

    const brandColor = getBrandColor();

    const options = {
      chart: {
        height: 300,
        width: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        toolbar: { 
          show: true, 
          tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: false,
            },
            export: {
              csv: {
                filename: "seo-performance-report"
              }
            }
          
      },
        dropShadow: { enabled: true },
      },
      tooltip: {
        enabled: true,
        x: { show: true },
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: brandColor,
          gradientToColors: [brandColor],
        },
      },
      dataLabels: { 
        enabled: true,
        theme: "dark",
        style: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: brandColor,
          },
    },
      stroke: { width: 6, curve: "smooth" },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: { left: 0, right: 0, top: 0 },
      },
      series: [
        {
          name: metric === "impressions" ? "Impressions" : "Clicks",
          data: prepared.seriesData,
          color: brandColor,
        },
      ],
      xaxis: {
        categories: prepared.categories,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { show: false },
    };

    // Destroy previous chart if exists
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
  }, [prepared.categories, prepared.seriesData, metric]);

  const changeText =
    prepared.change === null
      ? null
      : `${Math.abs(prepared.change).toFixed(0)}%`;

  const isUp = prepared.change !== null ? prepared.change >= 0 : true;

  return (
    <div className=" w-full rounded-2xl bg-neutral-primary-soft min-h-[510px] max-h-[510px] bg-app-third rounded-base shadow-xs p-4 md:p-6">
      <div className="flex justify-between items-start mt-3">
        <div>
            <h1 className="text-2xl text-white text-center font-bold font-logo">
                {titleLabel}
            </h1>
            
        </div>

        {/* Change badge (kept from template). If no previous point, it won’t show */}
        {changeText ? (
          <div
            className={`flex items-center font-medium text-center ${
              isUp ? "text-fg-success text-green-600" : "text-fg-danger text-red-500"
            }`}
            title={
              prepared.prev !== null
                ? `Prev: ${prepared.prev} → Now: ${prepared.latest}`
                : ""
            }
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isUp ? "M12 6v13m0-13 4 4m-4-4-4 4" : "M12 19V6m0 13 4-4m-4 4-4-4"}
              />
            </svg>
            {changeText}
          </div>
        ) : null}
      </div>

      {/* Chart mounts here */}
      <div ref={chartElRef} id="area-chart" className="mt-8" />

      {/* Footer section kept structurally, but EMPTY because you asked to remove button+dropdown+report link */}
      <div className="grid grid-cols-1 items-center justify-between">
        <div className="pt-4 md:pt-6" />
      </div>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
