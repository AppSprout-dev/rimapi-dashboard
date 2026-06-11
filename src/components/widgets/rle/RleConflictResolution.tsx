import React from 'react';
import DashboardCard from '../common/DashboardCard';
import { RleTickData, AGENT_DISPLAY } from './types';
import './RleWidgets.css';

interface Props {
  tickData: RleTickData | null;
}

const RleConflictResolution: React.FC<Props> = ({ tickData }) => {
  if (!tickData) {
    return (
      <DashboardCard title="Conflict Resolution">
        <div className="rle-empty">Waiting for tick data...</div>
      </DashboardCard>
    );
  }

  const totalProposed = tickData.agents.reduce((sum, a) => sum + a.num_actions, 0);
  const totalResolved = tickData.resolved.num_actions;
  const dropped = totalProposed - totalResolved;

  return (
    <DashboardCard title="Conflict Resolution">
      <div className="rle-conflict">
        <div className="rle-conflict-summary">
          <div className="rle-conflict-stat">
            <span className="rle-conflict-value">{totalProposed}</span>
            <span className="rle-conflict-label">proposed</span>
          </div>
          <span className="rle-conflict-arrow">â†’</span>
          <div className="rle-conflict-stat">
            <span className="rle-conflict-value">{totalResolved}</span>
            <span className="rle-conflict-label">resolved</span>
          </div>
          <span className="rle-conflict-arrow">â†’</span>
          <div className="rle-conflict-stat">
            <span className="rle-conflict-value">{tickData.execution.executed}</span>
            <span className="rle-conflict-label">executed</span>
          </div>
          {dropped > 0 && (
            <div className="rle-conflict-stat rle-conflict-dropped">
              <span className="rle-conflict-value">-{dropped}</span>
              <span className="rle-conflict-label">dropped</span>
            </div>
          )}
        </div>

        <div className="rle-conflict-agents">
          {tickData.agents.map((agent) => {
            const display = AGENT_DISPLAY[agent.role] || { label: '??', color: '#999' };
            return (
              <div key={agent.role} className="rle-conflict-agent-row">
                <span
                  className="rle-agent-badge-sm"
                  style={{ backgroundColor: display.color }}
                >
                  {display.label}
                </span>
                <div className="rle-conflict-bar-container">
                  <div
                    className="rle-conflict-bar"
                    style={{
                      width: `${Math.min(agent.num_actions * 10, 100)}%`,
                      backgroundColor: display.color,
                    }}
                  />
                </div>
                <span className="rle-conflict-count">{agent.num_actions}</span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
};

export default React.memo(RleConflictResolution);
