'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { colors, generateChartConfig } from '../helpers';

export function BarChartComponent({
  data,
  errorHandler,
  height = '70vh',
}: {
  data: any[];
  height?: string | number | undefined;
  errorHandler?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const keys = Object.keys(data[0]);
  const xLabel = keys[0];
  const config = generateChartConfig(data);
  return (
    <ResponsiveContainer width='100%' height={height}>
      <ChartContainer config={config}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xLabel}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            minTickGap={50}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator='line'
                labelFormatter={(value) => String(value)}
              />
            }
          />
          {keys.slice(1).map((k, i) => (
            <Bar
              key={i}
              dataKey={k}
              fill={config[k].color}
              stackId='a'
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;
