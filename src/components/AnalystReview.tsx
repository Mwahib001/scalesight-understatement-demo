import { Panel, DecisionBadge } from "./ui";
export function AnalystReview() {
  return (
    <Panel
      title="Cherry L · ScaleSight specialist review"
      eyebrow="DATA → BUSINESS CONTEXT → PLANNING JUDGMENT"
      className="analyst-panel"
    >
      <div className="judgment-grid">
        <div>
          <span className="step-label">01 · DATA</span>
          <h3>34 gross sales</h3>
          <p>Highest gross sales in the style</p>
          <span className="field-label">Model-only view</span>
          <DecisionBadge decision="BUY_DEEPER" />
        </div>
        <div>
          <span className="step-label">02 · BUSINESS CONTEXT</span>
          <h3>25 retained · M retains 31</h3>
          <p>4 returns · 6 exchange-outs · 4 move into M · 1 exchange-in</p>
        </div>
        <div>
          <span className="step-label">03 · PLANNING JUDGMENT</span>
          <DecisionBadge decision="INVESTIGATE" />
          <p>
            Gross sell-through is being distorted by size movement. Hold
            incremental L commitment until another planning cycle confirms the
            retained-demand signal.
          </p>
        </div>
      </div>
    </Panel>
  );
}
