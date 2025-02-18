'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { generateChartConfig } from '../helpers';
import { labelFormatter } from '@/app/lib/pretty';

function LineChartComponent({
  data,
  height = '70vh',
  width = '70vh',
}: {
  data: any[];
  height?: string | number;
  width?: string | number;
}) {
  if (!data?.length) return null;
  const keys = Object.keys(data[0]);
  const xLabel = keys[0];
  const yLabels = keys.slice(1);
  const yValues = data.flatMap((item) => yLabels.map((label) => item[label]));
  const maxYValue = Math.max(...yValues);
  const minYValue = Math.min(...yValues);
  const config = generateChartConfig(data);
  return (
    <ResponsiveContainer width='100%' height={height}>
      <ChartContainer config={config}>
        <AreaChart
          data={data}
          margin={{
            top: 24,
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
            tickFormatter={labelFormatter}
          />
          <YAxis domain={[minYValue, maxYValue]} hide={true} />

          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator='line'
                labelFormatter={
                  (value, payload) => String(value) //+ JSON.stringify(payload)
                }
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
