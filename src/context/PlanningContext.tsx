"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { baseScenario, scenarioPresets } from "../data/scenarioPresets";
import { applyScenario } from "../lib/scenario";
import type { ScenarioMode, ScenarioState } from "../types";
type PlanningContextValue = {
  state: ScenarioState;
  horizon: 4 | 8 | 13;
  output: ReturnType<typeof applyScenario>;
  update: (patch: Partial<ScenarioState>) => void;
  selectPreset: (mode: ScenarioMode) => void;
  reset: () => void;
  setHorizon: (horizon: 4 | 8 | 13) => void;
};
const PlanningContext = createContext<PlanningContextValue | null>(null);
export function PlanningProvider({ children }: { children: React.ReactNode }) {
  const [planning, setPlanning] = useState<{
    state: ScenarioState;
    horizon: 4 | 8 | 13;
  }>({ state: { ...baseScenario }, horizon: 8 });
  const value = useMemo(
    () => ({
      ...planning,
      output: applyScenario(planning.state),
      update: (patch: Partial<ScenarioState>) =>
        setPlanning((p) => ({ ...p, state: { ...p.state, ...patch } })),
      selectPreset: (mode: ScenarioMode) =>
        setPlanning((p) => ({
          ...p,
          state: { ...scenarioPresets[mode].controls },
        })),
      reset: () => setPlanning({ state: { ...baseScenario }, horizon: 8 }),
      setHorizon: (horizon: 4 | 8 | 13) =>
        setPlanning((p) => ({ ...p, horizon })),
    }),
    [planning],
  );
  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
}
export function usePlanning() {
  const value = useContext(PlanningContext);
  if (!value) throw new Error("PlanningProvider required");
  return value;
}
