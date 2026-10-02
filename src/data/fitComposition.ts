import type { FitComposition } from "../types";
export const fitComposition: readonly FitComposition[] = [
  {
    alphaSize: "M",
    cohortLabel: "75A-75B",
    initialSharePct: 22,
    currentSharePct: 18,
    confidence: "MODERATE",
    synthetic: true,
  },
  {
    alphaSize: "M",
    cohortLabel: "75C-75D",
    initialSharePct: 27,
    currentSharePct: 34,
    confidence: "MODERATE",
    synthetic: true,
  },
  {
    alphaSize: "M",
    cohortLabel: "80A-80B",
    initialSharePct: 31,
    currentSharePct: 29,
    confidence: "MODERATE",
    synthetic: true,
  },
  {
    alphaSize: "M",
    cohortLabel: "Other adjacent cohorts",
    initialSharePct: 20,
    currentSharePct: 19,
    confidence: "MODERATE",
    synthetic: true,
  },
];
export const learningCohorts = [
  {
    cohort: "75C-75D",
    initial: "55% M / 45% L",
    early: "66% M / 34% L",
    change: "Increase M weighting",
  },
  {
    cohort: "80A-80B",
    initial: "50% M / 50% L",
    early: "58% M / 42% L",
    change: "Moderate M uplift",
  },
  {
    cohort: "80C-80D",
    initial: "60% L / 40% XL",
    early: "51% L / 49% XL",
    change: "Raise XL assumption",
  },
  {
    cohort: "85A-85B",
    initial: "35% L / 65% XL",
    early: "37% L / 63% XL",
    change: "No material change",
  },
  {
    cohort: "85C-85D",
    initial: "60% XL / 40% XXL",
    early: "57% XL / 43% XXL",
    change: "No material change",
  },
  {
    cohort: "90C-90D",
    initial: "65% XXL / 35% 3XL",
    early: "62% XXL / 38% 3XL",
    change: "Keep under review",
  },
] as const;
