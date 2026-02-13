import React, { createContext, useContext, useMemo, useState } from "react";

const DateRangeContext = createContext(null);

const KEY = "global_date_range";

// helper: format Date -> YYYY-MM-DD
function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// default: last 30 days
function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return { startDate: toYMD(start), endDate: toYMD(end) };
}

export function DateRangeProvider({ children }) {
  const [range, setRange] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultRange();
  });

  function setStartDate(startDate) {
    setRange((prev) => {
      const next = { ...prev, startDate };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function setEndDate(endDate) {
    setRange((prev) => {
      const next = { ...prev, endDate };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function setDateRange(nextRange) {
    setRange(nextRange);
    localStorage.setItem(KEY, JSON.stringify(nextRange));
  }

  const value = useMemo(
    () => ({ ...range, setStartDate, setEndDate, setDateRange }),
    [range]
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}
