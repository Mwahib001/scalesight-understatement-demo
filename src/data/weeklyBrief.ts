import type { DecisionAction } from "../types";
export const priorities: readonly {
  title: string;
  badge: DecisionAction | "CURVE SHIFT" | "SET RISK";
  changed: string;
  why: string;
  action: string;
  decision: string;
  cta: string;
  href: string;
}[] = [
  {
    title: "M · Across Alpha Styles",
    badge: "BUY_DEEPER",
    changed:
      "Fit-adjusted M demand is running 9 percentage points above the initial planning curve.",
    why: "M is receiving both stronger direct demand and net size movement from L.",
    action: "Increase M weighting in the next comparable alpha-size buy.",
    decision:
      "Approve deeper M planning while continuing to monitor whether the shift holds across another planning cycle.",
    cta: "Review M Demand",
    href: "/size-curve",
  },
  {
    title: "Cherry · L",
    badge: "INVESTIGATE",
    changed:
      "L has the strongest gross sales in the Cherry balconette, but its retained-demand signal is materially weaker after returns and exchanges.",
    why: "Gross L sales are 34 units, but retained demand is only 25. Four of six exchange-outs move into M.",
    action:
      "Do not deepen L solely on gross sell-through. Maintain current availability and review another cycle of retained demand.",
    decision: "Hold incremental L depth.",
    cta: "Review Fit Movement",
    href: "/fit-movement",
  },
  {
    title: "75C-75D Fit Cohort",
    badge: "CURVE SHIFT",
    changed:
      "The initial planning translation expected 55% of this cohort in M and 45% in L. Early behaviour is running at 66% M / 34% L.",
    why: "The change is large enough to alter the commercial size curve for future comparable silhouettes.",
    action: "Increase M weighting in the next planning cycle.",
    decision: "Approve revised M/L planning weights.",
    cta: "Review Cohort Learning",
    href: "/forecast-learning",
  },
  {
    title: "M Matching Sets",
    badge: "SET RISK",
    changed:
      "Candy Pink M and Cherry M briefs have less current cover than their matching tops.",
    why: "A stronger M top curve cannot convert fully if matching bottoms become constrained first.",
    action: "Plan top and bottom depth together when increasing M.",
    decision: "Protect M set availability in the next allocation.",
    cta: "Review Set Coverage",
    href: "/sku-planning#matching-sets",
  },
];
export const reviewChanges = [
  "M fit-adjusted share moved to 33% versus 24% initial plan.",
  "Cherry M became stronger than Cherry L on retained demand.",
  "Cherry L exchange-out rate reached 18%.",
  "75C-75D behaviour moved toward M.",
  "Candy Pink M brief cover fell to 1.8 weeks.",
  "Cherry M brief cover fell to 1.7 weeks.",
  "Two matching sets now require coordinated M planning.",
] as const;
