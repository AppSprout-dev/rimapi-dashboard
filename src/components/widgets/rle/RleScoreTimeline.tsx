import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import DashboardCard from '../common/DashboardCard';
import { RleScore } from './types';
import './RleWidgets.css';

Chart.register(...registerables);

interface Props {
  scoreHistory: RleScore[];
}

const METRIC_COLORS: Record<string, string> = {
  survival: '#4CAF50',
  threat_response: '#F44336',
  mood: '#FFC107',
  food_security: '#8BC34A',
  wealth: '#FF9800',
  research: '#00BCD4',
  self_sufficiency: '#9C27B0',
  efficiency: '#607D8B',
};

const RleScoreTimeline: React.FC<Props> = ({ scoreHistory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || scoreHistory.length === 0) return;
    if (!canvas.isConnected) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = scoreHistory.map((_, i) => `${i + 1}`);
    const metrics = Object.keys(scoreHistory[0]?.metrics || {});

    const datasets = [
      {
        label: 'Composite',
        data: scoreHistory.map((s) => s.composite),
        borderColor: '#FFFFFF',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.3,
      },
      ...metrics.map((metric) => ({
        label: metric.replace(/_/g, ' '),
        data: scoreHistory.map((s) => s.metrics[metric] || 0),
        borderColor: METRIC_COLORS[metric] || '#999',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.3,
      })),
    ];

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          y: { min: 0, max: 1, ticks: { color: '#aaa' }, grid: { color: '#333' } },
          x: { title: { display: true, text: 'Tick', color: '#aaa' }, ticks: { color: '#aaa' }, grid: { color: '#333' } },
        },
        plugins: {
          legend: { position: 'bottom', labels: { color: '#ccc', boxWidth: 12, font: { size: 10 } } },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [scoreHistory]);

  return (
    <DashboardCard title="Score Timeline">
      <div className="rle-chart-container">
        {scoreHistory.length === 0 ? (
          <div className="rle-empty">Waiting for scores...</div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </DashboardCard>
  );
};

export default RleScoreTimeline;
