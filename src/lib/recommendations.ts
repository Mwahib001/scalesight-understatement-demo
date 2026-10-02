import type { Confidence, DecisionAction } from "../types";
export interface RecommendationInput {
  fitAdjustedDemand: number;
  forwardDemand: number;
  planningExpectation: number | null;
  weeksOfCover: number;
  targetCoverWeeks: number;
  confidence: Confidence;
  reorderGap: number | null;
  exchangeOutRate: number;
  grossDemandStrong: boolean;
  retainedMateriallyDisagrees: boolean;
  signalMayMatter: boolean;
  maintainDepthContext: boolean;
}
// Materiality and context are explicit reviewed inputs. Do not invent thresholds
// or planning expectations for variants where the specification supplies none.
export function generateModelRecommendation(
  i: RecommendationInput,
): DecisionAction | null {
  if (
    i.grossDemandStrong &&
    i.exchangeOutRate >= 0.15 &&
    i.retainedMateriallyDisagrees
  )
    return "INVESTIGATE";
  if (i.confidence === "LOW" && i.signalMayMatter) return "WATCH";
  if (i.planningExpectation === null) return null;
  if (
    i.fitAdjustedDemand > (i.planningExpectation * 115) / 100 &&
    i.weeksOfCover < 4 &&
    i.confidence !== "LOW"
  )
    return "BUY_DEEPER";
  if (
    i.weeksOfCover < i.targetCoverWeeks &&
    i.fitAdjustedDemand >= i.planningExpectation &&
    i.reorderGap !== null &&
    i.reorderGap > 0
  )
    return "REPLENISH";
  if (
    i.weeksOfCover >= 10 &&
    i.forwardDemand <= i.planningExpectation &&
    !i.maintainDepthContext
  )
    return "REDUCE_NEXT_BUY";
  return "HOLD";
}
export function applyAnalystOverride(
  modelRecommendation: DecisionAction,
  override?: {
    analystRecommendation: DecisionAction;
    overrideType: string;
    analystReason: string;
  },
) {
  return {
    modelRecommendation,
    analystRecommendation:
      override?.analystRecommendation ?? modelRecommendation,
    ...(override
      ? {
          overrideType: override.overrideType,
          analystReason: override.analystReason,
        }
      : {}),
  };
}
