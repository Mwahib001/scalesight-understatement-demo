import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  HelpCircle,
  Info,
  Minus,
  Search,
  TriangleAlert,
} from "lucide-react";
import type { DecisionAction } from "../types";
import {
  confidenceExplanation,
  decisionLabels,
  fitDisclaimer,
  dataDisclaimer,
} from "../config/workspace";
export function IllustrativeDataBadge() {
  return (
    <span className="tooltip-wrap data-badge" tabIndex={0}>
      <FlaskConical size={14} />
      ILLUSTRATIVE DATA
      <span className="tooltip" role="tooltip">
        {dataDisclaimer}
      </span>
    </span>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
  );
}
export function Panel({
  title,
  eyebrow,
  children,
  className = "",
  aside,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || eyebrow) && (
        <div className="panel-heading">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
export function DecisionBadge({
  decision,
}: {
  decision: DecisionAction | "SET RISK" | "CURVE SHIFT";
}) {
  const Icon =
    decision === "BUY_DEEPER"
      ? ArrowUpRight
      : decision === "HOLD"
        ? Minus
        : decision === "INVESTIGATE"
          ? Search
          : decision === "CURVE SHIFT"
            ? ArrowRight
            : decision === "REPLENISH"
              ? Check
              : TriangleAlert;
  return (
    <span
      className={`status status-${decision.toLowerCase().replaceAll(" ", "_")}`}
    >
      <Icon size={13} />
      {decision in decisionLabels
        ? decisionLabels[decision as DecisionAction]
        : decision}
    </span>
  );
}
export function ConfidenceBadge() {
  return (
    <span className="tooltip-wrap" tabIndex={0}>
      <span className="confidence">
        <HelpCircle size={14} />
        Moderate confidence
      </span>
      <span className="tooltip" role="tooltip">
        {confidenceExplanation}
      </span>
    </span>
  );
}
export function Metric({
  value,
  label,
  detail,
}: {
  value: string | number;
  label: string;
  detail?: string;
}) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function NextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
export function Interpretation({ children }: { children: React.ReactNode }) {
  return (
    <div className="interpretation">
      <Info size={19} />
      <div>
        <span className="eyebrow">SCALESIGHT INTERPRETATION</span>
        <p>{children}</p>
      </div>
    </div>
  );
}
export function FitNote() {
  return (
    <p className="source-note">
      <Info size={14} />
      {fitDisclaimer}
    </p>
  );
}
export function HypothesisBadge() {
  return (
    <span className="hypothesis-badge">
      <Info size={14} />
      ILLUSTRATIVE PLANNING HYPOTHESIS
    </span>
  );
}
