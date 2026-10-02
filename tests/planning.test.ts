import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { operatingRows } from "../src/data/operatingRows";
import { products } from "../src/data/products";
import {
  variants,
  monitoringCounts,
  immediateActions,
} from "../src/data/variants";
import { fitComposition, learningCohorts } from "../src/data/fitComposition";
import {
  fitSignals,
  cherryMovement,
  matchingSetRisks,
} from "../src/data/fitSignals";
import {
  sizeCurves,
  initialDepth,
  baseDepth,
  plusDepth,
} from "../src/data/sizeCurves";
import { baseScenario, scenarioPresets } from "../src/data/scenarioPresets";
import { priorities, reviewChanges } from "../src/data/weeklyBrief";
import {
  calculateRetainedDemand,
  calculateExchangeOutRate,
  calculateCommercialDemandIndex,
  calculateWeeksOfCover,
  calculateLeadTimeDemand,
  calculateSafetyStock,
  calculateReorderGap,
  calculateProjectedInventory,
  calculateSizeDepth,
  calculateSetRisk,
  derivedPosition,
} from "../src/lib/calculations";
import { applyScenario } from "../src/lib/scenario";
import {
  generateModelRecommendation,
  applyAnalystOverride,
  type RecommendationInput,
} from "../src/lib/recommendations";
import type { ScenarioMode } from "../src/types";

const sum = (values: readonly number[]) =>
  values.reduce((total, value) => total + value, 0);

test("all CSV values and identifiers survive loading unchanged", () => {
  const [header, ...lines] = readFileSync(
    "files/understatement-85-variant-dataset.csv",
    "utf8",
  )
    .trim()
    .split(/\r?\n/);
  const fields = header.split(",");
  const numeric = new Set([
    "onHand",
    "incoming",
    "grossSales",
    "returns",
    "exchangeOut",
    "exchangeIn",
    "retainedDemand",
    "forecastWeeklyUnits",
    "weeksOfCover",
  ]);
  const source = lines.map((line) =>
    Object.fromEntries(
      line
        .split(",")
        .map((value, i) => [
          fields[i],
          numeric.has(fields[i]) ? Number(value) : value,
        ]),
    ),
  );
  assert.deepEqual(source, operatingRows);
  for (const [i, v] of variants.entries()) {
    const row = operatingRows[i];
    assert.equal(v.publicSku, row.publicSku);
    assert.equal(v.barcode, row.barcode);
    assert.equal(v.sourceRetainedDemand, row.retainedDemand);
    assert.equal(v.sourceWeeksOfCover, row.weeksOfCover);
    assert.equal(v.analystRecommendation, row.decision);
    assert.equal(v.confidence, "MODERATE");
    assert.equal(derivedPosition(v).retainedDemand, row.retainedDemand);
    assert.ok(
      Math.abs(derivedPosition(v).weeksOfCover - row.weeksOfCover) <= 0.050001,
    );
  }
});

test("complete eight-product catalog excludes Plum 90E and all hypothetical categories", () => {
  assert.equal(products.length, 8);
  assert.equal(variants.length, 85);
  assert.equal(new Set(variants.map((v) => v.publicSku)).size, 85);
  assert.equal(new Set(variants.map((v) => v.barcode)).size, 85);
  const counts = Object.fromEntries(
    products.map((p) => [
      p.productId,
      variants.filter((v) => v.productId === p.productId).length,
    ]),
  );
  assert.deepEqual(counts, {
    "DL-BRA": 24,
    "DL-BTM": 7,
    "PL-BRA": 19,
    "PL-BTM": 7,
    "CP-BRA": 7,
    "CP-BTM": 7,
    "CH-BRA": 7,
    "CH-BTM": 7,
  });
  assert.ok(
    !variants.some(
      (v) =>
        (v.productId === "PL-BRA" && v.size === "90E") || v.size.includes("+"),
    ),
  );
  assert.equal(variants.filter((v) => v.naturanaPublicSku !== null).length, 4);
  for (const v of variants) {
    if (v.sizeSystem === "BAND_CUP") assert.equal(`${v.band}${v.cup}`, v.size);
    if (v.sizeSystem === "EU_NUMERIC")
      assert.equal(String(v.numericSize), v.size);
    if (v.sizeSystem === "ALPHA") {
      const matching = variants.find(
        (m) => m.demoVariantId === v.matchingVariantId,
      );
      assert.ok(matching);
      assert.equal(matching.size, v.size);
      assert.equal(matching.matchingSetId, v.matchingSetId);
      assert.notEqual(matching.productType, v.productType);
    } else assert.equal(v.matchingVariantId, undefined);
  }
});

test("operating assumptions match the supplied product contracts", () => {
  const expected = [
    ["DL-BRA", 65, 64.95, 25, 8, 2, 8],
    ["DL-BTM", 35, 34.95, 10, 6, 1.5, 6],
    ["PL-BRA", 65, 59.9, 25, 8, 2, 8],
    ["PL-BTM", 35, 34.95, 10, 6, 1.5, 6],
    ["CP-BRA", 69, 69, 23, 7, 2, 8],
    ["CP-BTM", 35, 35, 10, 5, 1.5, 6],
    ["CH-BRA", 79, 79, 25, 7, 2, 8],
    ["CH-BTM", 35, 35, 10, 5, 1.5, 6],
  ];
  assert.deepEqual(
    products.map((p) => [
      p.productId,
      p.understatementPublicPriceEUR,
      p.naturanaPublicPriceEUR,
      p.syntheticUnitCostEUR,
      p.leadTimeWeeks,
      p.safetyStockWeeks,
      p.targetCoverWeeks,
    ]),
    expected,
  );
});

test("monitoring counts and brief priorities match every canonical total", () => {
  assert.deepEqual(monitoringCounts, {
    BUY_DEEPER: 6,
    REPLENISH: 11,
    INVESTIGATE: 1,
    WATCH: 9,
    REDUCE_NEXT_BUY: 9,
    HOLD: 49,
  });
  assert.equal(immediateActions, 18);
  assert.equal(sum(Object.values(monitoringCounts)), 85);
  assert.equal(priorities.length, 4);
  assert.equal(reviewChanges.length, 7);
  assert.equal(matchingSetRisks.length, 2);
  assert.deepEqual(
    matchingSetRisks.map((r) => [r.set, r.topCover, r.bottomCover]),
    [
      ["Candy Pink", 2, 1.8],
      ["Cherry", 2.2, 1.7],
    ],
  );
  assert.equal(variants.filter(calculateSetRisk).length, 4);
});

test("fit movement calculations preserve the three narrative signals and Cherry L override", () => {
  assert.deepEqual(
    fitSignals.map((s) => [
      s.label,
      s.gross,
      s.returns,
      s.exchangeOut,
      s.exchangeIn,
      s.retained,
      s.index,
      s.decision,
    ]),
    [
      ["Cherry L", 34, 4, 6, 1, 25, 86, "INVESTIGATE"],
      ["Cherry M", 30, 2, 1, 4, 31, 119, "BUY_DEEPER"],
      ["Candy Pink M", 36, 2, 1, 4, 37, 128, "BUY_DEEPER"],
    ],
  );
  for (const s of fitSignals) {
    assert.equal(
      calculateRetainedDemand(s.gross, s.returns, s.exchangeOut, s.exchangeIn),
      s.retained,
    );
    assert.equal(
      Math.round(
        calculateCommercialDemandIndex(
          s.retained,
          s.initialExpectedRetainedDemand,
        )!,
      ),
      s.index,
    );
  }
  assert.equal(Math.round(calculateExchangeOutRate(6, 34) * 100), 18);
  assert.equal(
    Math.round((cherryMovement.movedToM / cherryMovement.exchangeOut) * 100),
    67,
  );
  const cherryL = variants.find(
    (v) => v.productId === "CH-BRA" && v.size === "L",
  )!;
  assert.equal(cherryL.modelRecommendation, "BUY_DEEPER");
  assert.equal(cherryL.analystRecommendation, "INVESTIGATE");
  assert.equal(cherryL.overrideType, "FIT_SIGNAL");
  assert.equal(
    cherryL.analystReason,
    "Elevated L→M exchanges materially weaken retained L demand.",
  );
});

test("composition, curves, learning and size depths remain independent canonical fixtures", () => {
  assert.deepEqual(
    fitComposition.map((c) => c.initialSharePct),
    [22, 27, 31, 20],
  );
  assert.deepEqual(
    fitComposition.map((c) => c.currentSharePct),
    [18, 34, 29, 19],
  );
  for (const key of ["initialSharePct", "currentSharePct"] as const)
    assert.equal(sum(fitComposition.map((c) => c[key])), 100);
  assert.ok(
    fitComposition.every((c) => c.synthetic && c.confidence === "MODERATE"),
  );
  assert.equal(
    fitComposition[1].currentSharePct - fitComposition[1].initialSharePct,
    7,
  );
  for (const key of ["initial", "gross", "adjusted"] as const)
    assert.equal(sum(sizeCurves.map((c) => c[key])), 100);
  assert.deepEqual(
    sizeCurves.map((c) => [c.initial, c.gross, c.adjusted]),
    [
      [9, 7, 7.5],
      [18, 17, 17.5],
      [24, 31, 33],
      [25, 26, 22],
      [13, 10, 10.5],
      [7, 6, 6],
      [4, 3, 3.5],
    ],
  );
  assert.deepEqual(
    initialDepth.map((c) => c.units),
    [90, 180, 240, 250, 130, 70, 40],
  );
  assert.deepEqual(
    baseDepth.map((c) => c.units),
    [75, 175, 330, 220, 105, 60, 35],
  );
  assert.deepEqual(
    baseDepth.map((c, i) => c.units - initialDepth[i].units),
    [-15, -5, 90, -30, -25, -10, -5],
  );
  for (const curve of [initialDepth, baseDepth, plusDepth])
    assert.equal(sum(curve.map((c) => c.units)), 1000);
  assert.equal(
    sum(plusDepth.filter((c) => c.size.includes("+")).map((c) => c.units)),
    110,
  );
  assert.equal(learningCohorts.length, 6);
  assert.deepEqual(
    learningCohorts.map((c) => [c.initial, c.early, c.change]),
    [
      ["55% M / 45% L", "66% M / 34% L", "Increase M weighting"],
      ["50% M / 50% L", "58% M / 42% L", "Moderate M uplift"],
      ["60% L / 40% XL", "51% L / 49% XL", "Raise XL assumption"],
      ["35% L / 65% XL", "37% L / 63% XL", "No material change"],
      ["60% XL / 40% XXL", "57% XL / 43% XXL", "No material change"],
      ["65% XXL / 35% 3XL", "62% XXL / 38% 3XL", "Keep under review"],
    ],
  );
});

test("all five scenarios use the exact supplied curves and only supplied operational counts", () => {
  const expected: Record<ScenarioMode, number[]> = {
    BASE: [75, 175, 330, 220, 105, 60, 35],
    M_ACCELERATION: [70, 170, 360, 210, 100, 55, 35],
    FIT_FRICTION: [75, 175, 350, 190, 110, 60, 40],
    FULLER_CUP_SHIFT: [75, 175, 280, 80, 160, 30, 105, 60, 35],
    SUPPLIER_DELAY: [75, 175, 330, 220, 105, 60, 35],
  };
  const catalog = JSON.stringify(variants);
  for (const mode of Object.keys(expected) as ScenarioMode[]) {
    const result = applyScenario({ ...scenarioPresets[mode].controls });
    assert.ok(result.isExactPreset);
    assert.deepEqual(result.unsupportedKeys, []);
    assert.deepEqual(
      result.curve.map((c) => c.units),
      expected[mode],
    );
    assert.equal(sum(result.curve.map((c) => c.units)), 1000);
    assert.equal(result.confidence, "MODERATE");
  }
  assert.equal(applyScenario(baseScenario).actions, 18);
  assert.equal(applyScenario(baseScenario).setRisks, 2);
  assert.equal(
    applyScenario(scenarioPresets.M_ACCELERATION.controls).setRisks,
    3,
  );
  const delayed = applyScenario(scenarioPresets.SUPPLIER_DELAY.controls);
  assert.equal(delayed.actions, 26);
  assert.equal(delayed.setRisks, 4);
  assert.equal(
    applyScenario(scenarioPresets.FULLER_CUP_SHIFT.controls).plusTestCapacity,
    110,
  );
  assert.equal(JSON.stringify(variants), catalog);
});

test("buy quantity scales by the supplied formula and unsupported combinations get no invented counts", () => {
  const scaled = applyScenario({ ...baseScenario, plannedBuyUnits: 1500 });
  scaled.curve.forEach((c, i) =>
    assert.ok(Math.abs(c.units - baseDepth[i].units * 1.5) < 1e-9),
  );
  assert.equal(sum(scaled.curve.map((c) => c.units)), 1500);
  assert.equal(scaled.actions, null);
  assert.equal(scaled.setRisks, null);
  const edited = applyScenario({
    ...baseScenario,
    overallDemandUpliftPct: 20,
    returnRateAdjustmentPP: 4,
    launchExtensionEnabled: true,
  });
  assert.deepEqual(edited.unsupportedKeys, [
    "overallDemandUpliftPct",
    "returnRateAdjustmentPP",
    "launchExtensionEnabled",
  ]);
  assert.equal(edited.actions, null);
  assert.equal(edited.setRisks, null);
  assert.deepEqual(
    edited.curve.map((c) => c.units),
    baseDepth.map((c) => c.units),
  );
});

test("inventory formulas use explicit timing inputs without fabricated receipts or clamping deficits", () => {
  assert.equal(calculateLeadTimeDemand(15, 7), 105);
  assert.equal(calculateSafetyStock(15, 2), 30);
  assert.equal(calculateReorderGap(135, 33, 0), 102);
  assert.equal(calculateReorderGap(135, 33, 22), 80);
  assert.equal(calculateReorderGap(135, 33, 150), 0);
  assert.deepEqual(
    calculateProjectedInventory(33, [0, 0, 22], [15, 30, 45]),
    [18, 3, 10],
  );
  assert.deepEqual(
    calculateProjectedInventory(33, [0, 0, 0], [15, 30, 45]),
    [18, 3, -12],
  );
  assert.equal(calculateWeeksOfCover(33, 15), 2.2);
  assert.equal(calculateSizeDepth(1000, 0.33), 330);
});

test("recommendation rules respect thresholds, confidence, incoming coverage and analyst context", () => {
  const input: RecommendationInput = {
    fitAdjustedDemand: 116,
    forwardDemand: 116,
    planningExpectation: 100,
    weeksOfCover: 3,
    targetCoverWeeks: 8,
    confidence: "MODERATE",
    reorderGap: 20,
    exchangeOutRate: 0.02,
    grossDemandStrong: true,
    retainedMateriallyDisagrees: false,
    signalMayMatter: true,
    maintainDepthContext: false,
  };
  assert.equal(generateModelRecommendation(input), "BUY_DEEPER");
  assert.equal(
    generateModelRecommendation({ ...input, fitAdjustedDemand: 115 }),
    "REPLENISH",
  );
  assert.equal(
    generateModelRecommendation({ ...input, weeksOfCover: 4 }),
    "REPLENISH",
  );
  assert.equal(
    generateModelRecommendation({ ...input, confidence: "LOW" }),
    "WATCH",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 100,
      reorderGap: 0,
    }),
    "HOLD",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 86,
      exchangeOutRate: 0.18,
      retainedMateriallyDisagrees: true,
    }),
    "INVESTIGATE",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 86,
      exchangeOutRate: 0.149,
      retainedMateriallyDisagrees: true,
    }),
    "HOLD",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 90,
      forwardDemand: 90,
      weeksOfCover: 10,
    }),
    "REDUCE_NEXT_BUY",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 90,
      forwardDemand: 90,
      weeksOfCover: 10,
      maintainDepthContext: true,
    }),
    "HOLD",
  );
  assert.equal(
    generateModelRecommendation({
      ...input,
      fitAdjustedDemand: 90,
      forwardDemand: 110,
      weeksOfCover: 10,
    }),
    "HOLD",
  );
  assert.equal(
    generateModelRecommendation({ ...input, planningExpectation: null }),
    null,
  );
  assert.deepEqual(
    applyAnalystOverride("BUY_DEEPER", {
      analystRecommendation: "INVESTIGATE",
      overrideType: "FIT_SIGNAL",
      analystReason:
        "Elevated L→M exchanges materially weaken retained L demand.",
    }),
    {
      modelRecommendation: "BUY_DEEPER",
      analystRecommendation: "INVESTIGATE",
      overrideType: "FIT_SIGNAL",
      analystReason:
        "Elevated L→M exchanges materially weaken retained L demand.",
    },
  );
});
