export const timeline = {
  launch: "18 Sept 2026",
  planningWeek: "28 Sept 2026",
  actualsThrough: "29 Sept 2026",
  refreshed: "30 Sept 2026 · 06:00 CEST",
  observationWindow: "18–29 Sept 2026",
  nextReview: "Monday 5 Oct 2026",
  currency: "EUR",
  defaultHorizon: 8,
} as const;
export const dataDisclaimer =
  "Product, size and catalog information is based on publicly available information. Sales, inventory, returns, exchanges, costs, forecasts, fit-cohort compositions and recommendations are synthetic assumptions created solely to demonstrate the ScaleSight planning workflow.";
export const fitDisclaimer =
  "Synthetic fit-cohort mappings are planning assumptions, not customer-facing fit guidance.";
export const compositionDisclaimer =
  "This composition is synthetic and is used only to demonstrate how a planning model could decompose commercial alpha-size demand into underlying fit cohorts.";
export const confidenceExplanation =
  "Confidence remains Moderate because the observation window is short and several fit relationships are still being learned.";
export const decisionLabels = {
  BUY_DEEPER: "BUY DEEPER",
  REPLENISH: "REPLENISH",
  INVESTIGATE: "INVESTIGATE",
  WATCH: "WATCH",
  REDUCE_NEXT_BUY: "REDUCE NEXT BUY",
  HOLD: "HOLD",
} as const;
export const decisionUrgency = {
  BUY_DEEPER: 0,
  REPLENISH: 1,
  INVESTIGATE: 2,
  WATCH: 3,
  REDUCE_NEXT_BUY: 4,
  HOLD: 5,
} as const;
