import React from 'react';
import { Rnd } from 'react-rnd';
import { Position, PositionWithID } from '../helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditMode } from '@/app/dashboards/[id]/EditModeContext';
import { Info } from 'lucide-react';

type ResizableDraggableCardProps = {
  chartId: number;
  title: string;
  allCharts: PositionWithID[];
  baseModalId: string;
  titleHeaderHeightRem: number;
  titleHeaderPaddingRem: number;
  childrenHorizontalPaddingRem: number;
  onStopHandler: (position: Position, allCharts: PositionWithID[]) => void;
  onMovementHandler: (
    position: PositionWithID,
    allCharts: PositionWithID[]
  ) => void;
  children?: React.ReactNode;
};

const ResizableDraggableCard = ({
  chartId,
  allCharts,
  title,
  onStopHandler,
  onMovementHandler,
  children,
}: ResizableDraggableCardProps) => {
  const { editMode } = useEditMode();
  const chart = allCharts.find((c) => c.id == chartId);
  if (!chart) return null;
  return (
    <Rnd
      bounds='parent'
      enableUserSelectHack={false}
      enableResizing={editMode}
      disableDragging={!editMode}
      minHeight={150}
      minWidth={150}
      dragGrid={[50, 50]} // increments
      size={{ ...chart }} // height & width
      position={{ ...chart }} // x & y
      onDragStop={(e, d) => {
        const newPos = { ...chart, x: d.x, y: d.y };
        onStopHandler(newPos, allCharts);
      }}
      onDrag={(e, d) => {
        const newPos = { ...chart, x: d.x, y: d.y };
        onMovementHandler(newPos, allCharts);
      }}
      onResize={(e, direction, ref, delta, position) => {
        const height = parseInt(ref.style.height.replace('px', ''));
        const width = parseInt(ref.style.width.replace('px', ''));
        const resizedPos = { ...chart, height, width };
        onMovementHandler(resizedPos, allCharts);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newPos = {
          x: chart.x,
          y: chart.y,
          height: parseInt(ref.style.height.replace('px', '')),
          width: parseInt(ref.style.width.replace('px', '')),
        };
        onStopHandler(newPos, allCharts);
      }}
      className='draggable-chart m-5 flex items-center justify-center'
    >
      <Card className='card h-auto w-auto border border-gray-700'>
        <CardHeader className='card-header flex flex-row items-center justify-between px-8'>
          <CardTitle className='card-title text-lg font-normal'>
            {title}
          </CardTitle>
          <Info
            size={16}
            color='rgb(255,255,255, 0.7)'
            className='hover:cursor-pointer'
            onClick={() => {
              // (
              //   document.getElementById(baseModalId + title) as HTMLDialogElement
              // )?.showModal();
            }}
          />
        </CardHeader>
        {children}
      </Card>
    </Rnd>
  );
};

export default ResizableDraggableCard;
