'use client';

import * as React from 'react';
import { Label, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import validatePieChartData from '@/app/lib/validateChartData/validatePieChartData';
import { colors, generateChartConfig } from '../helpers';
import { useTheme } from 'next-themes';

function PieChartComponent({
  data,
  errorHandler = undefined,
  height = 200,
}: {
  data: any[];
  height?: number;
  errorHandler?: (msg: string) => void;
}) {
  const { theme } = useTheme();
  if (!data?.length) return null;
  const coloredData = data.map((d, i) => ({ ...d, fill: colors[i] }));
  const keys = Object.keys(data[0]);
  const config = generateChartConfig(data);
  const validation = validatePieChartData(data);

  if (!validation.isValid && errorHandler) {
    errorHandler(validation.message);
    return;
  }

  const totalVisitors = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr[keys[1]], 0);
  }, []);

  return (
    <ResponsiveContainer width='100%' height={height}>
      <ChartContainer
        config={config}
        className='mx-auto aspect-square h-[250px]'
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={coloredData}
            dataKey={keys[1]}
            nameKey={keys[0]}
            innerRadius={height / 4}
            outerRadius={(height - 50) / 2}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor='middle'
                      dominantBaseline='middle'
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className='text-3xl font-bold'
                        fill={theme === 'dark' ? 'white' : 'black'}
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className='fill-muted-foreground'
                      >
                        {keys[1]}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
