import { scenarioPresets } from "../data/scenarioPresets";
import type { ScenarioState } from "../types";
import { calculateSizeDepth } from "./calculations";
// The PDF defines presets, sizeUnits and a capacity hypothesis. It does not
// define coefficients for arbitrary demand, fit, attach-rate or launch mixes.
export function applyScenario(state: ScenarioState) {
  const preset = scenarioPresets[state.mode];
  const unsupportedKeys = (
    Object.keys(state) as (keyof ScenarioState)[]
  ).filter(
    (key) => key !== "plannedBuyUnits" && state[key] !== preset.controls[key],
  );
  const isExactPreset =
    unsupportedKeys.length === 0 && state.plannedBuyUnits === 1000;
  return {
    preset,
    unsupportedKeys,
    isExactPreset,
    curve: preset.curve.map((row) => ({
      size: row.size,
      units: calculateSizeDepth(state.plannedBuyUnits, row.units / 1000),
    })),
    actions: isExactPreset ? preset.actions : null,
    setRisks: isExactPreset ? preset.setRisks : null,
    plusTestCapacity:
      (calculateSizeDepth(state.plannedBuyUnits, 0.55) *
        state.plusMigrationPct) /
      100,
    confidence: "MODERATE" as const,
  };
}
