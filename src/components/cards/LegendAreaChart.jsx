import React, { useEffect, useMemo, useRef } from "react";
import ApexCharts from "apexcharts";

// Reads CSS variables used by your design system (fallbacks included)
function getCssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function sum(arr) {
  return (arr || []).reduce((a, b) => a + (Number(b) || 0), 0);
}

function pctChange(current, previous) {
  const c = Number(current);
  const p = Number(previous);
  if (!Number.isFinite(c) || !Number.isFinite(p) || p === 0) return null;
  return ((c - p) / p) * 100;
}

/**
 * LegendAreaChart
 * - Layout matches your HTML card
 * - Uses ApexCharts area chart with legend
 * - Expects data like:
 *   weeks: [{ week: "2025-08-18 - 2025-08-24", new: 12, lost: 4 }, ...]
 *
 * Props:
 * - titleValue: string/number (optional) (e.g. "12,423")
 * - titleLabel: string (e.g. "Backlinks this period")
 * - weeks: array (required)
 */
export default function LegendAreaChart({
  titleValue,
  titleLabel = "New vs Lost (weekly)",
  weeks = [],
}) {
  const chartElRef = useRef(null);
  const chartRef = useRef(null);

  const brand = getCssVar("--color-fg-brand", "#1447E6");
  const brandSubtle = getCssVar("--color-fg-brand-subtle", "#6D8BFF");

  const prepared = useMemo(() => {
    const safe = Array.isArray(weeks) ? weeks : [];

    const categories = safe.map((w) => w.week);
    const newData = safe.map((w) => Number(w?.new) || 0);
    const lostData = safe.map((w) => Number(w?.lost) || 0);

    const totalNew = sum(newData);
    const totalLost = sum(lostData);

    // Badge: compare last week total (new+lost) vs previous week total
    const lastTotal =
      safe.length >= 1 ? (Number(safe[safe.length - 1]?.new) || 0) + (Number(safe[safe.length - 1]?.lost) || 0) : null;
    const prevTotal =
      safe.length >= 2 ? (Number(safe[safe.length - 2]?.new) || 0) + (Number(safe[safe.length - 2]?.lost) || 0) : null;

    const change = pctChange(lastTotal, prevTotal);

    // If caller doesn't pass titleValue, show total new as main number (you can change to totalNew-totalLost etc.)
    const displayValue = undefined

    return {
      categories,
      newData,
      lostData,
      totalNew,
      totalLost,
      displayValue,
      change,
      lastTotal,
      prevTotal,
    };
  }, [weeks, titleValue]);

  useEffect(() => {
    if (!chartElRef.current) return;

    const options = {
      series: [
        {
          name: "New",
          data: prepared.newData,
          color: brand,
        },
        {
          name: "Lost",
          data: prepared.lostData,
          color: brandSubtle,
        },
      ],
      chart: {
        height: 400,
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: { enabled: true },
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
                  filename: "backlins-report"
                }
              }
            
    },
        animations: { enabled: true },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontSize: "12px",
        labels: { colors: "#9CA3AF" },
        markers: { radius: 3 },
        itemMargin: { horizontal: 10, vertical: 6 },
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
          opacityFrom: 0.45,
          opacityTo: 0,
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 6, curve: "smooth" },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: { left: 2, right: 2, top: -26 },
      },
      xaxis: {
        categories: prepared.categories,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        show: false,
      },
    };

    // destroy previous instance
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
  }, [prepared.categories, prepared.newData, prepared.lostData, brand, brandSubtle]);

  const changeText =
    prepared.change === null ? null : `${Math.abs(prepared.change).toFixed(0)}%`;
  const isUp = prepared.change !== null ? prepared.change >= 0 : true;

  return (
    <div className="w-full md:w-1/2 rounded-2xl bg-app-third min-h-[510px] max-h-[510px] rounded-base shadow-xs p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="text-2xl font-bold text-heading">{titleLabel}</h5>
        </div>

        {changeText ? (
          <div
            className={`flex items-center px-2.5 py-0.5 font-medium text-center ${
              isUp ? "text-fg-success text-green-600" : "text-fg-danger text-red-500"
            }`}
            title={
              prepared.prevTotal !== null
                ? `Prev: ${prepared.prevTotal} → Now: ${prepared.lastTotal}`
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
                d={
                  isUp
                    ? "M12 6v13m0-13 4 4m-4-4-4 4"
                    : "M12 19V6m0 13 4-4m-4 4-4-4"
                }
              />
            </svg>
            {changeText}
          </div>
        ) : null}
      </div>

      {/* Chart mount */}
      <div ref={chartElRef} id="legend-chart" className="py-4 md:py-6" />

      {/* Footer kept like HTML, but without dropdown + report link (as requested) */}
      <div className="grid grid-cols-1 items-center justify-between">
        <div className="pt-4 md:pt-6" />
      </div>
    </div>
  );
}
