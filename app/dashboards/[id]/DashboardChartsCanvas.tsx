'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditMode } from '../../contexts/EditModeContext';
import ResizableChart from '@/app/components/dashboards/ResizableChart';
import dynamic from 'next/dynamic';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card } from '@/components/ui/card';
import { updateChart } from '@/app/lib/db/dashboards/charts';
import { Layout } from 'react-grid-layout';
import { toast } from 'sonner';
import { ChartType } from '@/app/components/helpers';
import type { Chart, Dashboard } from '@prisma/client';

const GridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });

export type DashboardChartsCanvasProps = {
  dashboardId: number;
  charts: Chart[];
  owner: string;
  variableValues: Record<string, string>;
};

const GRID_UNIT_PX = 50;

const DashboardChartsCanvas = ({
  owner,
  charts,
  dashboardId,
  variableValues,
}: DashboardChartsCanvasProps) => {
  const { editMode } = useEditMode();
  const [layout, setLayout] = useState<Layout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.getBoundingClientRect().width;
        setContainerWidth(newWidth);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    const newLayout = charts.map((chart) => ({
      minW: chart.type === ChartType.NUMBER ? 5 : 8,
      minH: chart.type === ChartType.NUMBER ? 2 : 5,
      i: chart.id.toString(),
      x: Math.floor(chart.x / GRID_UNIT_PX),
      y: Math.floor(chart.y / GRID_UNIT_PX),
      w: Math.ceil(chart.width / GRID_UNIT_PX) || 4,
      h: Math.ceil(chart.height / GRID_UNIT_PX) || 4,
    })) as Layout[];
    setLayout(newLayout);
  }, [charts]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    // Layout is changed on screen resize etc. so we only want to persist changes in edit mode
    if (!editMode) return;
    newLayout.forEach(async (item) => {
      const resp = await updateChart({
        id: parseInt(item.i),
        x: item.x * GRID_UNIT_PX,
        y: item.y * GRID_UNIT_PX,
        width: item.w * GRID_UNIT_PX,
        height: item.h * GRID_UNIT_PX,
      });
      if (!resp.success) toast.error(resp.message);
    });
  };

  return (
    <div
      ref={containerRef}
      className={`draggables-wrapper min-h-[100vh] w-full border-2 border-solid ${
        editMode ? 'border-orange-500' : 'border-transparent'
      }`}
    >
      {containerWidth > 0 && (
        <GridLayout
          className='layout'
          style={{ cursor: editMode ? 'move' : 'default' }}
          layout={layout}
          cols={Math.floor(containerWidth / GRID_UNIT_PX)}
          rowHeight={GRID_UNIT_PX}
          width={containerWidth}
          onLayoutChange={onLayoutChange}
          isDraggable={editMode}
          isResizable={editMode}
          resizeHandles={['se']}
          // TODO gave up on figuring out how to customize resize handle. increment this. hours spent: 3
          // resizeHandle={(resizeHanldle: string) => (
          //   <CustomResizeHandle resizeHandle={resizeHanldle} />
          // )}
          draggableHandle='.resizable-chart-wrapper'
        >
          {charts.map((chart) => {
            const layoutItem = layout.find(
              (item) => item.i === chart.id.toString()
            );

            const cellWidth =
              (layoutItem ? layoutItem.w * GRID_UNIT_PX : 400) - 30;
            const cellHeight =
              (layoutItem ? layoutItem.h * GRID_UNIT_PX : 300) - 30;
            return (
              <Card
                key={chart.id.toString()}
                className='card resizable-chart-wrapper grid-item card relative mb-36 h-auto w-auto border border-gray-700 shadow-none'
              >
                <ResizableChart
                  dashboardId={dashboardId}
                  chart={chart}
                  owner={owner}
                  variables={variableValues}
                  editMode={editMode}
                  width={cellWidth}
                  height={cellHeight}
                />
              </Card>
            );
          })}
        </GridLayout>
      )}
    </div>
  );
};

export default DashboardChartsCanvas;
