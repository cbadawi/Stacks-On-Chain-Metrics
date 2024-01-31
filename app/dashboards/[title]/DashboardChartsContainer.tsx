'use client';

import ResizableChart from '@/app/components/dashboards/ResizableChart';
import {
  PositionWithID,
  VariableType,
  transformPositionBetweenPxAndPerc,
} from '@/app/components/helpers';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import React, { useEffect, useState } from 'react';

export type DashboardChartsContainerProps = {
  charts: ChartWithData[];
  variableValues: VariableType[];
};

const baseModalId = 'modal-id-';

const DashboardChartsContainer = ({
  charts,
  variableValues,
}: DashboardChartsContainerProps) => {
  const [chartPositions, setChartPositions] = useState<PositionWithID[]>();

  // Must set positions in use effect or else chart will render on the server which has no access to document
  useEffect(() => {
    const positions = charts.map(({ x, y, id, height, width }) => ({
      x,
      y,
      id,
      height,
      width,
    }));
    setChartPositions(
      positions.map((c) => ({
        ...c,
        x: transformPositionBetweenPxAndPerc(c.x, 'x', 'px'),
        y: transformPositionBetweenPxAndPerc(c.y, 'y', 'px'),
      }))
    );
  }, []);

  return (
    <div
      id='draggables-wrapper'
      className='draggables-wrapper h-full border-2 border-solid border-red-900 '
    >
      {chartPositions &&
        charts?.map((chart, index) => {
          return (
            <ResizableChart
              chartPositions={chartPositions}
              setChartPositions={setChartPositions}
              variables={variableValues}
              baseModalId={baseModalId}
              key={'chart-' + index}
              chart={chart}
            />
          );
        })}
    </div>
  );
};

export default DashboardChartsContainer;
