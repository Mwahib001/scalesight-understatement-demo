import { ArrowRight, Check, ShieldCheck, Workflow } from "lucide-react";
import { PageHeading, Panel, Metric, NextLink, FitNote } from "./ui";
import { dataDisclaimer, timeline } from "../config/workspace";
import { products } from "../data/products";
import { AnalystReview } from "./AnalystReview";
const managedCycle = [
  [
    "DATA REFRESH",
    "Sales · Inventory · Returns · Exchanges · Incoming · Purchase orders · Launch events · Planning assumptions",
  ],
  [
    "VALIDATE",
    "SKU mappings · Size mappings · Missing data · Returns / exchange anomalies · Stockout distortion",
  ],
  [
    "REFRESH PLANNING MODEL",
    "Size curve · Fit composition · Retained demand · Inventory cover · Set availability · Forecast assumptions",
  ],
  [
    "SCALESIGHT SPECIALIST REVIEW",
    "Size-curve movement · Fit signals · Forecast shifts · Supply exposure · Set constraints · Working capital · Commercial context",
  ],
  ["PRIORITISE", "Which changes are large enough to alter a decision?"],
  [
    "RECOMMEND",
    "BUY DEEPER · REPLENISH · HOLD · WATCH · INVESTIGATE · REDUCE NEXT BUY",
  ],
  [
    "WEEKLY PLANNING BRIEF",
    "What changed · Why it matters · What ScaleSight recommends · What decision is required",
  ],
  ["UNDERSTATEMENT REVIEW", ""],
  ["MANAGEMENT DECISION", ""],
  ["MONITOR OUTCOME", ""],
] as const;
export function ManagedIntelligence() {
  return (
    <>
      <PageHeading
        eyebrow="MANAGED BY SCALESIGHT"
        title="A planning layer behind the size curve."
        description="ScaleSight maintains the analysis, monitors where the curve is changing and brings Understatement the decisions that deserve attention."
      />
      <div className="metrics-grid metrics-six">
        <Metric value="30 Sep" label="Data refreshed" detail="06:00 CEST" />
        <Metric value={85} label="Variants monitored" />
        <Metric value={7} label="Material changes reviewed" />
        <Metric value={4} label="Priority decisions prepared" />
        <Metric value={2} label="Matching-set risks" />
        <Metric value="5 Oct" label="Next planning review" />
      </div>
      <div className="service-callout">
        <ShieldCheck size={30} />
        <div>
          <h2>
            ANALYSIS MAINTAINED BY SCALESIGHT.
            <br />
            DECISIONS MADE WITH UNDERSTATEMENT.
          </h2>
          <p>
            The team does not need another dashboard to interpret. ScaleSight
            keeps the planning layer current and brings forward the exceptions,
            scenarios and recommendations that matter.
          </p>
        </div>
      </div>
      <Panel
        title="The managed planning cycle"
        eyebrow="ONGOING ANALYSIS · SPECIALIST REVIEW · MANAGEMENT DECISIONS"
      >
        <ol className="workflow-list">
          {managedCycle.map(([title, copy], i) => (
            <li key={title} className={i === 3 ? "specialist-step" : ""}>
              <span className="workflow-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>
                  {title}
                  {i === 3 && <ShieldCheck size={17} />}
                </h3>
                {copy && <p>{copy}</p>}
              </div>
              {i < managedCycle.length - 1 && (
                <ArrowRight className="workflow-arrow" size={18} />
              )}
            </li>
          ))}
        </ol>
      </Panel>
      <div className="grid-two">
        <Panel
          title="What ScaleSight handles"
          eyebrow="ANALYSIS & RECOMMENDATIONS"
        >
          <p>
            ScaleSight maintains the analytical layer, refreshes the size-curve
            and inventory planning logic, monitors exceptions, runs scenarios
            and interprets the operational trade-offs.
          </p>
        </Panel>
        <Panel
          title="What Understatement decides"
          eyebrow="COMMERCIAL OWNERSHIP"
        >
          <p>
            Understatement retains control of buy quantities, assortment
            structure, supplier commitments and the final commercial decisions.
          </p>
        </Panel>
      </div>
      <Panel
        title="Your ScaleSight planning specialist"
        eyebrow="HUMAN MERCHANDISE & SUPPLY-CHAIN JUDGMENT"
        className="specialist-card"
      >
        <div className="specialist-icon">
          <Workflow size={28} />
        </div>
        <p>
          A dedicated ScaleSight planning specialist reviews the analytical
          output through a merchandise and supply-chain planning lens, separates
          meaningful changes from launch noise, incorporates business context
          and prepares management-ready recommendations.
        </p>
        <p className="muted">
          Supported by ScaleSight’s data-science models and planning logic.
        </p>
      </Panel>
      <AnalystReview />
      <Panel
        title="Build the planning layer around Understatement’s actual business."
        eyebrow="FROM CONCEPT TO LIVE PLANNING"
        className="pilot-panel"
      >
        <p>
          This example uses public product structure and illustrative operating
          assumptions.
        </p>
        <p>
          A live ScaleSight engagement would connect the same planning logic to
          Understatement’s actual sales, inventory, returns, exchanges, purchase
          orders, supplier timing and commercial context - then our team would
          maintain the analysis and work with your team on the recurring
          decisions that matter.
        </p>
        <div className="pilot-links">
          <NextLink href="/assumptions#live-planning">
            Discuss an Understatement Planning Pilot
          </NextLink>
          <NextLink href="/assumptions#customisation">
            See What Could Be Customised
          </NextLink>
        </div>
      </Panel>
    </>
  );
}
const classifications = [
  {
    title: "Public Information",
    badge: "PUBLIC",
    items:
      "Products · Colours · Public prices · Sizes · Public variants · Public SKUs · Barcodes · Collaboration structure · Public sizing architecture",
  },
  {
    title: "Synthetic Demo Inputs",
    badge: "SYNTHETIC",
    items:
      "Sales · Inventory · Incoming stock · Returns · Exchanges · Fit-cohort composition · Costs · Lead times · Forecasts · Size curves · Scenario assumptions · + opportunity assumptions",
  },
  {
    title: "Derived Metrics",
    badge: "DERIVED",
    items:
      "Retained demand · Commercial demand index · Weeks cover · Fit-adjusted curve · Matching-set risk · Projected inventory · Scenario outputs · Size-depth recommendations",
  },
  {
    title: "Analyst Interpretation",
    badge: "ANALYST INTERPRETATION",
    items:
      "Why a change matters · Whether it is reliable enough · What should change in the next buy · What should remain under observation · What business context could change the recommendation",
  },
];
const customModules = [
  "Style × Size Planning",
  "Standard vs + Demand",
  "Collection Buy Planning",
  "Matching Set Availability",
  "Launch Learning",
  "Replenishment Priorities",
  "Returns / Fit Signal",
  "Open-to-Buy",
];
const customization = [
  [
    "Your Assortment",
    "Styles · Collections · Colours · Materials · Size architectures · Markets",
  ],
  [
    "Your Operating Model",
    "Suppliers · Lead times · MOQs · Warehouses · Channels · Purchase calendars",
  ],
  [
    "Your Decision Rules",
    "Target coverage · Safety stock · Buy thresholds · Replenishment rules · Launch assumptions · Markdown logic · Set relationships",
  ],
  [
    "Your Planning Cadence",
    "Weekly · Monthly · Seasonal · Launch-specific · Management reviews",
  ],
];
export function Assumptions() {
  return (
    <>
      <PageHeading
        eyebrow="TRANSPARENT BY DESIGN"
        title="What is real, what is assumed, and what a live workspace would use."
      />
      <Panel title="Data classification">
        <p>{dataDisclaimer}</p>
        <FitNote />
      </Panel>
      <div className="classification-grid">
        {classifications.map((c, i) => (
          <Panel title={c.title} key={c.title} eyebrow={c.badge}>
            <span className="classification-number">0{i + 1}</span>
            <p>{c.items}</p>
          </Panel>
        ))}
      </div>
      <Panel title="Planning timeline" eyebrow="ILLUSTRATIVE PLANNING CONCEPT">
        <dl className="detail-grid">
          <div>
            <dt>Capsule launch</dt>
            <dd>{timeline.launch}</dd>
          </div>
          <div>
            <dt>Planning week commencing</dt>
            <dd>{timeline.planningWeek}</dd>
          </div>
          <div>
            <dt>Actuals through</dt>
            <dd>{timeline.actualsThrough}</dd>
          </div>
          <div>
            <dt>Data refresh</dt>
            <dd>{timeline.refreshed}</dd>
          </div>
          <div>
            <dt>Observation window</dt>
            <dd>{timeline.observationWindow}</dd>
          </div>
          <div>
            <dt>Planning horizon</dt>
            <dd>8 weeks · Alternatives 4 / 8 / 13</dd>
          </div>
          <div>
            <dt>Next planning review</dt>
            <dd>{timeline.nextReview}</dd>
          </div>
          <div>
            <dt>Currency</dt>
            <dd>EUR</dd>
          </div>
        </dl>
      </Panel>
      <Panel
        title="Product-level operating assumptions"
        eyebrow="SYNTHETIC DEMO INPUTS"
      >
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Synthetic cost, lead time, safety stock and target cover
            </caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Colour</th>
                <th scope="col">Cost (EUR)</th>
                <th scope="col">Lead time (weeks)</th>
                <th scope="col">Safety stock (weeks)</th>
                <th scope="col">Target cover (weeks)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId}>
                  <th scope="row">{p.understatementProductName}</th>
                  <td>{p.colour}</td>
                  <td>€{p.syntheticUnitCostEUR}</td>
                  <td>{p.leadTimeWeeks}</td>
                  <td>{p.safetyStockWeeks}</td>
                  <td>{p.targetCoverWeeks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Calculation reference" eyebrow="DERIVED METRICS">
        <details className="formula-reference">
          <summary>Review the supplied calculation formulas</summary>
          <dl>
            {[
              [
                "Retained demand",
                "grossSales - returns - exchangeOut + exchangeIn",
              ],
              ["Exchange-out rate", "exchangeOut / grossSales"],
              [
                "Commercial demand index",
                "(retainedDemand / initialExpectedRetainedDemand) × 100",
              ],
              ["Weeks of cover", "onHand / forwardWeeklyDemand"],
              ["Lead-time demand", "forwardWeeklyDemand × leadTimeWeeks"],
              ["Safety stock", "forwardWeeklyDemand × safetyStockWeeks"],
              ["Required inventory", "leadTimeDemand + safetyStock"],
              [
                "Reorder gap",
                "max(0, requiredInventory - currentAvailableInventory - confirmedIncomingBeforeRequirementDate)",
              ],
              [
                "Projected inventory[t]",
                "openingInventory + cumulativeIncoming[t] - cumulativeForecastDemand[t]",
              ],
              ["Size units", "totalPlannedUnits × selectedSizeShare"],
            ].map(([label, formula]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formula}</dd>
              </div>
            ))}
          </dl>
        </details>
        <p className="source-note">
          Canonical aggregate curves are illustrative planning curves, not
          direct aggregates of the 85-row operating dataset. Incoming receipt
          dates, complete exchange destinations and arbitrary-slider
          coefficients are not supplied.
        </p>
      </Panel>
      <div id="customisation" className="customisation-heading">
        <p className="eyebrow">BEYOND THE COLLABORATION</p>
        <h2>The collaboration is only the starting point.</h2>
        <p>
          This workspace has been configured around the NATURANA collaboration
          because it creates a useful mixed-sizing planning problem.
        </p>
        <p>
          A live Understatement planning layer could be shaped around the wider
          assortment - style, colour, standard/+ sizing, launches, matching
          sets, channels, inventory locations, purchase orders and the buying
          decisions the team already makes.
        </p>
      </div>
      <div className="module-grid">
        {customModules.map((m) => (
          <div className="module-card" key={m}>
            <Check size={17} />
            <h3>{m}</h3>
          </div>
        ))}
      </div>
      <div id="live-planning" className="grid-two">
        {customization.map(([title, copy]) => (
          <Panel title={title} key={title}>
            <p>{copy}</p>
          </Panel>
        ))}
      </div>
      <div className="closing-statement">
        ScaleSight should adapt to the planning problem. Understatement should
        not have to adapt its business to a fixed software workflow.
      </div>
    </>
  );
}
