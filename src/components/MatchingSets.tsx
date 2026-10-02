import { matchingSetRisks } from "../data/fitSignals";
import { products } from "../data/products";
import { DecisionBadge, Panel } from "./ui";
export function MatchingSets() {
  return (
    <Panel
      title="M Matching Sets"
      eyebrow="MATCHING SET AVAILABILITY"
      aside={
        <span className="muted">62% synthetic set attach-rate assumption</span>
      }
    >
      <div className="grid-two" id="matching-sets">
        {matchingSetRisks.map((r) => (
          <div className="set-card" key={r.set}>
            <div className="card-heading">
              <h3>
                {r.set} · {r.size}
              </h3>
              <DecisionBadge decision="SET RISK" />
            </div>
            <div className="set-coverage">
              <div>
                <p>
                  {
                    products.find((p) => p.productId === r.topProductId)
                      ?.understatementProductName
                  }
                </p>
                <strong>
                  {r.topCover.toFixed(1)} <small>weeks cover · Top</small>
                </strong>
              </div>
              <span className="set-divider">↔</span>
              <div>
                <p>
                  {
                    products.find((p) => p.productId === r.bottomProductId)
                      ?.understatementProductName
                  }
                </p>
                <strong>
                  {r.bottomCover.toFixed(1)} <small>weeks cover · Bottom</small>
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="source-note">
        A stronger top size curve only creates value if the matching bottom can
        support it.
      </p>
    </Panel>
  );
}
