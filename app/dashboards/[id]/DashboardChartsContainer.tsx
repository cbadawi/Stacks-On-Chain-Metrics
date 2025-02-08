'use client';

import ResizableChart from '@/app/components/dashboards/ResizableChart';
import {
  PositionWithID,
  VariableType,
  transformPositionBetweenPxAndPerc,
} from '@/app/components/helpers';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import React, { useEffect, useState } from 'react';
import { useEditMode } from './EditModeContext';

export type DashboardChartsContainerProps = {
  dashboardId: number;
  charts: ChartWithData[];
  variableValues: VariableType[];
};

const baseModalId = 'modal-id-';

const DashboardChartsCanvas = ({
  charts,
  dashboardId,
  variableValues,
}: DashboardChartsContainerProps) => {
  const [chartsPositions, setChartsPositions] = useState<PositionWithID[]>();
  const [containerHeight, setContainerHeight] = useState(1000); // arbitrary start
  const { editMode, setEditMode } = useEditMode();

  // Must set positions in use effect or else chart will render on the server which has no access to document
  useEffect(() => {
    setChartsPositions(
      charts.map((c) => ({
        id: c.id,
        width: transformPositionBetweenPxAndPerc(c.width, 'x', 'px'),
        height: transformPositionBetweenPxAndPerc(c.height, 'y', 'px'),
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
    const extraPadding = 100;
    setContainerHeight(maxBottom + extraPadding);
  };

  return (
    <div
      id='draggables-wrapper'
      className={`draggables-wrapper mx-4 min-h-[100vh] border-2 border-solid ${
        editMode ? 'border-orange-500' : 'border-transparent'
      }`}
      style={{ height: containerHeight }}
    >
      {chartsPositions &&
        charts?.map((chart, index) => {
          return (
            <ResizableChart
              dashboardId={dashboardId}
              chartsPositions={chartsPositions}
              updateChartPosition={updateChartPosition}
              updateContainerHeight={updateContainerHeight}
              variables={variableValues}
              baseModalId={baseModalId}
              key={'chart-' + index}
              chart={chart}
              editMode={editMode}
            />
          );
        })}
    </div>
  );
};

export default DashboardChartsCanvas;
