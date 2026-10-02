import { readFileSync, writeFileSync } from "node:fs";
// The supplied CSV remains the operating source of truth. Preserve every row,
// source-derived value and decision; only parse numeric columns for the fixture.
const source = readFileSync(
  new URL("../files/understatement-85-variant-dataset.csv", import.meta.url),
  "utf8",
);
const [header, ...lines] = source.trim().split(/\r?\n/);
const fields = header.split(",");
const strings = new Set([
  "productId",
  "colour",
  "size",
  "publicSku",
  "barcode",
  "decision",
]);
const rows = lines.map((line) =>
  Object.fromEntries(
    line
      .split(",")
      .map((value, index) => [
        fields[index],
        strings.has(fields[index]) ? value : Number(value),
      ]),
  ),
);
if (
  rows.length !== 85 ||
  new Set(rows.map((r) => r.publicSku)).size !== 85 ||
  new Set(rows.map((r) => r.barcode)).size !== 85
)
  throw new Error("Expected 85 unique catalog rows");
if (
  new Set(rows.map((r) => r.productId)).size !== 8 ||
  rows.filter((r) => r.productId === "PL-BRA").length !== 19
)
  throw new Error("Expected eight products and 19 Plum bra sizes");
if (
  rows.some(
    (r) =>
      (r.productId === "PL-BRA" && r.size === "90E") || r.size.includes("+"),
  )
)
  throw new Error(
    "The catalog must not contain Plum 90E or hypothetical + categories",
  );
if (
  rows.some((r) =>
    fields.some(
      (field) =>
        !(field in r) || (!strings.has(field) && !Number.isFinite(r[field])),
    ),
  )
)
  throw new Error("Invalid operating dataset row");
writeFileSync(
  new URL("../src/data/operatingRows.ts", import.meta.url),
  '// Generated verbatim from files/understatement-85-variant-dataset.csv. Run pnpm data:import.\nimport type { OperatingRow } from "../types";\nexport const operatingRows: readonly OperatingRow[] = ' +
    JSON.stringify(rows, null, 2) +
    ";\n",
);
