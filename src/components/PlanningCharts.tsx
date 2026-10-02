"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fitComposition } from "../data/fitComposition";
type ChartRow = { size: string; [key: string]: string | number };
type Series = { key: string; label: string; color: string };
export function PlanningChart({
  data,
  series,
  unit = "units",
  label,
}: {
  data: ChartRow[];
  series: Series[];
  unit?: "units" | "%";
  label: string;
}) {
  return (
    <div className="planning-chart">
      <div className="chart-frame" role="img" aria-label={label}>
        <span className="axis-label">
          {unit === "%" ? "Share of demand (%)" : "Planned units"}
        </span>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 12, right: 12, bottom: 8, left: 0 }}
            barGap={3}
            accessibilityLayer
          >
            <CartesianGrid
              vertical={false}
              stroke="#e5eaf2"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="size"
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#526079",
                fontSize: "var(--chart-tick-size, 11px)",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={42}
              tick={{ fill: "#526079", fontSize: 11 }}
              tickFormatter={(v) => (unit === "%" ? `${v}%` : `${v}`)}
            />
            <Tooltip
              cursor={{ fill: "#f2f5fb" }}
              formatter={(v) => [`${v}${unit === "%" ? "%" : " units"}`]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) => (
                <span style={{ color: "#526079" }}>{value}</span>
              )}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                radius={[3, 3, 0, 0]}
                maxBarSize={36}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <span className="axis-footer">Alpha size</span>
      </div>
      <details className="chart-data">
        <summary>View chart data</summary>
        <div className="table-scroll">
          <table>
            <caption>{label}</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                {series.map((s) => (
                  <th scope="col" key={s.key}>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.size}>
                  <th scope="row">{row.size}</th>
                  {series.map((s) => (
                    <td key={s.key}>
                      {row[s.key]}
                      {unit === "%" ? "%" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
const cohortColors = ["#c5cfe0", "#2563eb", "#715dcc", "#61718d"];
export function CompositionChart() {
  return (
    <div className="composition-chart">
      {(["initialSharePct", "currentSharePct"] as const).map((key, i) => (
        <div className="composition-row" key={key}>
          <h3>
            {i === 0
              ? "INITIAL EXPECTED M COMPOSITION"
              : "EARLY LAUNCH M COMPOSITION"}
          </h3>
          <div
            className="stacked-bar"
            role="img"
            aria-label={fitComposition
              .map((c) => `${c.cohortLabel}: ${c[key]}%`)
              .join(", ")}
          >
            {fitComposition.map((c, j) => (
              <div
                key={c.cohortLabel}
                style={{
                  width: `${c[key]}%`,
                  background: cohortColors[j],
                  color: j === 0 ? "#17243a" : "white",
                }}
              >
                {c[key]}%
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="chart-legend">
        {fitComposition.map((c, i) => (
          <span key={c.cohortLabel}>
            <i style={{ background: cohortColors[i] }} />
            {c.cohortLabel}
          </span>
        ))}
      </div>
      <details className="chart-data">
        <summary>View composition data</summary>
        <div className="table-scroll">
          <table>
            <caption>Illustrative M composition (%)</caption>
            <thead>
              <tr>
                <th scope="col">Cohort</th>
                <th scope="col">Initial planning</th>
                <th scope="col">Early illustrative</th>
              </tr>
            </thead>
            <tbody>
              {fitComposition.map((c) => (
                <tr key={c.cohortLabel}>
                  <th scope="row">{c.cohortLabel}</th>
                  <td>{c.initialSharePct}%</td>
                  <td>{c.currentSharePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
