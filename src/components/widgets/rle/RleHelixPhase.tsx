import React from 'react';
import DashboardCard from '../common/DashboardCard';
import { RleTickData, AGENT_DISPLAY, PHASE_COLORS } from './types';
import './RleWidgets.css';

interface Props {
  tickData: RleTickData | null;
}

const PHASE_BOUNDARIES = [
  { t: 0.0, label: 'EXPLORATION', end: 0.4 },
  { t: 0.4, label: 'ANALYSIS', end: 0.7 },
  { t: 0.7, label: 'SYNTHESIS', end: 1.0 },
];

const RleHelixPhase: React.FC<Props> = ({ tickData }) => {
  if (!tickData) {
    return (
      <DashboardCard title="Helix Phase">
        <div className="rle-empty">Waiting for tick data...</div>
      </DashboardCard>
    );
  }

  const progress = tickData.macro_time;
  const phaseColor = PHASE_COLORS[tickData.phase] || '#999';

  return (
    <DashboardCard title="Helix Phase">
      <div className="rle-helix">
        <div className="rle-helix-track">
          {PHASE_BOUNDARIES.map((phase) => (
            <div
              key={phase.label}
              className={`rle-helix-phase ${tickData.phase === phase.label.toLowerCase() ? 'active' : ''}`}
              style={{
                left: `${phase.t * 100}%`,
                width: `${(phase.end - phase.t) * 100}%`,
                backgroundColor: PHASE_COLORS[phase.label.toLowerCase()] || '#333',
                opacity: tickData.phase === phase.label.toLowerCase() ? 0.3 : 0.1,
              }}
            />
          ))}

          <div
            className="rle-helix-progress"
            style={{
              left: `${progress * 100}%`,
              backgroundColor: phaseColor,
            }}
          />

          {tickData.agents.map((agent) => {
            const display = AGENT_DISPLAY[agent.role] || { label: '??', color: '#999' };
            return (
              <div
                key={agent.role}
                className="rle-helix-agent"
                style={{ left: `${progress * 100}%` }}
                title={`${agent.role}: ${Math.round(agent.confidence * 100)}%`}
              >
                <span
                  className="rle-helix-dot"
                  style={{ backgroundColor: display.color }}
                >
                  {display.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rle-helix-labels">
          {PHASE_BOUNDARIES.map((phase) => (
            <span
              key={phase.label}
              className="rle-helix-label"
              style={{
                left: `${((phase.t + phase.end) / 2) * 100}%`,
                color: PHASE_COLORS[phase.label.toLowerCase()] || '#999',
              }}
            >
              {phase.label}
            </span>
          ))}
        </div>

        <div className="rle-helix-info">
          <span className="rle-helix-phase-name" style={{ color: phaseColor }}>
            {tickData.phase.toUpperCase()}
          </span>
          <span className="rle-helix-progress-pct">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default React.memo(RleHelixPhase);
