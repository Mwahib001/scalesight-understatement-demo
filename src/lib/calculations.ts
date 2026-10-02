import type { Variant } from "../types";
import { matchingSetRisks } from "../data/fitSignals";
export function calculateRetainedDemand(
  grossSales: number,
  returns: number,
  exchangeOut: number,
  exchangeIn: number,
) {
  return grossSales - returns - exchangeOut + exchangeIn;
}
export function calculateExchangeOutRate(
  exchangeOut: number,
  grossSales: number,
) {
  return grossSales === 0 ? 0 : exchangeOut / grossSales;
}
export function calculateCommercialDemandIndex(
  retainedDemand: number,
  initialExpectedRetainedDemand: number,
) {
  return initialExpectedRetainedDemand > 0
    ? (retainedDemand / initialExpectedRetainedDemand) * 100
    : null;
}
export function calculateWeeksOfCover(
  onHand: number,
  forwardWeeklyDemand: number,
) {
  return forwardWeeklyDemand > 0 ? onHand / forwardWeeklyDemand : Infinity;
}
export function calculateLeadTimeDemand(
  forwardWeeklyDemand: number,
  leadTimeWeeks: number,
) {
  return forwardWeeklyDemand * leadTimeWeeks;
}
export function calculateSafetyStock(
  forwardWeeklyDemand: number,
  safetyStockWeeks: number,
) {
  return forwardWeeklyDemand * safetyStockWeeks;
}
export function calculateReorderGap(
  requiredInventory: number,
  currentAvailableInventory: number,
  confirmedIncomingBeforeRequirementDate: number,
) {
  return Math.max(
    0,
    requiredInventory -
      currentAvailableInventory -
      confirmedIncomingBeforeRequirementDate,
  );
}
export function calculateProjectedInventory(
  openingInventory: number,
  cumulativeIncoming: readonly number[],
  cumulativeForecastDemand: readonly number[],
) {
  return cumulativeForecastDemand.map(
    (demand, t) => openingInventory + (cumulativeIncoming[t] ?? 0) - demand,
  );
}
export function calculateSizeDepth(
  totalPlannedUnits: number,
  selectedSizeShare: number,
) {
  return totalPlannedUnits * selectedSizeShare;
}
// Only the two explicitly supplied matching-set risk stories are classified.
// No universal cover threshold or band/cup→numeric mapping was supplied.
export function calculateSetRisk(variant: Pick<Variant, "productId" | "size">) {
  return matchingSetRisks.some(
    (r) =>
      r.size === variant.size &&
      (r.topProductId === variant.productId ||
        r.bottomProductId === variant.productId),
  );
}
export function derivedPosition(v: Variant) {
  return {
    retainedDemand: calculateRetainedDemand(
      v.grossLaunchSales,
      v.returns,
      v.exchangeOut,
      v.exchangeIn,
    ),
    exchangeOutRate: calculateExchangeOutRate(
      v.exchangeOut,
      v.grossLaunchSales,
    ),
    weeksOfCover: calculateWeeksOfCover(v.onHand, v.forecastWeeklyUnits),
    leadTimeDemand: calculateLeadTimeDemand(
      v.forecastWeeklyUnits,
      v.leadTimeWeeks,
    ),
    safetyStock: calculateSafetyStock(
      v.forecastWeeklyUnits,
      v.safetyStockWeeks,
    ),
    setRisk: calculateSetRisk(v),
  };
}
