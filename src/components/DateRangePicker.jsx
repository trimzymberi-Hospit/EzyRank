import { useDateRange } from "../context/DateRangeContext.jsx";

export default function DateRangePicker() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  return (
    <div className="flex flex-col md:flex-row mb-2 items-center gap-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-app-foreground outline-none"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-app-foreground outline-none"
      />
    </div>
  );
}
