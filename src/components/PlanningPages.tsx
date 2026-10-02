import { ArrowRight, Layers, ShieldCheck } from "lucide-react";
import {
  PageHeading,
  Panel,
  Metric,
  NextLink,
  Interpretation,
  DecisionBadge,
  ConfidenceBadge,
  FitNote,
  HypothesisBadge,
} from "./ui";
import { priorities, reviewChanges } from "../data/weeklyBrief";
import { timeline, compositionDisclaimer } from "../config/workspace";
import { immediateActions } from "../data/variants";
import { fitComposition, learningCohorts } from "../data/fitComposition";
import {
  sizeCurves,
  initialDepth,
  baseDepth,
  plusDepth,
} from "../data/sizeCurves";
import { fitSignals, cherryMovement } from "../data/fitSignals";
import { calculateExchangeOutRate } from "../lib/calculations";
import { PlanningChart, CompositionChart, chartColors } from "./PlanningCharts";
import { AnalystReview } from "./AnalystReview";
import { MatchingSets } from "./MatchingSets";
export function WeeklyBrief() {
  return (
    <>
      <PageHeading
        eyebrow="UNDERSTATEMENT × NATURANA"
        title="Weekly Size Curve Brief"
        description="Which sizes are genuinely gaining demand, what fit signals are changing, and where the next buy may need more or less depth."
      />
      <div className="review-strip">
        <span>Planning week · {timeline.planningWeek}</span>
        <span>Early launch window · {timeline.observationWindow}</span>
        <span>Next review · {timeline.nextReview}</span>
      </div>
      <div className="metrics-grid">
        <Metric value={85} label="Collaboration variants monitored" />
        <Metric value={7} label="Size-curve changes under review" />
        <Metric value={2} label="Alpha sizes changing materially" />
        <Metric
          value={immediateActions}
          label="Variants needing planning action"
        />
        <Metric value="Moderate" label="Fit-cohort confidence" />
      </div>
      <div className="section-heading">
        <h2>Planning priorities</h2>
        <span className="review-label">
          <ShieldCheck size={15} />
          Reviewed by ScaleSight · Illustrative
        </span>
      </div>
      <div className="priority-grid">
        {priorities.map((p, i) => (
          <article className={`priority-card priority-${i + 1}`} key={p.title}>
            <div className="card-heading">
              <span className="eyebrow">PRIORITY {i + 1}</span>
              <DecisionBadge decision={p.badge} />
            </div>
            <h2>{p.title}</h2>
            <div className="priority-detail">
              <span className="field-label">What changed</span>
              <p>{p.changed}</p>
            </div>
            <div className="priority-detail">
              <span className="field-label">Why it matters</span>
              <p>{p.why}</p>
            </div>
            <div className="recommendation">
              <span className="field-label">Recommended action</span>
              <p>{p.action}</p>
            </div>
            <div className="priority-detail">
              <span className="field-label">Decision required</span>
              <p>{p.decision}</p>
            </div>
            <NextLink href={p.href}>{p.cta}</NextLink>
          </article>
        ))}
      </div>
      <Panel
        title="What changed since last review"
        eyebrow="UPDATED THIS PLANNING CYCLE"
      >
        <ol className="change-list">
          {reviewChanges.map((change, i) => (
            <li key={change}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {change}
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}
export function AlphaComposition() {
  return (
    <>
      <PageHeading
        eyebrow="ALPHA COMPOSITION"
        title="What is actually inside M?"
        description="Alpha sizes simplify the customer experience. For inventory planning, they can also hide several different fit cohorts inside one commercial size."
      />
      <span className="hypothesis-badge tooltip-wrap" tabIndex={0}>
        <Layers size={14} />
        ILLUSTRATIVE PLANNING COMPOSITION
        <span className="tooltip" role="tooltip">
          {compositionDisclaimer}
        </span>
      </span>
      <div className="composition-hero">
        <div className="alpha-block">
          M<small>One commercial size</small>
        </div>
        <div className="cohort-grid">
          {fitComposition.map((c) => (
            <div className="cohort-card" key={c.cohortLabel}>
              <span>
                {c.cohortLabel === "Other adjacent cohorts"
                  ? c.cohortLabel
                  : `${c.cohortLabel}-type fit`}
              </span>
              <strong>{c.currentSharePct}%</strong>
            </div>
          ))}
          <span className="cohort-total">Total: 100%</span>
        </div>
      </div>
      <Panel
        title="The composition inside M"
        eyebrow="INITIAL ASSUMPTION → EARLY ILLUSTRATIVE SIGNAL"
      >
        <CompositionChart />
        <FitNote />
      </Panel>
      <div className="insight-callout">
        <strong>
          +7 <small>percentage points</small>
        </strong>
        <p>
          The 75C-75D-type cohort is contributing 34% of M demand versus a 27%
          initial planning assumption.
        </p>
      </div>
      <Interpretation>
        The value is not assigning a customer a hidden bra size. The value is
        understanding whether the commercial mix inside M is changing enough to
        alter buying depth.
      </Interpretation>
      <NextLink href="/size-curve">See the Size Curve</NextLink>
    </>
  );
}
export function SizeCurve() {
  return (
    <>
      <PageHeading
        eyebrow="SIZE CURVE INTELLIGENCE"
        title="One size curve. Three different signals."
        description="Compare the initial planning assumption, gross launch demand and demand customers actually retain after returns and exchanges."
      />
      <Panel title="Alpha Size Curve Intelligence" aside={<ConfidenceBadge />}>
        <PlanningChart
          data={sizeCurves.map((r) => ({ ...r }))}
          series={[
            {
              key: "initial",
              label: "Initial Planning Curve",
              color: chartColors.initial,
            },
            {
              key: "gross",
              label: "Gross Launch Mix",
              color: chartColors.gross,
            },
            {
              key: "adjusted",
              label: "Fit-Adjusted Commercial Mix",
              color: chartColors.adjusted,
            },
          ]}
          unit="%"
          label="Illustrative alpha size curves, XS–3XL"
        />
        <p className="source-note">
          Illustrative planning curves; not direct mathematical aggregates of
          the 85-row operating dataset.
        </p>
      </Panel>
      <div className="grid-two">
        <div className="insight-card">
          <span className="eyebrow">M · FIT-ADJUSTED</span>
          <strong>
            24% <ArrowRight size={24} /> 33%
          </strong>
          <span className="delta">+9 pts</span>
        </div>
        <div className="insight-card purple">
          <span className="eyebrow">L · FIT-ADJUSTED</span>
          <strong>
            25% <ArrowRight size={24} /> 22%
          </strong>
          <span className="delta">-3 pts fit-adjusted</span>
        </div>
      </div>
      <Interpretation>
        L looks broadly healthy if gross demand is used. Once returns and
        exchanges are incorporated, the retained-demand signal is weaker. M
        moves in the opposite direction.
      </Interpretation>
      <NextLink href="/fit-movement">Inspect Fit Movement</NextLink>
    </>
  );
}
export function FitMovement() {
  return (
    <>
      <PageHeading
        eyebrow="RETAINED DEMAND"
        title="Where is size demand moving?"
        description="Gross sales show what was purchased first. Retained demand helps show where customers actually stay."
      />
      <div className="fit-flow">
        <span className="flow-size">
          L<small>Cherry</small>
        </span>
        <div className="flow-center">
          <span className="eyebrow">SIZE MOVEMENT</span>
          <div className="flow-arrow">
            <span />
            <ArrowRight size={26} />
          </div>
          <strong>
            4 move L → M ·{" "}
            {Math.round(
              (cherryMovement.movedToM / cherryMovement.exchangeOut) * 100,
            )}
            %
          </strong>
          <p>6 Cherry L exchange-outs</p>
        </div>
        <span className="flow-size flow-m">
          M<small>Cherry</small>
        </span>
      </div>
      <h2 className="story-headline">
        The apparent winner changes once fit movement is included.
      </h2>
      <div className="grid-two">
        {fitSignals.slice(0, 2).map((s) => (
          <FitSignalCard key={s.label} signal={s} />
        ))}
      </div>
      <Interpretation>
        L is still commercially relevant, but the current signal does not
        support deeper L inventory simply because its gross sell-through is
        highest. M is showing the stronger retained-demand signal.
      </Interpretation>
      <AnalystReview />
      <FitSignalCard signal={fitSignals[2]} />
      <NextLink href="/sku-planning">See the Inventory Implication</NextLink>
    </>
  );
}
function FitSignalCard({ signal: s }: { signal: (typeof fitSignals)[number] }) {
  return (
    <Panel
      title={s.label}
      eyebrow={
        s.productId === "CP-BRA" ? "SECONDARY SIGNAL" : "GROSS → RETAINED"
      }
      aside={<DecisionBadge decision={s.decision} />}
    >
      <dl className="signal-grid">
        <div>
          <dt>Gross</dt>
          <dd>{s.gross}</dd>
        </div>
        <div>
          <dt>Returns</dt>
          <dd>{s.returns}</dd>
        </div>
        <div>
          <dt>Exchange out</dt>
          <dd>{s.exchangeOut}</dd>
        </div>
        <div>
          <dt>Exchange in</dt>
          <dd>{s.exchangeIn}</dd>
        </div>
      </dl>
      <div className="retained-row">
        <div>
          <span className="field-label">Retained demand</span>
          <strong>{s.retained}</strong>
        </div>
        <div>
          <span className="field-label">Commercial demand index</span>
          <strong>
            {s.index}
            <small> vs plan</small>
          </strong>
        </div>
        {s.label === "Cherry L" && (
          <div>
            <span className="field-label">Exchange-out rate</span>
            <strong>
              {Math.round(
                calculateExchangeOutRate(s.exchangeOut, s.gross) * 100,
              )}
              %
            </strong>
          </div>
        )}
      </div>
    </Panel>
  );
}
export function SizeDepth() {
  return (
    <>
      <PageHeading
        eyebrow="NEXT SIZE CURVE"
        title="How deep should the next size curve be?"
        description="Turn retained demand into a practical size-depth decision without assuming one universal curve fits every style."
      />
      <Panel
        title="Initial vs updated size depth"
        eyebrow="ILLUSTRATIVE 1,000-UNIT BUY"
      >
        <PlanningChart
          data={initialDepth.map((r, i) => ({
            size: r.size,
            initial: r.units,
            adjusted: baseDepth[i].units,
          }))}
          series={[
            {
              key: "initial",
              label: "Initial Size Depth",
              color: chartColors.initial,
            },
            {
              key: "adjusted",
              label: "Updated Fit-Adjusted Size Depth",
              color: chartColors.adjusted,
            },
          ]}
          label="Initial and updated 1,000-unit buy"
        />
        <div className="chart-total">
          Initial: 1,000 units <span>Updated: 1,000 units</span>
        </div>
      </Panel>
      <div className="grid-two">
        <div className="insight-card">
          <span className="eyebrow">M · MORE DEPTH</span>
          <strong>
            240 <ArrowRight size={24} /> 330
          </strong>
          <span className="delta">+90 units</span>
        </div>
        <div className="insight-card purple">
          <span className="eyebrow">L · LESS INCREMENTAL DEPTH</span>
          <strong>
            250 <ArrowRight size={24} /> 220
          </strong>
          <span className="delta">-30 units</span>
        </div>
      </div>
      <div className="warning-line">
        This does not mean every future Understatement style should use this
        curve.
      </div>
      <Interpretation>
        Use the updated curve as one input alongside silhouette, support level,
        historical analogs, inventory position and upcoming commercial context.
      </Interpretation>
      <div className="context-grid">
        {[
          "Silhouette",
          "Support Level",
          "Historical Analog",
          "Current Inventory",
          "Launch Signal",
          "Upcoming Commercial Events",
        ].map((c, i) => (
          <div className="context-card" key={c}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{c}</h3>
          </div>
        ))}
      </div>
      <MatchingSets />
      <Panel eyebrow="NEEDS MANAGEMENT DECISION">
        <p>
          Use deeper M as the current planning direction, but preserve
          style-specific judgment rather than applying a universal curve.
        </p>
      </Panel>
      <NextLink href="/scenario">Test Another Scenario</NextLink>
    </>
  );
}
export function PlusOpportunity() {
  return (
    <>
      <PageHeading
        eyebrow="SUPPORT OPPORTUNITY"
        title="Is broad alpha demand hiding a support opportunity?"
        description="Where the fit mix inside M and L shifts toward fuller-cup cohorts, that can become a signal worth testing against Understatement’s existing + size architecture."
      />
      <HypothesisBadge />
      <div className="warning-line">
        THE CURRENT COLLABORATION DOES NOT PROVE + DEMAND.
      </div>
      <div className="metrics-grid metrics-three">
        <Metric value={550} label="Current fit-adjusted M + L units" />
        <Metric value={110} label="Hypothetical + test units" />
        <Metric value="20%" label="Of M/L planning capacity" />
      </div>
      <Panel
        title="Current standard curve vs hypothetical + test"
        eyebrow="FUTURE COMPARABLE SILHOUETTE"
      >
        <PlanningChart
          data={plusDepth.map((r) => ({
            size: r.size,
            current: baseDepth.find((b) => b.size === r.size)?.units ?? 0,
            hypothetical: r.units,
          }))}
          series={[
            {
              key: "current",
              label: "Current Standard Curve",
              color: chartColors.initial,
            },
            {
              key: "hypothetical",
              label: "Hypothetical Standard/+ Test Curve",
              color: chartColors.gross,
            },
          ]}
          label="Current and hypothetical 1,000-unit buy"
        />
        <div className="chart-total">
          Current: 1,000 units <span>Hypothetical test: 1,000 units</span>
        </div>
        <p className="source-note">
          M+ / L+ are scenario categories only, not current collaboration SKUs.
        </p>
      </Panel>
      <Interpretation>
        The current collaboration does not prove M+ or L+ demand. This scenario
        simply shows how a growing fuller-cup signal inside standard M/L demand
        could be quantified before committing a future assortment.
      </Interpretation>
      <Panel
        title="Management question"
        aside={<DecisionBadge decision="INVESTIGATE" />}
      >
        <p>
          Is the signal strong enough to justify test capacity in + sizing for a
          future comparable silhouette?
        </p>
      </Panel>
      <FitNote />
      <NextLink href="/scenario">Stress-Test the Hypothesis</NextLink>
    </>
  );
}
export function ForecastLearning() {
  return (
    <>
      <PageHeading
        eyebrow="LAUNCH LEARNING"
        title="Every launch teaches the next size curve."
        description="The value is not the first translation. The value is continuously updating the commercial curve as retained demand becomes clearer."
      />
      <div className="learning-hero">
        <div>
          <span className="eyebrow">75C-75D · HERO EXAMPLE</span>
          <h2>Increase M weighting</h2>
        </div>
        <div className="learning-shift">
          <span>
            55% M / 45% L<small>Initial Planning Weight</small>
          </span>
          <ArrowRight size={26} />
          <span>
            66% M / 34% L<small>Early Illustrative Behaviour</small>
          </span>
        </div>
      </div>
      <Panel title="Cohort learning" aside={<ConfidenceBadge />}>
        <div className="table-scroll">
          <table className="learning-table">
            <caption className="sr-only">
              Synthetic forecast-learning cohorts
            </caption>
            <thead>
              <tr>
                <th scope="col">Historical Cohort</th>
                <th scope="col">Initial Planning Weight</th>
                <th scope="col">Early Illustrative Behaviour</th>
                <th scope="col">Planning Change</th>
              </tr>
            </thead>
            <tbody>
              {learningCohorts.map((c) => (
                <tr key={c.cohort}>
                  <th scope="row">{c.cohort}</th>
                  <td>{c.initial}</td>
                  <td>{c.early}</td>
                  <td>{c.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <FitNote />
      </Panel>
      <Interpretation>
        The value is not the initial translation itself. The value is
        continuously updating the commercial size curve as retained demand
        becomes clearer - and carrying that learning into future comparable
        silhouettes.
      </Interpretation>
      <Panel title="Why not High?" aside={<ConfidenceBadge />}>
        <p>
          Short launch window, limited observations in tail sizes and continuing
          exchange behaviour.
        </p>
      </Panel>
    </>
  );
}
