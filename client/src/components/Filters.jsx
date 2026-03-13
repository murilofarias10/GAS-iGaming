import React from "react";

export default function Filters({
  filters,
  setFilters,
  subreddits,
  classifications,
  alertLevels,
  resultCount,
  totalCount,
}) {
  const update = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearAll = () =>
    setFilters((prev) => ({ ...prev, subreddit: "", classification: "", alert_level: "" }));

  const hasActiveFilters = [filters.subreddit, filters.classification, filters.alert_level].some((v) => v !== "");

  const alertColors = {
    "":     "border-gray-300 dark:border-slate-600 text-slate-500 dark:text-slate-400",
    HIGH:   "border-gc-orange/50 text-gc-orange",
    MEDIUM: "border-amber-500/50 text-amber-600 dark:text-amber-400",
    LOW:    "border-emerald-500/50 text-emerald-600 dark:text-emerald-400",
  };
  const alertActive = {
    "":     "bg-gray-200 dark:bg-slate-700",
    HIGH:   "bg-gc-orange/20",
    MEDIUM: "bg-amber-500/20",
    LOW:    "bg-emerald-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">

      {/* Label */}
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
        Filters
      </span>

      <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 shrink-0" />

      {/* Subreddit */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Subreddit</label>
        <select
          value={filters.subreddit}
          onChange={(e) => update("subreddit", e.target.value)}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700
            rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200
            focus:outline-none focus:border-gc-blue cursor-pointer"
        >
          <option value="">All subreddits</option>
          {subreddits.map((s) => (
            <option key={s} value={s}>r/{s}</option>
          ))}
        </select>
      </div>

      {/* Classification */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Classification</label>
        <select
          value={filters.classification}
          onChange={(e) => update("classification", e.target.value)}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700
            rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200
            focus:outline-none focus:border-gc-blue cursor-pointer"
        >
          <option value="">All categories</option>
          {classifications.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Alert Level */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Alert</label>
        <div className="flex gap-1">
          {["", ...alertLevels].map((level) => {
            const isActive = filters.alert_level === level;
            return (
              <button
                key={level}
                onClick={() => update("alert_level", level)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors
                  ${alertColors[level]}
                  ${isActive ? alertActive[level] : "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800"}
                `}
              >
                {level || "All"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count + clear — pushed to the right */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Showing{" "}
          <span className="text-slate-700 dark:text-slate-300 font-medium">{resultCount}</span>
          {" "}of{" "}
          <span className="text-slate-700 dark:text-slate-300 font-medium">{totalCount}</span>
          {" "}posts
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
