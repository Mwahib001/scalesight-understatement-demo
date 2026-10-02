# Master Prompt — ScaleSight × Understatement Build

**Paste this whole prompt into your coding agent, along with:**
- `ScaleSight_Understatement_Technical_Specification_Wahib_v1.pdf` (full spec, source of truth)
- `understatement-85-variant-dataset.csv` (the complete 85-row operating dataset, extracted verbatim from Section 06 / Appendix C of the PDF — use this file directly instead of re-typing numbers from the PDF)

---

## 0. Critical ground rule — do not mix this with the NATURANA project

This is a **second, separate prospect build** that reuses the NATURANA/ScaleSight codebase and architecture, but is **not** a reskin.

- Work in a **new branch / new app instance / new data folder** — do not overwrite the NATURANA demo in place unless I've explicitly branched first.
- Reuse: the underlying ScaleSight component architecture, calculation engine, chart library choices, design tokens, and overall visual system.
- Do **not** reuse: NATURANA's page flow, NATURANA-primary naming, NATURANA's specific page copy, or its narrower band/cup-only framing.
- If you are ever unsure whether something is "shared architecture" vs "NATURANA-specific content," treat it as NATURANA-specific and rebuild it for Understatement rather than copying it across.

Before marking anything done, run the "Definition of Done" self-check in Section 11 below — specifically: **"Does this feel like NATURANA's demo with a different logo?"** If yes, revise.

---

## 1. What this build is

A managed merchandise/size-planning demo workspace for the prospect **Understatement**, built on the NATURANA × Understatement capsule collaboration (8 products, 85 public variants). The core management question driving every page:

> "What fit demand is hidden inside broad alpha sizes, and what should that change in the next size curve?"

The hero narrative flow (this is the primary nav order, not just a suggestion):

```
Alpha composition → Size curve → Fit movement → SKU planning →
Size depth → + Opportunity → Scenario planning → Learning → Managed Intelligence
```

Merchandising/buying decisions are the center of this version — more so than in the NATURANA build.

It is explicitly **NOT**: a customer size converter, a fit quiz, a bra-fitting app, a returns dashboard, a generic BI dashboard, forecasting/inventory SaaS, a rigid size-planning tool, something the client has to babysit, a claim that ScaleSight knows anyone's correct size, a claim the collaboration proves + size demand, or a universal Understatement size curve.

---

## 2. Stack (reuse from NATURANA build)

Next.js · TypeScript · Tailwind CSS · shadcn/ui where useful · Recharts (or existing chart lib) · Lucide icons · React Context/hooks for scenario state · typed static TypeScript/JSON fixtures · no backend, no auth, no live integrations, no real Understatement data, no production ML, no AI chatbot. All calculations are deterministic, computed client-side against the supplied synthetic dataset.

Suggested folder structure (mirror whatever NATURANA already uses, renamed):
```
/app/page.tsx (Weekly Brief)
/app/alpha-composition
/app/size-curve
/app/fit-movement
/app/sku-planning
/app/size-depth
/app/plus-opportunity
/app/scenario
/app/forecast-learning
/app/managed-intelligence
/app/assumptions
/components/{charts,planning,fit,scenario,intelligence}
/data/{products.ts,variants.ts,fitComposition.ts,sizeCurves.ts,scenarioPresets.ts}
/lib/{calculations,forecast,sizeCurve,fitSignal,scenario,recommendations,formatters}
/types
/config
```

---

## 3. Naming rule

**Understatement product names are primary everywhere in the main UI.** NATURANA naming may appear only as secondary metadata inside a variant drawer/detail view.

| ID | Understatement name | NATURANA name (secondary metadata only) | Colour | Size system | U price (EUR) | N price (EUR) | Variants |
|---|---|---|---|---|---|---|---|
| DL-BRA | Micro Mesh Padded Bra | Wireless Triangle Bra – Dark Leo | Dark Leopard / Dark Leo | Band + cup | 65 | 64.95 | 24 |
| DL-BTM | Micro Mesh Midi Hipster | Briefs – Dark Leo | Dark Leopard / Dark Leo | EU numeric | 35 | 34.95 | 7 |
| PL-BRA | Micro Mesh Underwired Bra | Underwired Plunge Bra – Plum | Plum | Band + cup | 65 | 59.90 | 19 |
| PL-BTM | Micro Mesh Midi Hipster | Briefs – Plum | Plum | EU numeric | 35 | 34.95 | 7 |
| CP-BRA | Opaque Triangle Scoop Bralette | Wireless Triangle Bra – Candy Pink | Candy Pink | Alpha | 69 | 69 | 7 |
| CP-BTM | Opaque Mesh Midi Briefs | Midi-Briefs – Candy Pink | Candy Pink | Alpha | 35 | 35 | 7 |
| CH-BRA | Opaque Mesh Balconette | Wire-free Balconette Bra – Cherry | Cherry | Alpha | 79 | 79 | 7 |
| CH-BTM | Opaque Mesh Midi Briefs | Midi-Briefs – Cherry | Cherry | Alpha | 35 | 35 | 7 |

8 products, **exactly 85 variants total**. Do not simplify to only the Candy Pink / Cherry alpha products — the NATURANA band/cup and EU-numeric products must stay in, because they provide the fit structure behind the planning story.

**Hard constraint: do NOT create a "Plum 90E" variant.** Verify this is absent after loading the dataset.

Matching sets (top ↔ bottom):
- Dark Leo: Micro Mesh Padded Bra ↔ Micro Mesh Midi Hipster
- Plum: Micro Mesh Underwired Bra ↔ Micro Mesh Midi Hipster
- Candy Pink: Opaque Triangle Scoop Bralette ↔ Opaque Mesh Midi Briefs
- Cherry: Opaque Mesh Balconette ↔ Opaque Mesh Midi Briefs

---

## 4. Data loading

- Load `understatement-85-variant-dataset.csv` (attached) as the canonical 85-row operating dataset — product, colour, size, public SKU, barcode, on-hand, incoming, gross sales, returns, exchange-out, exchange-in, retained demand, forecast/week, weeks-of-cover, decision. **Use this file verbatim; do not recompute or alter the supplied retained-demand or decision values when loading raw rows** — only compute *derived* fields (see Section 8) from formula, not override the given ones unless they are themselves the output of that formula (they are — see QA in Section 10).
- `publicSku` and `barcode` from the PDF/CSV are canonical variant identifiers. Do not invent missing NATURANA internal SKUs — where the PDF doesn't supply one, set `naturanaPublicSku = null`.
- Per-product operating assumptions (inherit unchanged):

| Product | Cost (EUR) | Lead time (weeks) | Safety stock (weeks) | Target cover (weeks) |
|---|---|---|---|---|
| DL-BRA | 25 | 8 | 2 | 8 |
| DL-BTM | 10 | 6 | 1.5 | 6 |
| PL-BRA | 25 | 8 | 2 | 8 |
| PL-BTM | 10 | 6 | 1.5 | 6 |
| CP-BRA | 23 | 7 | 2 | 8 |
| CP-BTM | 10 | 5 | 1.5 | 6 |
| CH-BRA | 25 | 7 | 2 | 8 |
| CH-BTM | 10 | 5 | 1.5 | 6 |

Timeline (preserve exactly): capsule launch 18 Sept 2026 · planning week commencing 28 Sept 2026 · actuals through 29 Sept 2026 · data refresh 30 Sept 2026, 06:00 CEST · early launch observation window 18–29 Sept 2026 · default planning horizon 8 weeks (alt: 4/8/13) · next planning review Monday 5 Oct 2026 · currency EUR · demo classification "Illustrative Planning Concept."

---

## 5. TypeScript contracts

Reuse the NATURANA `Variant` model shape, but make Understatement naming primary:

```ts
type DecisionAction = "BUY_DEEPER" | "REPLENISH" | "HOLD" | "WATCH" | "INVESTIGATE" | "REDUCE_NEXT_BUY";
type Confidence = "LOW" | "MODERATE" | "HIGH";
type SizeSystem = "BAND_CUP" | "EU_NUMERIC" | "ALPHA";

interface Variant {
  demoVariantId: string;
  productId: string;
  understatementProductName: string;
  naturanaProductName: string;
  colour: string;
  productType: string;
  matchingSetId: string;
  sizeSystem: SizeSystem;
  size: string;
  band?: number;
  cup?: string;
  numericSize?: number;
  alphaSize?: string;
  publicSku: string;
  barcode: string;
  naturanaPublicSku?: string | null;
  understatementPublicPriceEUR: number;
  naturanaPublicPriceEUR?: number;
  syntheticUnitCostEUR: number;
  onHand: number;
  incoming: number;
  leadTimeWeeks: number;
  safetyStockWeeks: number;
  targetCoverWeeks: number;
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
}

interface FitComposition {
  alphaSize: string;
  cohortLabel: string;
  initialSharePct: number;
  currentSharePct: number;
  confidence: Confidence;
  synthetic: true; // always true — never present as real customer-fit data
}
```

Derived fields (`retainedDemand`, `exchangeOutRate`, `commercialDemandIndex`, `weeksOfCover`, `reorderGap`, `projectedInventory`, `setRisk`) must be calculated centrally via the `/lib/calculations` functions below, not hand-set per row (except where loaded directly from the CSV as already-derived ground truth to validate against).

---

## 6. Calculation reference — implement exactly these formulas

```
retainedDemand = grossSales - returns - exchangeOut + exchangeIn
exchangeOutRate = exchangeOut / grossSales
commercialDemandIndex = (retainedDemand / initialExpectedRetainedDemand) × 100
weeksOfCover = onHand / forwardWeeklyDemand
leadTimeDemand = forwardWeeklyDemand × leadTimeWeeks
safetyStock = forwardWeeklyDemand × safetyStockWeeks
requiredInventory = leadTimeDemand + safetyStock
reorderGap = max(0, requiredInventory - currentAvailableInventory - confirmedIncomingBeforeRequirementDate)
projectedInventory[t] = openingInventory + cumulativeIncoming[t] - cumulativeForecastDemand[t]
sizeUnits = totalPlannedUnits × selectedSizeShare   // e.g. 1000 × sizeShare for the canonical 1,000-unit view
```

Confidence is **qualitative only** (LOW / MODERATE / HIGH) — never invent a fake precision score like "92% AI confidence." Current demo confidence throughout = **MODERATE**.

Name the implementing functions: `calculateRetainedDemand()`, `calculateExchangeOutRate()`, `calculateCommercialDemandIndex()`, `calculateWeeksOfCover()`, `calculateLeadTimeDemand()`, `calculateSafetyStock()`, `calculateReorderGap()`, `calculateProjectedInventory()`, `calculateSizeDepth()`, `calculateSetRisk()`, `applyScenario()`, `generateModelRecommendation()`, `applyAnalystOverride()`.

### Recommendation engine rules
- **BUY_DEEPER**: fitAdjustedDemand > 115% of plan AND weeksOfCover < 4 AND confidence != LOW
- **REPLENISH**: weeksOfCover below target AND demand at/above plan AND incoming doesn't fully resolve the gap
- **INVESTIGATE**: gross demand strong BUT exchangeOutRate ≥ 15% AND retained demand materially disagrees with gross demand
- **WATCH**: signal may matter BUT confidence insufficient for commitment
- **REDUCE_NEXT_BUY**: weeksOfCover ≥ 10 AND forward demand at/below plan AND no context justifies maintaining depth
- **HOLD**: inside acceptable range

### Human analyst override pattern (use Cherry L as the canonical example everywhere this needs illustrating)
Model-only view would say Cherry L (34 gross, highest in the style) → BUY_DEEPER. But business/fit context (4 returns, 6 exchange-outs, 4 of those move to M, 1 exchange-in → 25 retained; Cherry M retained = 31) overrides it to:
```ts
{
  modelRecommendation: "BUY_DEEPER",
  analystRecommendation: "INVESTIGATE",
  overrideType: "FIT_SIGNAL",
  analystReason: "Elevated L→M exchanges materially weaken retained L demand."
}
```
This section of the UI must visibly separate **DATA → BUSINESS CONTEXT → PLANNING JUDGMENT**, distinct from a plain automated dashboard alert.

---

## 7. Canonical numbers — these are fixed, not derived from recomputing the 85-row table

⚠️ The spec explicitly warns: **the aggregate curves below are illustrative planning curves, NOT direct mathematical aggregates of the 85-row dataset.** Hardcode/preserve them exactly as given — do not let your code silently recompute and overwrite them from the SKU table.

**Size curves (% of demand):**

| Size | Initial % | Gross launch % | Fit-adjusted % |
|---|---|---|---|
| XS | 9 | 7 | 7.5 |
| S | 18 | 17 | 17.5 |
| M | 24 | 31 | **33** |
| L | 25 | 26 | **22** |
| XL | 13 | 10 | 10.5 |
| XXL | 7 | 6 | 6 |
| 3XL | 4 | 3 | 3.5 |

M: 24% → 33% (**+9 pts**). L: 25% → 22% (**-3 pts**). Each column totals 100%.

**M composition (synthetic, "ILLUSTRATIVE PLANNING COMPOSITION" — never present as real customer data):**

| Cohort | Initial planning % | Early illustrative % |
|---|---|---|
| 75A–75B | 22 | 18 |
| 75C–75D | 27 | **34** |
| 80A–80B | 31 | 29 |
| Other | 20 | 19 |

Each totals 100%. Insight: 75C–75D cohort is +7 pts above its initial planning assumption.

**Fit movement (use these exact figures, not recomputed from the CSV's own per-row numbers for this specific trio — they match, but hardcode the narrative block as its own typed fixture so it can't drift):**

| | Gross | Returns | ExOut | ExIn | Retained | Index vs plan | Decision |
|---|---|---|---|---|---|---|---|
| Cherry L | 34 | 4 | 6 | 1 | **25** | **86** | INVESTIGATE |
| Cherry M | 30 | 2 | 1 | 4 | **31** | **119** | BUY_DEEPER |
| Candy Pink M | 36 | 2 | 1 | 4 | **37** | **128** | BUY_DEEPER |

Cherry L exchange-out rate = 6/34 = 17.6%, **display as 18%**. 4 of 6 Cherry L exchange-outs move to M → **display as 67%**. This L→M flow is the *only* directional exchange story to explicitly visualize — do not invent a full destination ledger for every other size's exchanges.

**Size depth (illustrative 1,000-unit buy):**

| Size | Initial units | Updated (fit-adjusted) units | Change |
|---|---|---|---|
| XS | 90 | 75 | -15 |
| S | 180 | 175 | -5 |
| M | 240 | **330** | **+90** |
| L | 250 | **220** | **-30** |
| XL | 130 | 105 | -25 |
| XXL | 70 | 60 | -10 |
| 3XL | 40 | 35 | -5 |
| **Total** | **1,000** | **1,000** | |

UI must explicitly display the sentence: *"This does not mean every future Understatement style should use this curve."*

**+ Opportunity (hypothetical only — M+/L+ are scenario categories, never real SKUs, never added to the 85-variant catalog):**

Current fit-adjusted M+L = 550 units. Hypothetical test capacity = 110 units (20% of M/L capacity).

| Size | Units |
|---|---|
| XS | 75 |
| S | 175 |
| M | 280 |
| M+ | 80 |
| L | 160 |
| L+ | 30 |
| XL | 105 |
| XXL | 60 |
| 3XL | 35 |
| **Total** | **1,000** |

Decision = **INVESTIGATE**, never a buy recommendation. Page must carry badge "ILLUSTRATIVE PLANNING HYPOTHESIS" and the line *"The current collaboration does not prove M+ or L+ demand."*

**Forecast-learning cohorts:**

| Cohort | Initial | Early behaviour | Planning change |
|---|---|---|---|
| 75C–75D | 55% M / 45% L | 66% M / 34% L | Increase M weighting |
| 80A–80B | 50% M / 50% L | 58% M / 42% L | Moderate M uplift |
| 80C–80D | 60% L / 40% XL | 51% L / 49% XL | Raise XL assumption |
| 85A–85B | 35% L / 65% XL | 37% L / 63% XL | No material change |
| 85C–85D | 60% XL / 40% XXL | 57% XL / 43% XXL | No material change |
| 90C–90D | 65% XXL / 35% 3XL | 62% XXL / 38% 3XL | Keep under review |

**Matching-set risks (canonical only — do not generate additional "real" set-risk stories):**

| | Top WOC | Bottom WOC | Status |
|---|---|---|---|
| Candy Pink M | 2.0 wks | 1.8 wks | SET RISK |
| Cherry M | 2.2 wks | 1.7 wks | SET RISK |

Synthetic set attach-rate assumption = 62%.

**Top-line monitoring counts (must match across every page that surfaces them):** 85 variants monitored · 6 BUY_DEEPER · 11 REPLENISH · 1 INVESTIGATE · 9 WATCH · 9 REDUCE_NEXT_BUY · 49 HOLD · **18 immediate planning actions** (= BUY_DEEPER + REPLENISH + INVESTIGATE).

---

## 8. Scenario engine — five named presets, exact outputs

Presets and the base 85-row catalog are **separate typed fixtures**. `Reset` must restore the complete base state atomically. M+/L+ must never enter the 85-row variant catalog — they only exist inside the Fuller-Cup Shift preset / + Opportunity page.

| Preset | Size curve (XS/S/M/L/XL/XXL/3XL) | Operational output |
|---|---|---|
| **Base** | 75 / 175 / 330 / 220 / 105 / 60 / 35 | 18 actions; 2 set risks; Moderate confidence |
| **M Acceleration** | 70 / 170 / 360 / 210 / 100 / 55 / 35 | M demand +10%; primary change M 330→360; 3 set risks; recommendation: protect additional M depth across top *and* matching bottom |
| **Fit Friction** | 75 / 175 / 350 / 190 / 110 / 60 / 40 | L exchange rate +5pp; L fit-adjusted demand -12%; M retained demand +6%; recommendation: reduce incremental L commitment, preserve M capacity |
| **Fuller-Cup Shift** | XS75 / S175 / M280 / M+80 / L160 / L+30 / XL105 / XXL60 / 3XL35 | 110 + test units = 20% of M/L capacity; recommendation: NOT a buy instruction, only a capacity-quantification exercise |
| **Supplier Delay** | uses base curve (no new curve supplied) | lead time +2 weeks; **26** immediate actions; **4** matching-set risks; do not invent additional euro impacts beyond what's supplied |

Scenario controls (ranges):
- Overall Demand Uplift: -20% to +40%
- M Demand Adjustment: -20% to +30%
- L Demand Adjustment: -20% to +30%
- Return Rate Adjustment: -5 to +10 pp
- Size Exchange Adjustment: -5 to +10 pp
- Lead Time Adjustment: -2 to +4 weeks
- Buy Units: 500 to 2,000
- + Migration Assumption: 0% to 30% of M/L planning capacity
- Set Attach Rate: 40% to 80%
- Launch Extension: Off/On

**Important constraint:** the document does not supply coefficients for every arbitrary slider combination. For V1: presets must work exactly as specified; explicitly-defined calculations update deterministically; reset restores Base atomically. **If you need a rule for a slider combination that isn't covered above, do not invent business logic — flag it back to me instead.**

Every scenario panel must display the literal text: **"Illustrative assumption-based scenario."**

---

## 9. Information architecture — 11 routes, build all of them

| Route | Page | Key must-haves |
|---|---|---|
| `/` | Weekly Size Curve Brief | Top metrics (85 variants / 7 size-curve changes / 2 alpha sizes changing materially / 18 variants needing action / Moderate confidence). 4 priority cards (M across alpha styles – BUY_DEEPER; Cherry L – INVESTIGATE; 75C–75D cohort – CURVE SHIFT; M matching sets – SET RISK). "What changed since last review" list of exactly 7 items. |
| `/alpha-composition` | What Is Inside an Alpha Size? | Large M visual broken into the 4 cohorts; initial-vs-early composition comparison chart; badge "ILLUSTRATIVE PLANNING COMPOSITION"; insight card on 75C–75D +7pts. |
| `/size-curve` | Alpha Size Curve Intelligence | Grouped bar/line chart, 3 series (Initial / Gross / Fit-Adjusted) across XS–3XL; M +9pts and L -3pts insight cards; confidence tooltip explaining why only Moderate. |
| `/fit-movement` | Fit Movement | Hero L→M flow visual (6 Cherry L exchange-outs, 4 move to M = 67%); Cherry L vs Cherry M side-by-side; Candy Pink M as secondary card; headline "The apparent winner changes once fit movement is included." |
| `/sku-planning` | Full SKU & Size Planning | All 85 variants, filterable (product/colour/type/size system/size/decision/matching set/risk), default sort = decision urgency, first load shows top 20 urgency-sorted, then paginate/virtualize. Variant drawer with Current Position / Launch Signal / Size-Curve Context / Matching Set / ScaleSight Analysis sections — use Cherry L as the canonical fully-worked drawer example. |
| `/size-depth` | Size Depth Planning | Initial vs Updated 1,000-unit chart; M +90/L -30 highlights; required warning sentence (verbatim, see Section 7); planning-context cards (Silhouette, Support Level, Historical Analog, Current Inventory, Launch Signal, Upcoming Commercial Events). |
| `/plus-opportunity` | Standard vs + Opportunity | Badge "ILLUSTRATIVE PLANNING HYPOTHESIS"; current vs hypothetical test curve chart; explicit "does not prove + demand" copy; Decision = INVESTIGATE. |
| `/scenario` | Scenario Planning | All controls + 5 preset buttons + Reset; every preset panel shows the "Illustrative assumption-based scenario" label. |
| `/forecast-learning` | Forecast Learning | 6-row cohort table (Section 7); hero 75C–75D example; confidence = Moderate with "why not High" explanation. |
| `/managed-intelligence` | Managed Intelligence | **This page is commercially critical — do not treat as a secondary "About" page.** 10-step managed cycle (Data Refresh → Validate → Refresh Model → Specialist Review → Prioritise → Recommend → Weekly Brief → Understatement Review → Management Decision → Monitor Outcome). "What ScaleSight handles" vs "What Understatement decides" split. No fake specialist name. Callout: "ANALYSIS MAINTAINED BY SCALESIGHT. DECISIONS MADE WITH UNDERSTATEMENT." |
| `/assumptions` | Assumptions & Customisation | 4-part data classification (Public / Synthetic / Derived / Analyst Interpretation); customisation module cards (Style×Size Planning, Standard vs + Demand, Collection Buy Planning, Matching Set Availability, Launch Learning, Replenishment Priorities, Returns/Fit Signal, Open-to-Buy); closing line: "ScaleSight should adapt to the planning problem. Understatement should not have to adapt its business to a fixed software workflow." |

Sidebar structure: **PLANNING** section (Weekly Brief, Alpha Composition, Size Curve, Fit Movement, SKU & Size Planning, Size Depth, + Opportunity, Scenario Planning, Forecast Learning) + **SCALESIGHT SERVICE** section (Managed Intelligence, Assumptions & Customisation). Footer: "Managed by ScaleSight." Header: "UNDERSTATEMENT × NATURANA" / "Size Curve Planning" / badge "Illustrative Planning Concept" / "Refreshed 30 Sep · 06:00 CEST."

For full page-by-page copy (headlines, subheadings, exact card text, CTAs), use Sections 16–26 of the attached PDF verbatim — don't paraphrase the specified strings.

---

## 10. Public-safety / data-classification rules — enforce everywhere

Keep the **ILLUSTRATIVE DATA** badge visible throughout. Never imply:
- ScaleSight has Understatement's internal data
- the sales/returns/exchanges are actual sales
- the fit-cohort composition is factual customer data
- the + opportunity has been proven
- this workspace is already deployed at Understatement

Tooltip copy to reuse verbatim: *"Product, size and catalog information is based on publicly available information. Sales, inventory, returns, exchanges, costs, forecasts, fit-cohort compositions and recommendations are synthetic assumptions created solely to demonstrate the ScaleSight planning workflow."* and *"Synthetic fit-cohort mappings are planning assumptions, not customer-facing fit guidance."*

---

## 11. QA checklist — verify before sending me the first build

**Catalog:** exactly 8 products · exactly 85 unique SKUs/barcodes · 19 Plum bra sizes (PL-BRA) · **no Plum 90E** · no scenario-only categories (M+/L+) inside the 85-row catalog.

**Derived values:** Cherry L retained = 25, index 86 · Cherry M retained = 31, index 119 · Candy Pink M retained = 37, index 128 · Cherry L exchange-out rate 18% · L→M movement 67%.

**Composition:** initial 22/27/31/20 and early 18/34/29/19 both total 100; 75C–75D change = +7pts.

**Size curves:** initial/gross/fit-adjusted each total 100; M +9pts; L -3pts.

**Depth:** all five supplied 1,000-unit curves sum to exactly 1,000; + test curve contains 110 units.

**Scenarios:** all 5 presets match the table in Section 8 exactly; Supplier Delay = 26 actions / 4 risks; Reset restores Base atomically.

**UX:** all 11 routes work; SKU table filters work; variant drawer works; first load shows top-20 urgency-sorted variants; chart labels correct; responsive on tablet/mobile.

**Safety/service:** synthetic mappings and + assumptions clearly labelled; ScaleSight specialist review visible; Understatement retains final decisions; no self-service-SaaS feeling anywhere.

### Definition-of-done self-check (ask yourself before calling it finished)
1. "Does this feel like NATURANA's demo with a different logo?" → if yes, revise.
2. "Does this feel like a generic dashboard?" → if yes, revise.
3. "Does this imply we're trying to solve customer fitting?" → if yes, revise.
4. "Does the + page imply demand has already been proven?" → if yes, revise.
5. "Can a prospect understand within two minutes why M and L shouldn't be planned on gross sales alone?" → if no, simplify.
6. "Can they see how this improves future size-depth decisions?" → if no, strengthen the merchandising narrative.
7. "Can they see why ScaleSight remains involved?" → if no, strengthen Managed Intelligence.

Target feel: **a managed merchandise and size-planning capability built around the business** — not a dashboard, not a fit quiz, not a reskinned prior demo.

---

## 12. What NOT to invent

Do not fabricate: incoming PO receipt dates, a complete exchange-destination ledger beyond the Cherry L→M story, variant-specific confidence scores beyond LOW/MODERATE/HIGH, additional euro-impact figures for the Supplier Delay preset, coefficients for unsupplied arbitrary slider combinations, a named human ScaleSight specialist, or additional "real" set-risk stories beyond Candy Pink M and Cherry M. Flag any of these back to me rather than guessing.

---

**Build order suggestion:** (1) data layer + types + CSV import + calculation lib, (2) run the QA numeric checks in Section 11 against your loaded data before building any UI, (3) AppShell/nav/routes shells, (4) Weekly Brief + SKU Planning (most data-heavy), (5) remaining narrative pages in nav order, (6) Scenario engine, (7) Managed Intelligence + Assumptions, (8) full QA pass + Definition-of-Done self-check.

Send me the first functional version before polishing small UI details — I specifically want to check: (1) does the M/L decision story become obvious quickly, (2) does it feel Understatement-specific rather than reskinned NATURANA, (3) is it clear ScaleSight manages the planning intelligence rather than handing over another dashboard.
