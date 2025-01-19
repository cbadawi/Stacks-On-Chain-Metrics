'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { generateChartConfig } from '../helpers';

function LineChartComponent({
  data,
  height = '70vh',
}: {
  data: any[];
  height?: string | number | undefined;
}) {
  const keys = Object.keys(data[0]);
  const xLabel = keys[0];
  const config = generateChartConfig(data);
  console.log('LineChartComponent', { data, keys });
  return (
    <ResponsiveContainer width='100%' height={height}>
      <ChartContainer config={config}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 6,
            right: 6,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xLabel}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={50}
            tickFormatter={(value: string) => value.slice(0, 3)}
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
            <Area
              key={i}
              dataKey={k}
              fill={config[k].color}
              stroke={config[k].color}
              fillOpacity={0.2}
              type='natural'
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
