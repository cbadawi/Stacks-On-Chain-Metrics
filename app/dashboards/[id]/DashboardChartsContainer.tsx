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

const DashboardChartsCanvas = ({
  charts,
  variableValues,
}: DashboardChartsContainerProps) => {
  const [chartsPositions, setChartsPositions] = useState<PositionWithID[]>();
  const [containerHeight, setContainerHeight] = useState(1000); // arbitrary start

  // Must set positions in use effect or else chart will render on the server which has no access to document
  useEffect(() => {
    setChartsPositions(
      charts.map((c) => ({
        id: c.id,
        width: c.width,
        height: c.height,
        x: transformPositionBetweenPxAndPerc(c.x, 'x', 'px'),
        y: transformPositionBetweenPxAndPerc(c.y, 'y', 'px'),
      }))
    );
    updateContainerHeight(charts);
  }, []);

  const updateChartPosition = (id: number, newPos: PositionWithID) => {
    setChartsPositions((prev = []) => {
      const updatedPositions = prev.map((p) => (p.id === id ? newPos : p));
      return updatedPositions;
    });
  };

  const updateContainerHeight = (positions: PositionWithID[]) => {
    const maxBottom = positions.reduce(
      (max, p) => Math.max(max, p.y + p.height),
      0
    );
    console.log('!!!! updateContainerHeight ' + maxBottom);
    const extraPadding = 100;
    setContainerHeight(maxBottom + extraPadding);
  };

  return (
    <>
      <div className='absolute left-0 top-0 z-50 bg-gray-900 p-2 text-white'>
        {JSON.stringify({
          chart: charts.map((c) => c.type),
          chartsPositions: chartsPositions?.find((c) => c.id == 11),
        })}
      </div>
      <div
        id='draggables-wrapper'
        className='draggables-wrapper min-h-[100vh] border-2 border-solid  border-blue-900'
        style={{ height: containerHeight }}
      >
        {chartsPositions &&
          charts?.map((chart, index) => {
            return (
              <>
                <ResizableChart
                  chartsPositions={chartsPositions}
                  updateChartPosition={updateChartPosition}
                  updateContainerHeight={updateContainerHeight}
                  variables={variableValues}
                  baseModalId={baseModalId}
                  key={'chart-' + index}
                  chart={chart}
                />
              </>
            );
          })}
      </div>
    </>
  );
};

export default DashboardChartsCanvas;
