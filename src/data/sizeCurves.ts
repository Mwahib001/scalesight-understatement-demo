import type { SizeDepth } from "../types";
// Canonical illustrative curves. These are deliberately independent of SKU aggregates.
export const sizeCurves = [
  { size: "XS", initial: 9, gross: 7, adjusted: 7.5 },
  { size: "S", initial: 18, gross: 17, adjusted: 17.5 },
  { size: "M", initial: 24, gross: 31, adjusted: 33 },
  { size: "L", initial: 25, gross: 26, adjusted: 22 },
  { size: "XL", initial: 13, gross: 10, adjusted: 10.5 },
  { size: "XXL", initial: 7, gross: 6, adjusted: 6 },
  { size: "3XL", initial: 4, gross: 3, adjusted: 3.5 },
] as const;
export const initialDepth: readonly SizeDepth[] = sizeCurves.map((r) => ({
  size: r.size,
  units: r.initial * 10,
}));
export const baseDepth: readonly SizeDepth[] = sizeCurves.map((r) => ({
  size: r.size,
  units: r.adjusted * 10,
}));
export const plusDepth: readonly SizeDepth[] = [
  { size: "XS", units: 75 },
  { size: "S", units: 175 },
  { size: "M", units: 280 },
  { size: "M+", units: 80 },
  { size: "L", units: 160 },
  { size: "L+", units: 30 },
  { size: "XL", units: 105 },
  { size: "XXL", units: 60 },
  { size: "3XL", units: 35 },
];
