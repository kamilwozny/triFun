'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { WeeklyData } from '@/actions/profileStats';
import { useTranslation } from 'react-i18next';

interface ActivityChartProps {
  data: WeeklyData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const hasData = data.some((w) => w.total > 0);
  const { t } = useTranslation();

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-40 text-base-content/40 text-sm">
        {t('noFourWeeksActivity')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-base-content/10"
        />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--b1))',
            border: '1px solid hsl(var(--b3))',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar
          dataKey="Bike"
          stackId="a"
          fill="#22c55e"
          name="Cycling"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Run"
          stackId="a"
          fill="#ef4444"
          name="Running"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Swim"
          stackId="a"
          fill="#3b82f6"
          name="Swimming"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Other"
          stackId="a"
          fill="#a855f7"
          name="Other"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
