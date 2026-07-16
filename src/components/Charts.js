'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { STAGES, STAGE_COLORS } from '@/data/dummyData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Shared chart defaults
const chartFont = {
  family: "'Inter', sans-serif",
};

const gridColor = 'rgba(255, 255, 255, 0.04)';
const tickColor = '#64748b';

export function StageChart({ leads }) {
  const stageCounts = STAGES.map(
    (stage) => leads.filter((l) => l.stage === stage).length
  );
  const stageColors = STAGES.map((s) => STAGE_COLORS[s]);

  const data = {
    labels: STAGES,
    datasets: [
      {
        data: stageCounts,
        backgroundColor: stageColors.map((c) => c + '33'),
        borderColor: stageColors,
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2235',
        titleFont: { ...chartFont, size: 12, weight: '600' },
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { ...chartFont, size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: tickColor, font: { ...chartFont, size: 11, weight: '500' } },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export function ScoreDistributionChart({ leads }) {
  const buckets = ['0-29', '30-49', '50-59', '60-69', '70-89', '90-100'];
  const ranges = [
    [0, 29],
    [30, 49],
    [50, 59],
    [60, 69],
    [70, 89],
    [90, 100],
  ];
  const counts = ranges.map(
    ([min, max]) =>
      leads.filter((l) => l.score >= min && l.score <= max).length
  );
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#22c55e', '#06d6a0'];

  const data = {
    labels: buckets,
    datasets: [
      {
        label: 'Leads',
        data: counts,
        backgroundColor: colors.map((c) => c + '44'),
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.75,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2235',
        titleFont: { ...chartFont, size: 12 },
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor, font: { ...chartFont, size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export function PriorityChart({ leads }) {
  const counts = ['high', 'medium', 'low'].map(
    (p) => leads.filter((l) => l.priority === p).length
  );
  const colors = ['#ef4444', '#f59e0b', '#6b7280'];

  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: counts,
        backgroundColor: colors.map((c) => c + '55'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function TemperatureChart({ leads }) {
  const counts = ['hot', 'warm', 'cold'].map(
    (t) => leads.filter((l) => l.temperature === t).length
  );
  const colors = ['#ef4444', '#f59e0b', '#3b82f6'];

  const data = {
    labels: ['Hot 🔥', 'Warm ☀️', 'Cold ❄️'],
    datasets: [
      {
        data: counts,
        backgroundColor: colors.map((c) => c + '55'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function CategoryChart({ leads }) {
  const cats = ['agency', 'saas', 'ecommerce', 'other'];
  const labels = ['Agency', 'SaaS', 'E-commerce', 'Other'];
  const counts = cats.map(
    (c) => leads.filter((l) => l.category === c).length
  );
  const colors = ['#8b5cf6', '#06d6a0', '#f59e0b', '#6366f1'];

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.map((c) => c + '55'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '0%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function SourceChart({ leads }) {
  const apify = leads.filter((l) => l.source === 'linkedin_apify').length;
  const manual = leads.filter((l) => l.source === 'manual').length;
  const colors = ['#22d3ee', '#a855f7'];

  const data = {
    labels: ['LinkedIn (Apify)', 'Manual'],
    datasets: [
      {
        data: [apify, manual],
        backgroundColor: colors.map((c) => c + '55'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function TimelineChart({ leads }) {
  // Group leads by creation date
  const sorted = [...leads].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const dateMap = {};
  sorted.forEach((lead) => {
    const day = new Date(lead.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
    dateMap[day] = (dateMap[day] || 0) + 1;
  });

  const labels = Object.keys(dateMap);
  const counts = Object.values(dateMap);

  // Cumulative
  const cumulative = [];
  let total = 0;
  counts.forEach((c) => {
    total += c;
    cumulative.push(total);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Cumulative Leads',
        data: cumulative,
        borderColor: '#06d6a0',
        backgroundColor: 'rgba(6, 214, 160, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#06d6a0',
        pointBorderColor: '#0a0f1e',
        pointBorderWidth: 2,
        borderWidth: 2,
      },
      {
        label: 'New Leads',
        data: counts,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#0a0f1e',
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        titleFont: { ...chartFont, size: 12 },
        bodyFont: { ...chartFont, size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor, font: { ...chartFont, size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { ...chartFont, size: 11 },
          stepSize: 2,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
