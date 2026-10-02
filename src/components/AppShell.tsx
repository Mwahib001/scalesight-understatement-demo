"use client";

import { CalendlyLink } from "./CalendlyLink";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  FileText,
  FlaskConical,
  Layers,
  Menu,
  Package,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { PlanningProvider, usePlanning } from "../context/PlanningContext";
import { IllustrativeDataBadge } from "./ui";
export const navigation = [
  ["/", "Weekly Brief", FileText],
  ["/alpha-composition", "Alpha Composition", Users],
  ["/size-curve", "Size Curve", ChartNoAxesCombined],
  ["/fit-movement", "Fit Movement", Activity],
  ["/sku-planning", "SKU & Size Planning", Layers],
  ["/size-depth", "Size Depth", Package],
  ["/plus-opportunity", "+ Opportunity", Plus],
  ["/scenario", "Scenario Planning", Settings2],
  ["/forecast-learning", "Forecast Learning", BookOpen],
  ["/managed-intelligence", "Managed Intelligence", Workflow],
  ["/assumptions", "Assumptions & Customisation", ShieldCheck],
] as const;
function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const { state, output, reset } = usePlanning();
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 851px)");
    const closeMobileMenu = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener("change", closeMobileMenu);
    return () => desktop.removeEventListener("change", closeMobileMenu);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab") {
        const elements = Array.from(
          sidebar.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        ).filter((el) => el.offsetParent !== null);
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [menu]);
  const scenarioActive = state.mode !== "BASE" || !output.isExactPreset;
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {menu && <div className="nav-backdrop" onClick={() => setMenu(false)} />}
      <aside
        id="workspace-navigation"
        ref={sidebar}
        className={`sidebar ${menu ? "is-open" : ""}`}
        role={menu ? "dialog" : undefined}
        aria-modal={menu || undefined}
        aria-label="Workspace navigation"
      >
        <Link className="brand" href="/" onClick={() => setMenu(false)}>
          <Image
            src="/logos/scalesight white primary logo.svg"
            alt="ScaleSight"
            width={180}
            height={62}
            priority
          />
          <small>MANAGED PLANNING INTELLIGENCE</small>
        </Link>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X size={22} />
        </button>
        <div className="client-context">
          <span className="client-mark">U.</span>
          <div>
            <strong>Understatement</strong>
            <small>Size curve planning</small>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          {navigation.map(([href, label, Icon], i) => (
            <div key={href}>
              {(i === 0 || i === 9) && (
                <p className="nav-label">
                  {i === 0 ? "PLANNING" : "SCALESIGHT SERVICE"}
                </p>
              )}
              <Link
                href={href}
                className={path === href ? "active" : ""}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <ShieldCheck size={18} />
          <p>
            Managed by ScaleSight.
            <small>
              Analysis maintained.
              <br />
              Decisions made together.
            </small>
          </p>
        </div>
      </aside>
      <div className="workspace" inert={menu}>
        <header className="topbar">
          <button
            className="menu-toggle icon-button"
            aria-label="Open navigation"
            aria-controls="workspace-navigation"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
          <div className="workspace-title">
            <strong>UNDERSTATEMENT × NATURANA</strong>
            <span>Size Curve Planning</span>
          </div>
          <div className="topbar-right">
            <span className="concept-badge">Illustrative Planning Concept</span>
            <span className="refresh">Refreshed 30 Sep · 06:00 CEST</span>
            <IllustrativeDataBadge />
            <CalendlyLink>Book a call</CalendlyLink>
          </div>
        </header>
        <main id="main-content">
          {scenarioActive && (
            <div className="scenario-banner">
              <FlaskConical size={16} />
              <div>
                <strong>
                  {output.preset.label} ·{" "}
                  {output.isExactPreset
                    ? "supplied preset"
                    : "edited assumptions"}
                </strong>
                <span>Illustrative assumption-based scenario.</span>
              </div>
              <button onClick={reset}>Reset to Base Plan</button>
            </div>
          )}
          {children}
          <footer className="page-footer">
            <span>Managed by ScaleSight.</span>
            <CalendlyLink>Contact</CalendlyLink>
            <Link href="/assumptions">
              Assumptions & Customisation <ArrowRight size={13} />
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PlanningProvider>
      <Shell>{children}</Shell>
    </PlanningProvider>
  );
}
