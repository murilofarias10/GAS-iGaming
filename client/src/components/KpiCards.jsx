import React from "react";

const simpleCards = [
  {
    key: "subreddits_monitored",
    label: "Subreddits Monitored",
    icon: "🔭",
    color: "cyan",
    description: "Active subreddit channels",
  },
  {
    key: "total_posts",
    label: "Total Posts Scanned",
    icon: "📡",
    color: "blue",
    description: "All Reddit posts fetched",
  },
  {
    key: "analyzed_posts",
    label: "Analyzed Posts",
    icon: "🤖",
    color: "green",
    description: "Posts classified by AI",
  },
  {
    key: "unanalyzed_posts",
    label: "Pending Analysis",
    icon: "⏳",
    color: "amber",
    description: "Posts awaiting AI review",
  },
];

const colorMap = {
  blue:  "border-blue-500/30 bg-blue-500/10 text-blue-400",
  cyan:  "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

const valueColorMap = {
  blue:  "text-blue-300",
  cyan:  "text-cyan-300",
  green: "text-emerald-300",
  amber: "text-amber-300",
};

export default function KpiCards({ stats }) {
  const high   = stats?.high_alerts   ?? 0;
  const medium = stats?.medium_alerts ?? 0;
  const low    = stats?.low_alerts    ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Subreddits Monitored — position 1 */}
      {[simpleCards[0]].map((card) => (
        <div
          key={card.key}
          className={`rounded-xl border p-4 ${colorMap[card.color]} flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className={`text-3xl font-bold ${valueColorMap[card.color]}`}>
            {stats ? (stats[card.key] ?? 0).toLocaleString() : "—"}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">{card.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{card.description}</div>
          </div>
        </div>
      ))}

      {/* Alerts — combined H / M / L card — position 2 */}
      <div className="rounded-xl border p-4 border-red-500/30 bg-red-500/10 text-red-400 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xl">🚨</span>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-300 leading-none">{high}</span>
            <span className="text-xs text-red-500 mt-0.5">HIGH</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-300 leading-none">{medium}</span>
            <span className="text-xs text-orange-500 mt-0.5">MED</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald-300 leading-none">{low}</span>
            <span className="text-xs text-emerald-600 mt-0.5">LOW</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">Alerts</div>
          <div className="text-xs text-slate-500 mt-0.5">By severity level</div>
        </div>
      </div>

      {/* Total Posts, Analyzed, Pending — positions 3-5 */}
      {simpleCards.slice(1).map((card) => (
        <div
          key={card.key}
          className={`rounded-xl border p-4 ${colorMap[card.color]} flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className={`text-3xl font-bold ${valueColorMap[card.color]}`}>
            {stats ? (stats[card.key] ?? 0).toLocaleString() : "—"}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">{card.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{card.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
