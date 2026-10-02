"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { variants, monitoringCounts, immediateActions } from "../data/variants";
import { products } from "../data/products";
import { sizeCurves } from "../data/sizeCurves";
import { fitSignals } from "../data/fitSignals";
import {
  derivedPosition,
  calculateCommercialDemandIndex,
  calculateSetRisk,
} from "../lib/calculations";
import {
  decisionLabels,
  decisionUrgency,
  fitDisclaimer,
} from "../config/workspace";
import type { Variant } from "../types";
import {
  DecisionBadge,
  Metric,
  PageHeading,
  Panel,
  ConfidenceBadge,
  IllustrativeDataBadge,
} from "./ui";
import { MatchingSets } from "./MatchingSets";
import { AnalystReview } from "./AnalystReview";
type Filters = {
  product: string;
  colour: string;
  type: string;
  system: string;
  size: string;
  decision: string;
  set: string;
  risk: string;
};
const emptyFilters: Filters = {
  product: "",
  colour: "",
  type: "",
  system: "",
  size: "",
  decision: "",
  set: "",
  risk: "",
};
const systemLabels = {
  BAND_CUP: "Band + cup",
  EU_NUMERIC: "EU numeric",
  ALPHA: "Alpha",
};
export function VariantPlanning() {
  const [{ filters, page }, setQuery] = useState({
    filters: emptyFilters,
    page: 0,
  });
  const [selected, setSelected] = useState<Variant | null>(null);
  const filtered = useMemo(
    () =>
      variants
        .filter(
          (v) =>
            (!filters.product || v.productId === filters.product) &&
            (!filters.colour || v.colour === filters.colour) &&
            (!filters.type || v.productType === filters.type) &&
            (!filters.system || v.sizeSystem === filters.system) &&
            (!filters.size || v.size === filters.size) &&
            (!filters.decision ||
              v.analystRecommendation === filters.decision) &&
            (!filters.set || v.matchingSetId === filters.set) &&
            (!filters.risk ||
              (filters.risk === "set"
                ? calculateSetRisk(v)
                : filters.risk === "fit"
                  ? v.analystRecommendation === "INVESTIGATE"
                  : !calculateSetRisk(v) &&
                    v.analystRecommendation !== "INVESTIGATE")),
        )
        .sort(
          (a, b) =>
            decisionUrgency[a.analystRecommendation] -
              decisionUrgency[b.analystRecommendation] ||
            a.publicSku.localeCompare(b.publicSku),
        ),
    [filters],
  );
  const rows = filtered.slice(page * 20, page * 20 + 20);
  const setFilter = (key: keyof Filters, value: string) =>
    setQuery({ filters: { ...filters, [key]: value }, page: 0 });
  const filterFields: {
    key: keyof Filters;
    label: string;
    options: { value: string; label: string }[];
  }[] = [
    {
      key: "product",
      label: "Product",
      options: products.map((p) => ({
        value: p.productId,
        label: `${p.understatementProductName} · ${p.colour}`,
      })),
    },
    {
      key: "colour",
      label: "Colour",
      options: [...new Set(products.map((p) => p.colour))].map((value) => ({
        value,
        label: value,
      })),
    },
    {
      key: "type",
      label: "Product Type",
      options: ["Top", "Bottom"].map((value) => ({ value, label: value })),
    },
    {
      key: "system",
      label: "Size System",
      options: Object.entries(systemLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "size",
      label: "Size",
      options: [...new Set(variants.map((v) => v.size))].map((value) => ({
        value,
        label: value,
      })),
    },
    {
      key: "decision",
      label: "Decision",
      options: Object.entries(decisionLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "set",
      label: "Matching Set",
      options: [...new Set(products.map((p) => p.matchingSetId))].map(
        (value) => ({ value, label: value }),
      ),
    },
    {
      key: "risk",
      label: "Risk",
      options: [
        { value: "set", label: "Set risk" },
        { value: "fit", label: "Fit investigation" },
        { value: "none", label: "No reviewed risk" },
      ],
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="FULL ASSORTMENT PLANNING"
        title="SKU & Size Planning"
        description="Monitor the full style × size structure without treating every signal as equally important."
      />
      <div className="metrics-grid">
        <Metric value={85} label="Variants" />
        <Metric value={immediateActions} label="Immediate actions" />
        <Metric value={monitoringCounts.WATCH} label="Watch" />
        <Metric
          value={monitoringCounts.REDUCE_NEXT_BUY}
          label="Reduce Next Buy"
        />
        <Metric value={monitoringCounts.HOLD} label="Hold" />
      </div>
      <div className="decision-summary">
        {Object.entries(monitoringCounts).map(([decision, count]) => (
          <span key={decision}>
            {count} {decisionLabels[decision as keyof typeof decisionLabels]}
          </span>
        ))}
      </div>
      <Panel
        title="Full style × size structure"
        aside={<span className="muted">Base catalog · Decision urgency</span>}
      >
        <div className="filter-grid">
          {filterFields.map((field) => (
            <label key={field.key} htmlFor={`filter-${field.key}`}>
              <span id={`filter-label-${field.key}`}>{field.label}</span>
              <select
                id={`filter-${field.key}`}
                aria-labelledby={`filter-label-${field.key}`}
                value={filters[field.key]}
                onChange={(e) => setFilter(field.key, e.target.value)}
              >
                <option value="">All</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="table-toolbar">
          <span aria-live="polite">
            {filtered.length} of 85 variants ·{" "}
            {filtered.length
              ? `${page * 20 + 1}–${Math.min((page + 1) * 20, filtered.length)}`
              : "0"}{" "}
            shown
          </span>
          <button
            className="secondary-button"
            onClick={() => setQuery({ filters: emptyFilters, page: 0 })}
          >
            Reset filters
          </button>
        </div>
        <div className="table-scroll variant-table-wrapper">
          <table className="variant-table">
            <caption className="sr-only">
              85-variant operating dataset, sorted by decision urgency
            </caption>
            <thead>
              <tr>
                {[
                  "Product",
                  "Colour",
                  "Size",
                  "Public SKU",
                  "Gross Demand",
                  "Retained Demand",
                  "On Hand",
                  "Incoming",
                  "Forecast / Week",
                  "Weeks Cover",
                  "Fit Signal",
                  "Set Status",
                  "Decision",
                  "Confidence",
                ].map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => {
                const d = derivedPosition(v);
                return (
                  <tr key={v.demoVariantId} onClick={() => setSelected(v)}>
                    <th scope="row">
                      <button
                        className="variant-button"
                        onClick={(event) => {
                          event.currentTarget.querySelector("button")?.focus();
                          setSelected(v);
                        }}
                        aria-label={`Review ${v.understatementProductName}, ${v.colour}, ${v.size}`}
                      >
                        {v.understatementProductName}
                        <small>
                          {v.productType} · {systemLabels[v.sizeSystem]}
                        </small>
                      </button>
                    </th>
                    <td>{v.colour}</td>
                    <td className="size-cell">{v.size}</td>
                    <td className="sku-cell">{v.publicSku}</td>
                    <td>{v.grossLaunchSales}</td>
                    <td className="retained-cell">{d.retainedDemand}</td>
                    <td>{v.onHand}</td>
                    <td>{v.incoming}</td>
                    <td>{v.forecastWeeklyUnits}</td>
                    <td>{v.sourceWeeksOfCover.toFixed(1)}</td>
                    <td>
                      {v.analystRecommendation === "INVESTIGATE" ? (
                        <span className="fit-risk">18% exchange-out</span>
                      ) : (
                        `${Math.round(d.exchangeOutRate * 100)}% exchange-out`
                      )}
                    </td>
                    <td>
                      {d.setRisk ? <DecisionBadge decision="SET RISK" /> : "—"}
                    </td>
                    <td>
                      <DecisionBadge decision={v.analystRecommendation} />
                    </td>
                    <td>Moderate</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="empty-state">No variants match these filters.</p>
          )}
        </div>
        <div className="pagination">
          <span>
            Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / 20))}
          </span>
          <div>
            <button
              className="secondary-button"
              disabled={page === 0}
              onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              className="secondary-button"
              disabled={(page + 1) * 20 >= filtered.length}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="source-note">
          <Info size={14} />
          Supplied weeks-cover values and final decisions are preserved. Select
          a product to review its position and planning context.
        </p>
      </Panel>
      <MatchingSets />
      {selected && (
        <VariantDrawer variant={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
function DetailGrid({ items }: { items: [string, string | number][] }) {
  return (
    <dl className="detail-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function VariantDrawer({
  variant: v,
  onClose,
}: {
  variant: Variant;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      document.body.style.overflow = oldOverflow;
      trigger?.focus();
    };
  }, []);
  const d = derivedPosition(v);
  const cherryL = v.productId === "CH-BRA" && v.size === "L";
  const curve = sizeCurves.find((r) => r.size === v.size);
  const signal = fitSignals.find(
    (s) => s.productId === v.productId && s.size === v.size,
  );
  const matching = variants.find(
    (m) => m.demoVariantId === v.matchingVariantId,
  );
  const matchingProduct = products.find(
    (p) =>
      p.matchingSetId === v.matchingSetId && p.productType !== v.productType,
  );
  return (
    <dialog
      ref={ref}
      className="variant-drawer"
      aria-labelledby="variant-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const b = ref.current?.getBoundingClientRect();
          if (
            b &&
            (e.clientX < b.left ||
              e.clientX > b.right ||
              e.clientY < b.top ||
              e.clientY > b.bottom)
          )
            ref.current?.close();
        }
      }}
    >
      <div className="drawer-header">
        <div>
          <span className="eyebrow">VARIANT PLANNING REVIEW</span>
          <h2 id="variant-title">{v.understatementProductName}</h2>
          <p>
            {v.colour} · {v.size}
          </p>
          <div className="drawer-disclosure">
            <IllustrativeDataBadge />
          </div>
        </div>
        <button
          autoFocus
          className="icon-button"
          aria-label="Close variant detail"
          onClick={() => ref.current?.close()}
        >
          <X size={22} />
        </button>
      </div>
      <div className="drawer-body">
        <div className="drawer-status">
          <DecisionBadge decision={v.analystRecommendation} />
          <ConfidenceBadge />
        </div>
        <Panel title="Current Position">
          <DetailGrid
            items={[
              ["On Hand", v.onHand],
              ["Incoming", v.incoming],
              ["Forward Demand", `${v.forecastWeeklyUnits} / week`],
              ["Weeks Cover", `${v.sourceWeeksOfCover.toFixed(1)} weeks`],
              ["Lead Time", `${v.leadTimeWeeks} weeks`],
              ["Target Cover", `${v.targetCoverWeeks} weeks`],
              ["Lead-Time Demand", d.leadTimeDemand],
              ["Safety Stock", d.safetyStock],
            ]}
          />
          <p className="source-note">
            Incoming receipt dates are not supplied. Reorder gaps and
            receipt-based projections require confirmed timing.
          </p>
        </Panel>
        <Panel title="Launch Signal">
          <DetailGrid
            items={[
              ["Gross Sales", v.grossLaunchSales],
              ["Returns", v.returns],
              ["Exchange Out", v.exchangeOut],
              ["Exchange In", v.exchangeIn],
              ["Retained Demand", d.retainedDemand],
              ["Exchange-Out Rate", `${Math.round(d.exchangeOutRate * 100)}%`],
              ...(signal
                ? [
                    [
                      "Commercial Demand Index",
                      `${Math.round(calculateCommercialDemandIndex(d.retainedDemand, signal.initialExpectedRetainedDemand) ?? 0)} vs plan`,
                    ] as [string, string],
                  ]
                : []),
            ]}
          />
        </Panel>
        <Panel title="Size-Curve Context">
          <DetailGrid
            items={[
              [
                "Initial Size Expectation",
                curve
                  ? `${curve.initial}% illustrative alpha curve`
                  : "Variant-specific expectation not supplied",
              ],
              [
                "Current Commercial Signal",
                curve
                  ? `${curve.adjusted}% fit-adjusted illustrative curve`
                  : `${d.retainedDemand} retained units`,
              ],
              ["Confidence", "Moderate"],
            ]}
          />
          <div className="drawer-copy">
            <span className="field-label">Fit-Cohort Context</span>
            <p>
              {v.size === "M"
                ? "75C-75D-type cohort: 34% of M demand versus 27% initial planning assumption."
                : cherryL
                  ? "4 of 6 Cherry L exchange-outs move into M."
                  : "No variant-specific cohort composition supplied."}
            </p>
            <p className="source-note">{fitDisclaimer}</p>
          </div>
        </Panel>
        <Panel title="Matching Set">
          <DetailGrid
            items={[
              [
                "Matching Product",
                matchingProduct?.understatementProductName ?? "Not supplied",
              ],
              [
                "Matching Size",
                matching?.size ?? "Cross-system mapping not supplied",
              ],
              [
                "Matching Coverage",
                matching
                  ? `${matching.sourceWeeksOfCover.toFixed(1)} weeks`
                  : "Not supplied",
              ],
              [
                "Set Risk",
                d.setRisk ? "SET RISK" : "No canonical set-risk story supplied",
              ],
            ]}
          />
        </Panel>
        <Panel title="ScaleSight Analysis" eyebrow="ANALYST INTERPRETATION">
          <p>
            {cherryL
              ? "Cherry L has the strongest gross launch sales in the style, but six customers have exchanged out of the size and four moved into M. The retained-demand signal is therefore materially weaker than gross sell-through suggests."
              : signal
                ? `${signal.label}: ${signal.retained} retained units; commercial demand index ${signal.index} vs plan.`
                : "The supplied operating dataset provides the reviewed decision. Variant-specific expected demand and additional analyst context are not supplied."}
          </p>
        </Panel>
        {cherryL && <AnalystReview />}
        <Panel
          title="Recommended Decision"
          aside={<DecisionBadge decision={v.analystRecommendation} />}
        >
          {cherryL && (
            <>
              <p>
                Hold additional L commitment for one review cycle. Do not reduce
                existing availability, but do not use gross sales alone to
                justify a deeper next buy.
              </p>
              <div className="drawer-copy">
                <span className="field-label">Decision required</span>
                <p>Review again after another week of retained-demand data.</p>
              </div>
            </>
          )}
          {!cherryL && (
            <p>Understatement retains the final commercial decision.</p>
          )}
        </Panel>
        <Panel title="Assumptions">
          <p>
            Sales, inventory, returns, exchanges, costs and forecasts are
            synthetic planning assumptions. All current demo confidence is
            Moderate.
          </p>
        </Panel>
        <details className="metadata">
          <summary>Public variant metadata</summary>
          <DetailGrid
            items={[
              ["Public SKU", v.publicSku],
              ["Barcode", v.barcode],
              ["Public Price", `€${v.understatementPublicPriceEUR.toFixed(2)}`],
              ["NATURANA name", v.naturanaProductName],
              [
                "NATURANA public SKU",
                v.naturanaPublicSku ?? "Not publicly recorded",
              ],
              [
                "NATURANA public price",
                `€${v.naturanaPublicPriceEUR.toFixed(2)}`,
              ],
            ]}
          />
        </details>
      </div>
    </dialog>
  );
}
