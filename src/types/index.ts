export type DecisionAction =
  | "BUY_DEEPER"
  | "REPLENISH"
  | "HOLD"
  | "WATCH"
  | "INVESTIGATE"
  | "REDUCE_NEXT_BUY";
export type Confidence = "LOW" | "MODERATE" | "HIGH";
export type SizeSystem = "BAND_CUP" | "EU_NUMERIC" | "ALPHA";
export interface Product {
  productId: string;
  understatementProductName: string;
  naturanaProductName: string;
  colour: string;
  productType: "Top" | "Bottom";
  matchingSetId: string;
  sizeSystem: SizeSystem;
  understatementPublicPriceEUR: number;
  naturanaPublicPriceEUR: number;
  syntheticUnitCostEUR: number;
  leadTimeWeeks: number;
  safetyStockWeeks: number;
  targetCoverWeeks: number;
}
export interface OperatingRow {
  productId: string;
  colour: string;
  size: string;
  publicSku: string;
  barcode: string;
  onHand: number;
  incoming: number;
  grossSales: number;
  returns: number;
  exchangeOut: number;
  exchangeIn: number;
  retainedDemand: number;
  forecastWeeklyUnits: number;
  weeksOfCover: number;
  decision: DecisionAction;
}
export interface Variant extends Product {
  demoVariantId: string;
  size: string;
  band?: number;
  cup?: string;
  numericSize?: number;
  alphaSize?: string;
  publicSku: string;
  barcode: string;
  naturanaPublicSku: string | null;
  onHand: number;
  incoming: number;
  grossLaunchSales: number;
  returns: number;
  exchangeOut: number;
  exchangeIn: number;
  forecastWeeklyUnits: number;
  confidence: Confidence;
  modelRecommendation: DecisionAction;
  analystRecommendation: DecisionAction;
  overrideType?: string;
  analystReason?: string;
  matchingVariantId?: string;
  sourceRetainedDemand: number;
  sourceWeeksOfCover: number;
}
export interface FitComposition {
  alphaSize: string;
  cohortLabel: string;
  initialSharePct: number;
  currentSharePct: number;
  confidence: Confidence;
  synthetic: true;
}
export type ScenarioMode =
  | "BASE"
  | "M_ACCELERATION"
  | "FIT_FRICTION"
  | "FULLER_CUP_SHIFT"
  | "SUPPLIER_DELAY";
export interface ScenarioState {
  mode: ScenarioMode;
  overallDemandUpliftPct: number;
  mDemandAdjustmentPct: number;
  lDemandAdjustmentPct: number;
  returnRateAdjustmentPP: number;
  exchangeRateAdjustmentPP: number;
  leadTimeAdjustmentWeeks: number;
  plannedBuyUnits: number;
  plusMigrationPct: number;
  setAttachRatePct: number;
  launchExtensionEnabled: boolean;
  fitAdjustedDemandEnabled: boolean;
}
export interface SizeDepth {
  size: string;
  units: number;
}
export interface ScenarioPreset {
  mode: ScenarioMode;
  label: string;
  curve: readonly SizeDepth[];
  controls: ScenarioState;
  actions: number | null;
  setRisks: number | null;
  impacts: readonly string[];
  recommendation: string;
}
export interface FitSignal {
  label: string;
  productId: string;
  size: string;
  gross: number;
  returns: number;
  exchangeOut: number;
  exchangeIn: number;
  retained: number;
  initialExpectedRetainedDemand: number;
  index: number;
  decision: DecisionAction;
}
