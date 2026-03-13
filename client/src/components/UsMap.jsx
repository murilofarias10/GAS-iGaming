import React, { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const US_MAP_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const US_STATES = [
  { name: "Alabama",        coordinates: [-86.9023,  32.3182], abbr: "AL" },
  { name: "Alaska",         coordinates: [-153.369,  66.1605], abbr: "AK" },
  { name: "Arizona",        coordinates: [-111.431,  33.7298], abbr: "AZ" },
  { name: "Arkansas",       coordinates: [-92.3731,  34.9697], abbr: "AR" },
  { name: "California",     coordinates: [-119.4179, 36.7783], abbr: "CA" },
  { name: "Colorado",       coordinates: [-105.7821, 39.5501], abbr: "CO" },
  { name: "Connecticut",    coordinates: [-72.7622,  41.6032], abbr: "CT" },
  { name: "Delaware",       coordinates: [-75.5071,  38.9108], abbr: "DE" },
  { name: "Florida",        coordinates: [-81.5158,  27.6648], abbr: "FL" },
  { name: "Georgia",        coordinates: [-83.6431,  32.1656], abbr: "GA" },
  { name: "Hawaii",         coordinates: [-155.5828, 19.8968], abbr: "HI" },
  { name: "Idaho",          coordinates: [-114.742,  44.0682], abbr: "ID" },
  { name: "Illinois",       coordinates: [-89.3985,  40.6331], abbr: "IL" },
  { name: "Indiana",        coordinates: [-86.1349,  40.2672], abbr: "IN" },
  { name: "Iowa",           coordinates: [-93.0977,  41.878],  abbr: "IA" },
  { name: "Kansas",         coordinates: [-98.4842,  39.0119], abbr: "KS" },
  { name: "Kentucky",       coordinates: [-84.27,    37.8393], abbr: "KY" },
  { name: "Louisiana",      coordinates: [-91.9623,  31.1695], abbr: "LA" },
  { name: "Maine",          coordinates: [-69.4455,  44.6939], abbr: "ME" },
  { name: "Maryland",       coordinates: [-76.6413,  39.0458], abbr: "MD" },
  { name: "Massachusetts",  coordinates: [-71.3824,  42.4072], abbr: "MA" },
  { name: "Michigan",       coordinates: [-84.506,   44.3467], abbr: "MI" },
  { name: "Minnesota",      coordinates: [-94.6859,  46.7296], abbr: "MN" },
  { name: "Mississippi",    coordinates: [-89.3985,  32.7416], abbr: "MS" },
  { name: "Missouri",       coordinates: [-91.8318,  37.9643], abbr: "MO" },
  { name: "Montana",        coordinates: [-110.3626, 46.8797], abbr: "MT" },
  { name: "Nebraska",       coordinates: [-99.9018,  41.4925], abbr: "NE" },
  { name: "Nevada",         coordinates: [-116.4194, 38.8026], abbr: "NV" },
  { name: "New Hampshire",  coordinates: [-71.5724,  43.1939], abbr: "NH" },
  { name: "New Jersey",     coordinates: [-74.4057,  40.0583], abbr: "NJ" },
  { name: "New Mexico",     coordinates: [-106.2485, 34.5199], abbr: "NM" },
  { name: "New York",       coordinates: [-74.9981,  42.1657], abbr: "NY" },
  { name: "North Carolina", coordinates: [-79.0193,  35.7596], abbr: "NC" },
  { name: "North Dakota",   coordinates: [-101.002,  47.5515], abbr: "ND" },
  { name: "Ohio",           coordinates: [-82.9071,  40.4173], abbr: "OH" },
  { name: "Oklahoma",       coordinates: [-96.9289,  35.4676], abbr: "OK" },
  { name: "Oregon",         coordinates: [-120.5542, 43.8041], abbr: "OR" },
  { name: "Pennsylvania",   coordinates: [-77.1945,  41.2033], abbr: "PA" },
  { name: "Rhode Island",   coordinates: [-71.4774,  41.5801], abbr: "RI" },
  { name: "South Carolina", coordinates: [-81.1637,  33.8361], abbr: "SC" },
  { name: "South Dakota",   coordinates: [-99.9018,  43.9695], abbr: "SD" },
  { name: "Tennessee",      coordinates: [-86.58,    35.5175], abbr: "TN" },
  { name: "Texas",          coordinates: [-99.9018,  31.9686], abbr: "TX" },
  { name: "Utah",           coordinates: [-111.0937, 39.321],  abbr: "UT" },
  { name: "Vermont",        coordinates: [-72.5778,  44.5588], abbr: "VT" },
  { name: "Virginia",       coordinates: [-78.6569,  37.4316], abbr: "VA" },
  { name: "Washington",     coordinates: [-120.7401, 47.7511], abbr: "WA" },
  { name: "West Virginia",  coordinates: [-80.4549,  38.4912], abbr: "WV" },
  { name: "Wisconsin",      coordinates: [-88.7879,  43.7844], abbr: "WI" },
  { name: "Wyoming",        coordinates: [-107.2903, 43.076],  abbr: "WY" },
];

function buildStateIntensity(posts) {
  const locatedPosts = posts.filter((p) => p.state);
  if (locatedPosts.length === 0) return {};

  const validAbbrs = new Set(US_STATES.map((s) => s.abbr));
  const result = {};
  for (const post of locatedPosts) {
    const abbr = post.state?.toUpperCase();
    if (validAbbrs.has(abbr)) result[abbr] = (result[abbr] || 0) + 1;
  }
  return result;
}

const UsMap = memo(function UsMap({ posts }) {
  const [tooltip, setTooltip] = useState(null);
  const intensity    = buildStateIntensity(posts);
  const counts       = Object.values(intensity);
  const maxIntensity = counts.length > 0 ? Math.max(...counts) : 1;

  // Only render markers for states that actually have data
  const activeStates = US_STATES.filter((s) => (intensity[s.abbr] || 0) > 0);

  const getMarkerRadius = (abbr) => {
    const count = intensity[abbr] || 0;
    return 4 + (count / maxIntensity) * 10;
  };

  const getMarkerColor = (abbr) => {
    const count = intensity[abbr] || 0;
    if (count >= maxIntensity * 0.7) return "#FF600F";
    if (count >= maxIntensity * 0.3) return "#f59e0b";
    return "#0041ED";
  };

  const totalLocated = posts.filter((p) => p.state).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            U.S. iGaming Activity Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalLocated > 0
              ? `${totalLocated} location-tagged post${totalLocated !== 1 ? "s" : ""} across ${activeStates.length} state${activeStates.length !== 1 ? "s" : ""}`
              : "Run AI analysis to see geolocation complaint hotspots"}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gc-orange inline-block" />
            High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gc-blue inline-block" />
            Low
          </span>
        </div>
      </div>

      {/* CSS vars --map-state-fill / --map-state-stroke / --map-bg defined in index.css */}
      <div className="rounded-lg overflow-hidden" style={{ background: "var(--map-bg)" }}>
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={US_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--map-state-fill)"
                  stroke="var(--map-state-stroke)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover:   { fill: "var(--map-state-stroke)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Inactive state labels — subtle, no dot */}
          {US_STATES.filter((s) => !intensity[s.abbr]).map((state) => (
            <Marker key={`label-${state.abbr}`} coordinates={state.coordinates}>
              <text
                textAnchor="middle"
                y={2}
                style={{
                  fontSize: "6.5px",
                  fontWeight: "600",
                  fill: "var(--map-label-fill)",
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.05em",
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "var(--map-label-halo)",
                  strokeWidth: "2.5px",
                  strokeLinejoin: "round",
                }}
              >
                {state.abbr}
              </text>
            </Marker>
          ))}

          {/* Active state markers — dot + colored label */}
          {activeStates.map((state) => {
            const count = intensity[state.abbr];
            const r = getMarkerRadius(state.abbr);
            const color = getMarkerColor(state.abbr);
            return (
              <Marker
                key={`active-${state.abbr}`}
                coordinates={state.coordinates}
                onMouseEnter={() => setTooltip({ name: state.name, abbr: state.abbr, count })}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Outer pulse ring */}
                <circle
                  r={r + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.8}
                  strokeOpacity={0.25}
                />
                {/* Main dot */}
                <circle
                  r={r}
                  fill={color}
                  fillOpacity={0.88}
                  stroke="white"
                  strokeWidth={1.2}
                  strokeOpacity={0.7}
                  className="cursor-pointer"
                />
                {/* State abbreviation label */}
                <text
                  textAnchor="middle"
                  y={r + 11}
                  style={{
                    fontSize: "7px",
                    fontWeight: "700",
                    fill: color,
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.04em",
                    pointerEvents: "none",
                    paintOrder: "stroke",
                    stroke: "var(--map-label-halo)",
                    strokeWidth: "2.5px",
                    strokeLinejoin: "round",
                  }}
                >
                  {state.abbr}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {tooltip && (
        <div className="absolute top-5 right-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs pointer-events-none shadow-md">
          <div className="font-medium text-slate-800 dark:text-slate-200">
            {tooltip.name} ({tooltip.abbr})
          </div>
          <div className="text-slate-500 dark:text-slate-400 mt-0.5">
            {tooltip.count} post{tooltip.count !== 1 ? "s" : ""} detected
          </div>
        </div>
      )}
    </div>
  );
});

export default UsMap;
