import { useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { colors } from './helpers';

export interface PieChartProps {
  data: any[];
  height: number;
  width: number;
  xName: string;
  yName: string;
}

export default function PieChart({
  data,
  xName,
  yName,
  height = 400,
  width = 600,
}: PieChartProps) {
  const [active, setActive] = useState({} as any);
  const outerRadius = width / 3.5;
  const innerRadius = width / 4;

  return (
    <Group top={height / 2} left={width / 2}>
      <Pie
        data={data}
        pieValue={(data) => data[yName]}
        outerRadius={outerRadius}
        innerRadius={({ data }) => {
          const activeSize = active && active[xName] == data[xName] ? 20 : 0;
          return innerRadius + activeSize;
        }}
        padAngle={0.01}
      >
        {(pie) => {
          return pie.arcs.map((arc, index) => {
            const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.2;
            const [centroidX, centroidY] = pie.path.centroid(arc);
            return (
              <g
                key={arc.data[xName]}
                onMouseEnter={() => setActive(arc.data)}
                onMouseLeave={() => setActive(false)}
              >
                <path d={pie.path(arc)!} fill={colors[index]}></path>
                {hasSpaceForLabel && (
                  <text
                    fill='white'
                    x={centroidX}
                    y={centroidY}
                    dy={centroidY > 0 ? '2em' : '-2em'}
                    dx={centroidX > 0 ? '2em' : '-2em'}
                    fontSize={22}
                    className='text-lg font-bold'
                    pointerEvents='none'
                  >
                    {arc.data[xName]}
                  </text>
                )}
              </g>
            );
          });
        }}
      </Pie>

      {active && Object.keys(active).length ? (
        <>
          <Text textAnchor='middle' fill='#fff' fontSize={40} dy={-20}>
            {active[yName]}
          </Text>

          <Text textAnchor='middle' fill={'white'} fontSize={20} dy={20}>
            {`${active[xName]}`}
          </Text>
        </>
      ) : (
        <>
          <Text textAnchor='middle' fill='#fff' fontSize={40} dy={-20}>
            {`Total : ${Math.floor(
              data.reduce((acc, d) => acc + d[yName], 0)
            )}`}
          </Text>
          {/* <Text textAnchor='middle' fill='#aaa' fontSize={20} dy={20}>
                  {`Over ${data.length} `}
                </Text> */}
        </>
      )}
    </Group>
  );
}
