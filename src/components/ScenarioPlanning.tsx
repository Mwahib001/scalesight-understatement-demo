"use client";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { usePlanning } from "../context/PlanningContext";
import { scenarioPresets } from "../data/scenarioPresets";
import { baseDepth } from "../data/sizeCurves";
import type { ScenarioState } from "../types";
import {
  calculateLeadTimeDemand,
  calculateSafetyStock,
} from "../lib/calculations";
import { variants } from "../data/variants";
import {
  PageHeading,
  Panel,
  Metric,
  ConfidenceBadge,
  DecisionBadge,
} from "./ui";
import { PlanningChart } from "./PlanningCharts";
import { chartColors } from "../config/workspace";
const controls: readonly {
  key: Exclude<
    keyof ScenarioState,
    "mode" | "launchExtensionEnabled" | "fitAdjustedDemandEnabled"
  >;
  label: string;
  min: number;
  max: number;
  unit: string;
  step: number;
}[] = [
  {
    key: "overallDemandUpliftPct",
    label: "Overall Demand Uplift",
    min: -20,
    max: 40,
    unit: "%",
    step: 1,
  },
  {
    key: "mDemandAdjustmentPct",
    label: "M Demand Adjustment",
    min: -20,
    max: 30,
    unit: "%",
    step: 1,
  },
  {
    key: "lDemandAdjustmentPct",
    label: "L Demand Adjustment",
    min: -20,
    max: 30,
    unit: "%",
    step: 1,
  },
  {
    key: "returnRateAdjustmentPP",
    label: "Return Rate Adjustment",
    min: -5,
    max: 10,
    unit: "pp",
    step: 1,
  },
  {
    key: "exchangeRateAdjustmentPP",
    label: "Size Exchange Adjustment",
    min: -5,
    max: 10,
    unit: "pp",
    step: 1,
  },
  {
    key: "leadTimeAdjustmentWeeks",
    label: "Lead Time Adjustment",
    min: -2,
    max: 4,
    unit: "weeks",
    step: 1,
  },
  {
    key: "plannedBuyUnits",
    label: "Buy Units",
    min: 500,
    max: 2000,
    unit: "units",
    step: 10,
  },
  {
    key: "plusMigrationPct",
    label: "+ Migration Assumption",
    min: 0,
    max: 30,
    unit: "%",
    step: 1,
  },
  {
    key: "setAttachRatePct",
    label: "Set Attach Rate",
    min: 40,
    max: 80,
    unit: "%",
    step: 1,
  },
];
export function ScenarioPlanning() {
  const { state, output, update, selectPreset, reset, horizon, setHorizon } =
    usePlanning();
  const unsupported = output.unsupportedKeys.length > 0;
  const total = output.curve.reduce((s, r) => s + r.units, 0);
  const mVariant = variants.find(
    (v) => v.productId === "CH-BRA" && v.size === "M",
  )!;
  const required =
    calculateLeadTimeDemand(
      mVariant.forecastWeeklyUnits,
      mVariant.leadTimeWeeks + state.leadTimeAdjustmentWeeks,
    ) +
    calculateSafetyStock(
      mVariant.forecastWeeklyUnits,
      mVariant.safetyStockWeeks,
    );
  return (
    <>
      <PageHeading
        eyebrow="SCENARIO PLANNING"
        title="Test the size decision before committing the buy."
        description="Change the assumptions and see which parts of the size curve remain robust."
      />
      <div className="preset-bar">
        {Object.values(scenarioPresets).map((p) => (
          <button
            key={p.mode}
            aria-pressed={state.mode === p.mode && !unsupported}
            onClick={() => selectPreset(p.mode)}
          >
            {p.label}
          </button>
        ))}
        <button className="reset-button" onClick={reset}>
          <RotateCcw size={15} />
          Reset to Base Plan
        </button>
      </div>
      <div className="scenario-layout">
        <Panel
          title="Planning assumptions"
          eyebrow="ILLUSTRATIVE ASSUMPTION-BASED SCENARIO"
          className="scenario-controls"
        >
          <p className="scenario-label">
            Illustrative assumption-based scenario.
          </p>
          {controls.map((c) => (
            <label className="range-field" key={c.key} htmlFor={c.key}>
              <span>
                <span id={`${c.key}-label`}>{c.label}</span>
                <output htmlFor={c.key}>
                  {state[c.key] > 0 &&
                  ![
                    "plannedBuyUnits",
                    "plusMigrationPct",
                    "setAttachRatePct",
                  ].includes(c.key)
                    ? "+"
                    : ""}
                  {state[c.key].toLocaleString("en-GB")} {c.unit}
                </output>
              </span>
              <input
                id={c.key}
                aria-labelledby={`${c.key}-label`}
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={state[c.key]}
                onChange={(e) => update({ [c.key]: Number(e.target.value) })}
              />
              <small>
                <span>
                  {c.min.toLocaleString("en-GB")} {c.unit}
                </span>
                <span>
                  {c.max.toLocaleString("en-GB")} {c.unit}
                </span>
              </small>
            </label>
          ))}
          <label className="switch-field" htmlFor="launch-extension">
            <span id="launch-extension-label">Launch Extension</span>
            <select
              id="launch-extension"
              aria-labelledby="launch-extension-label"
              value={state.launchExtensionEnabled ? "on" : "off"}
              onChange={(e) =>
                update({ launchExtensionEnabled: e.target.value === "on" })
              }
            >
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </label>
          <div className="horizon-field">
            <span className="field-label">Planning horizon</span>
            <div className="segmented">
              {([4, 8, 13] as const).map((h) => (
                <button
                  key={h}
                  aria-pressed={horizon === h}
                  onClick={() => setHorizon(h)}
                >
                  {h} weeks
                </button>
              ))}
            </div>
          </div>
        </Panel>
        <div className="scenario-results" aria-live="polite">
          {unsupported && (
            <div className="unsupported-notice">
              <TriangleAlert size={19} />
              <div>
                <strong>Additional assumption rules require review.</strong>
                <p>
                  The specification does not supply coefficients for this
                  combination. The chart remains a preset reference; operational
                  recommendations are not calculated from these edits.
                </p>
              </div>
            </div>
          )}
          <Panel
            title={`${output.preset.label}${unsupported ? " · Preset reference curve" : ""}`}
            eyebrow={`${state.plannedBuyUnits.toLocaleString("en-GB")}-UNIT ${unsupported ? "REFERENCE" : "PLANNING SCENARIO"}`}
            aside={<ConfidenceBadge />}
          >
            <p className="scenario-label">
              Illustrative assumption-based scenario.
            </p>
            <PlanningChart
              data={output.curve.map((r) => ({
                size: r.size,
                base:
                  ((baseDepth.find((b) => b.size === r.size)?.units ?? 0) *
                    state.plannedBuyUnits) /
                  1000,
                scenario: r.units,
              }))}
              series={[
                {
                  key: "base",
                  label: "Base Fit-Adjusted Curve",
                  color: chartColors.initial,
                },
                {
                  key: "scenario",
                  label: unsupported
                    ? "Preset Reference Curve"
                    : output.preset.label,
                  color: chartColors.adjusted,
                },
              ]}
              label="Base versus selected scenario size depth"
            />
            <div className="chart-total">
              Total: {Number(total.toFixed(6)).toLocaleString("en-GB")} units
            </div>
            {state.mode === "FULLER_CUP_SHIFT" && (
              <p className="source-note">
                M+ / L+ are hypothetical scenario categories only. The current
                collaboration does not prove M+ or L+ demand.
              </p>
            )}
          </Panel>
          <Panel title="Operational implications">
            <p className="scenario-label">
              Illustrative assumption-based scenario.
            </p>
            <div className="metrics-grid metrics-three">
              <Metric
                value={output.actions ?? "Not supplied"}
                label="Immediate planning actions"
              />
              <Metric
                value={output.setRisks ?? "Not supplied"}
                label="Matching-set risks"
              />
              <Metric value="Moderate" label="Confidence" />
            </div>
            {output.isExactPreset && (
              <ul className="impact-list">
                {output.preset.impacts.map((impact) => (
                  <li key={impact}>{impact}</li>
                ))}
              </ul>
            )}
            <div className="recommendation">
              <span className="field-label">
                {output.isExactPreset
                  ? "ScaleSight recommendation"
                  : "Supplied preset interpretation"}
              </span>
              <p>{output.preset.recommendation}</p>
            </div>
            {state.mode === "FULLER_CUP_SHIFT" && (
              <DecisionBadge decision="INVESTIGATE" />
            )}
            {!output.isExactPreset && !unsupported && (
              <p className="source-note">
                Size depth scales using sizeUnits = totalPlannedUnits ×
                selectedSizeShare. The specification does not supply action or
                set-risk counts for a different buy quantity.
              </p>
            )}
          </Panel>
          <Panel
            title="Explicit formula calculations"
            eyebrow="PLANNING ASSUMPTIONS"
          >
            <p className="scenario-label">
              Illustrative assumption-based scenario.
            </p>
            <div className="formula-results">
              <div>
                <span className="field-label">
                  Cherry M · Required inventory
                </span>
                <strong>{required.toLocaleString("en-GB")} units</strong>
                <p>
                  {mVariant.forecastWeeklyUnits} units/week × (
                  {mVariant.leadTimeWeeks + state.leadTimeAdjustmentWeeks}{" "}
                  lead-time weeks + {mVariant.safetyStockWeeks} safety-stock
                  weeks)
                </p>
              </div>
              <div>
                <span className="field-label">+ Capacity hypothesis</span>
                <strong>
                  {Number(output.plusTestCapacity.toFixed(2)).toLocaleString(
                    "en-GB",
                  )}{" "}
                  units
                </strong>
                <p>
                  {state.plannedBuyUnits.toLocaleString("en-GB")} × 55% M/L
                  capacity × {state.plusMigrationPct}% migration assumption
                </p>
              </div>
            </div>
            <p className="source-note">
              The inventory calculation uses unchanged supplied weekly demand
              and the selected lead-time adjustment. Incoming receipt dates and
              a universal per-size + migration rule are not supplied.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
