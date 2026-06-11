import React from 'react';
import DashboardCard from '../common/DashboardCard';
import { RleTickData, AGENT_DISPLAY, PHASE_COLORS } from './types';
import './RleWidgets.css';

interface Props {
  tickData: RleTickData | null;
}

const RleAgentStatusPanel: React.FC<Props> = ({ tickData }) => {
  if (!tickData) {
    return (
      <DashboardCard title="Agent Status">
        <div className="rle-empty">Waiting for tick data...</div>
      </DashboardCard>
    );
  }

  const avgConfidence = tickData.agents.length > 0
    ? tickData.agents.reduce((sum, a) => sum + a.confidence, 0) / tickData.agents.length
    : 0;

  return (
    <DashboardCard title="Agent Status">
      <div className="rle-status-panel">
        {tickData.agents.map((agent) => {
          const display = AGENT_DISPLAY[agent.role] || { label: '??', color: '#999' };
          const confPct = Math.round(agent.confidence * 100);
          return (
            <div key={agent.role} className="rle-status-row">
              <span
                className="rle-agent-badge"
                style={{ backgroundColor: display.color }}
              >
                {display.label}
              </span>
              <div className="rle-status-info">
                <div className="rle-status-name">
                  {agent.role.replace(/_/g, ' ')}
                </div>
                <div className="rle-status-bar-track">
                  <div
                    className="rle-status-bar-fill"
                    style={{
                      width: `${confPct}%`,
                      backgroundColor: display.color,
                    }}
                  />
                </div>
              </div>
              <span className="rle-status-conf">{confPct}%</span>
              <span className="rle-status-actions">{agent.num_actions} act</span>
            </div>
          );
        })}

        <div className="rle-status-footer">
          <div className="rle-status-team">
            <span>Team Confidence</span>
            <div className="rle-status-bar-track rle-team-bar">
              <div
                className="rle-status-bar-fill"
                style={{
                  width: `${Math.round(avgConfidence * 100)}%`,
                  backgroundColor: PHASE_COLORS[tickData.phase] || '#4CAF50',
                }}
              />
            </div>
            <span className="rle-status-conf">{Math.round(avgConfidence * 100)}%</span>
          </div>
          {tickData.score && (
            <div className="rle-status-score">
              Score: <strong>{tickData.score.composite.toFixed(3)}</strong>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default React.memo(RleAgentStatusPanel);
