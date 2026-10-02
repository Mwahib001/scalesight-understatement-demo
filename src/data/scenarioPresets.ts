import type {
  ScenarioMode,
  ScenarioPreset,
  ScenarioState,
  SizeDepth,
} from "../types";
import { baseDepth, plusDepth } from "./sizeCurves";
export const baseScenario: ScenarioState = {
  mode: "BASE",
  overallDemandUpliftPct: 0,
  mDemandAdjustmentPct: 0,
  lDemandAdjustmentPct: 0,
  returnRateAdjustmentPP: 0,
  exchangeRateAdjustmentPP: 0,
  leadTimeAdjustmentWeeks: 0,
  plannedBuyUnits: 1000,
  plusMigrationPct: 0,
  setAttachRatePct: 62,
  launchExtensionEnabled: false,
  fitAdjustedDemandEnabled: true,
};
const curve = (values: number[]): readonly SizeDepth[] =>
  baseDepth.map((r, i) => ({ size: r.size, units: values[i] }));
export const scenarioPresets: Record<ScenarioMode, ScenarioPreset> = {
  BASE: {
    mode: "BASE",
    label: "Base",
    curve: baseDepth,
    controls: { ...baseScenario },
    actions: 18,
    setRisks: 2,
    impacts: [
      "18 immediate planning actions",
      "2 matching-set risks",
      "Moderate confidence",
    ],
    recommendation:
      "Use deeper M as the current planning direction, but preserve style-specific judgment rather than applying a universal curve.",
  },
  M_ACCELERATION: {
    mode: "M_ACCELERATION",
    label: "M Acceleration",
    curve: curve([70, 170, 360, 210, 100, 55, 35]),
    controls: {
      ...baseScenario,
      mode: "M_ACCELERATION",
      mDemandAdjustmentPct: 10,
    },
    actions: null,
    setRisks: 3,
    impacts: ["M demand +10%", "M: 330 → 360", "3 matching-set risks"],
    recommendation:
      "Protect additional M depth across both the top and matching bottom rather than increasing the top in isolation.",
  },
  FIT_FRICTION: {
    mode: "FIT_FRICTION",
    label: "Fit Friction",
    curve: curve([75, 175, 350, 190, 110, 60, 40]),
    controls: {
      ...baseScenario,
      mode: "FIT_FRICTION",
      exchangeRateAdjustmentPP: 5,
      lDemandAdjustmentPct: -12,
      mDemandAdjustmentPct: 6,
    },
    actions: null,
    setRisks: null,
    impacts: [
      "L exchange rate +5 percentage points",
      "L fit-adjusted demand -12%",
      "M retained demand +6%",
    ],
    recommendation:
      "Reduce incremental L commitment and preserve capacity for M until the fit signal stabilises.",
  },
  FULLER_CUP_SHIFT: {
    mode: "FULLER_CUP_SHIFT",
    label: "Fuller-Cup Shift",
    curve: plusDepth,
    controls: {
      ...baseScenario,
      mode: "FULLER_CUP_SHIFT",
      plusMigrationPct: 20,
    },
    actions: null,
    setRisks: null,
    impacts: ["110 + test units", "20% of M/L capacity", "INVESTIGATE"],
    recommendation:
      "Do not treat this as a buy instruction. Use it to quantify the capacity that could be tested if fuller-cup evidence strengthens across additional launches.",
  },
  SUPPLIER_DELAY: {
    mode: "SUPPLIER_DELAY",
    label: "Supplier Delay",
    curve: baseDepth,
    controls: {
      ...baseScenario,
      mode: "SUPPLIER_DELAY",
      leadTimeAdjustmentWeeks: 2,
    },
    actions: 26,
    setRisks: 4,
    impacts: [
      "Lead time +2 weeks",
      "26 immediate planning actions",
      "4 matching-set risks",
    ],
    recommendation:
      "The lead-time delay increases the operational importance of low-cover M variants because the business has less time to recover before the next receipt.",
  },
};
