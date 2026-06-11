import React from 'react';
import DashboardCard from '../common/DashboardCard';
import { RleTickData, AGENT_DISPLAY } from './types';
import './RleWidgets.css';

interface Props {
  tickData: RleTickData | null;
}

const RleAgentDecisionLog: React.FC<Props> = ({ tickData }) => {
  if (!tickData) {
    return (
      <DashboardCard title="Agent Decisions">
        <div className="rle-empty">Waiting for tick data...</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={`Agent Decisions — Tick ${tickData.tick} (Day ${tickData.day})`}>
      <div className="rle-agent-log">
        {tickData.agents.map((agent) => {
          const display = AGENT_DISPLAY[agent.role] || { label: '??', color: '#999' };
          return (
            <div key={agent.role} className="rle-agent-card">
              <div className="rle-agent-header">
                <span
                  className="rle-agent-badge"
                  style={{ backgroundColor: display.color }}
                >
                  {display.label}
                </span>
                <span className="rle-agent-role">{agent.role.replace(/_/g, ' ')}</span>
                <span className="rle-agent-confidence">
                  {Math.round(agent.confidence * 100)}%
                </span>
              </div>
              <div className="rle-agent-summary">{agent.summary}</div>
              <div className="rle-agent-actions">
                {agent.actions.map((action, i) => (
                  <div key={i} className="rle-action-item">
                    <span className="rle-action-type">{action.action_type}</span>
                    {action.target && (
                      <span className="rle-action-target">â†’ {action.target}</span>
                    )}
                    <span className="rle-action-priority">P{action.priority}</span>
                  </div>
                ))}
                {agent.actions.length === 0 && (
                  <div className="rle-no-actions">no actions</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default React.memo(RleAgentDecisionLog);
