import { operatingRows } from "./operatingRows";
import { products } from "./products";
import type { Variant } from "../types";
import { applyAnalystOverride } from "../lib/recommendations";
const recordedNaturanaSkus: Record<string, string> = {
  "U-329-001-70A": "5687_842_70A_4_4055403909388",
  "U-330-001-36": "4687_656_36_3_4055403909265",
  "U-285-004-S": "15285_630_S_4_7333468033895",
  "U-260-002-XS": "14260_658_XS_3_7333468034090",
};
export const variants: readonly Variant[] = operatingRows.map((row) => {
  const product = products.find((p) => p.productId === row.productId);
  if (!product) throw new Error(`Unknown product ${row.productId}`);
  const cherryL = row.productId === "CH-BRA" && row.size === "L";
  const counterpartId = row.productId.endsWith("BRA")
    ? row.productId.replace("BRA", "BTM")
    : row.productId.replace("BTM", "BRA");
  const matching =
    product.sizeSystem === "ALPHA"
      ? operatingRows.find(
          (r) => r.productId === counterpartId && r.size === row.size,
        )
      : undefined;
  return {
    ...product,
    demoVariantId: row.publicSku,
    size: row.size,
    publicSku: row.publicSku,
    barcode: row.barcode,
    naturanaPublicSku: recordedNaturanaSkus[row.publicSku] ?? null,
    ...(product.sizeSystem === "BAND_CUP"
      ? { band: Number(row.size.slice(0, -1)), cup: row.size.slice(-1) }
      : product.sizeSystem === "EU_NUMERIC"
        ? { numericSize: Number(row.size) }
        : { alphaSize: row.size }),
    onHand: row.onHand,
    incoming: row.incoming,
    grossLaunchSales: row.grossSales,
    returns: row.returns,
    exchangeOut: row.exchangeOut,
    exchangeIn: row.exchangeIn,
    forecastWeeklyUnits: row.forecastWeeklyUnits,
    sourceRetainedDemand: row.retainedDemand,
    sourceWeeksOfCover: row.weeksOfCover,
    confidence: "MODERATE",
    matchingVariantId: matching?.publicSku,
    ...applyAnalystOverride(
      cherryL ? "BUY_DEEPER" : row.decision,
      cherryL
        ? {
            analystRecommendation: "INVESTIGATE",
            overrideType: "FIT_SIGNAL",
            analystReason:
              "Elevated L→M exchanges materially weaken retained L demand.",
          }
        : undefined,
    ),
  };
});
export const monitoringCounts = variants.reduce(
  (counts, v) => ({
    ...counts,
    [v.analystRecommendation]: counts[v.analystRecommendation] + 1,
  }),
  {
    BUY_DEEPER: 0,
    REPLENISH: 0,
    INVESTIGATE: 0,
    WATCH: 0,
    REDUCE_NEXT_BUY: 0,
    HOLD: 0,
  },
);
export const immediateActions =
  monitoringCounts.BUY_DEEPER +
  monitoringCounts.REPLENISH +
  monitoringCounts.INVESTIGATE;
