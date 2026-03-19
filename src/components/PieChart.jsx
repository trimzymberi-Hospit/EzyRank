import React, { useMemo, useState } from "react";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

const DEFAULT_COLORS = [
  "#3B82F6", "#22C55E", "#F59E0B", "#A855F7", "#EF4444",
  "#06B6D4", "#84CC16", "#F97316", "#14B8A6", "#E11D48",
];

export default function PieChart({
  title = "Website traffic",
  data = [],
  size = 260,
  colors = DEFAULT_COLORS,
  showLabels = true,
  description
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { cleaned, total } = useMemo(() => {
    const cleaned = (Array.isArray(data) ? data : [])
      .filter(
        (d) =>
          d &&
          typeof d?.name === "string" &&
          Number.isFinite(+d?.sharePct)
      )
      .map((d) => ({
        name: d?.name,
        sharePct: clamp(+d.sharePct, 0, 100),
      }));

    const total = cleaned.reduce((sum, d) => sum + d?.sharePct, 0);
    return { cleaned, total };
  }, [data]);

  const r = Math.floor(size / 2) - 10;
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);

  let currentAngle = 0;

  return (
    <div className="flex flex-col w-full md:w-1/2 min-h-[510px] max-h-[510px] bg-app-third rounded-2xl shadow-xs p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div className="flex-col items-center">
          <div className="flex items-center mb-1">
            <h5 className="text-xl font-semibold text-heading me-1">
              {title}
            </h5>
          </div>
        </div>
        <div className="relative flex justify-end items-end">
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

      {/* Pie chart */}
      <div className="py-6 flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {total <= 0 ? (
              <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.06)" />
            ) : (
              cleaned.map((d, idx) => {
                const color = colors[idx % colors.length];

                // Optional: don't render 0% slices in the chart
                if (d.sharePct <= 0) return null;

                const sliceAngle = (d.sharePct / total) * 360;

                // ✅ Full-circle edge case (100% slice)
                if (sliceAngle >= 359.999) {
                  return (
                    <g key={`${d.name}-${idx}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={color}
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth="2"
                      />
                      {showLabels ? (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="12"
                          fill="#fff"
                          style={{ fontWeight: 600 }}
                        >
                          {Math.round(d.sharePct)}%
                        </text>
                      ) : null}
                    </g>
                  );
                }

                const start = currentAngle;
                const end = currentAngle + sliceAngle;
                currentAngle = end;

                const path = describeArc(cx, cy, r, start, end);

                const mid = start + sliceAngle / 2;
                const labelPoint = polarToCartesian(cx, cy, r * 0.62, mid);

                return (
                  <g key={`${d.name}-${idx}`}>
                    <path
                      d={path}
                      fill={color}
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="2"
                    />
                    {showLabels ? (
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fill="#fff"
                        style={{ fontWeight: 600 }}
                      >
                        {Math.round(d.sharePct)}%
                      </text>
                    ) : null}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-5 w-full space-y-2">
          {cleaned.length === 0 ? (
            <div className="text-sm text-body">No data</div>
          ) : (
            cleaned.map((d, idx) => (
              <div
                key={`${d?.name}-legend-${idx}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-sm font-medium text-body">
                    {d?.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-heading tabular-nums">
                  {d?.sharePct}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
