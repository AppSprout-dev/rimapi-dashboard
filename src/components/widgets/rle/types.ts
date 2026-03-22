/** Types for RLE (RimWorld Learning Environment) dashboard integration. */

export interface RleAction {
  action_type: string;
  target: string | null;
  priority: number;
  reason?: string;
}

export interface RleAgentPlan {
  role: string;
  summary: string;
  confidence: number;
  num_actions: number;
  actions: RleAction[];
}

export interface RleResolvedPlan {
  role: string;
  num_actions: number;
  actions: RleAction[];
}

export interface RleExecution {
  executed: number;
  failed: number;
  total: number;
}

export interface RleScore {
  composite: number;
  metrics: Record<string, number>;
}

export interface RleTickData {
  tick: number;
  day: number;
  macro_time: number;
  phase: string;
  agents: RleAgentPlan[];
  resolved: RleResolvedPlan;
  execution: RleExecution;
  score: RleScore | null;
}

/** Display config for each RLE agent role. */
export const AGENT_DISPLAY: Record<string, { label: string; color: string }> = {
  resource_manager:     { label: 'RM', color: '#4CAF50' },
  defense_commander:    { label: 'DC', color: '#F44336' },
  research_director:    { label: 'RD', color: '#00BCD4' },
  social_overseer:      { label: 'SO', color: '#FFC107' },
  construction_planner: { label: 'CP', color: '#9E9E9E' },
  medical_officer:      { label: 'MO', color: '#E040FB' },
};

export const PHASE_COLORS: Record<string, string> = {
  exploration: '#00BCD4',
  analysis: '#FFC107',
  synthesis: '#4CAF50',
};
