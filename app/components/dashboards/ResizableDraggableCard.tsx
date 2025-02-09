import React from 'react';
import { Rnd } from 'react-rnd';
import { Position, PositionWithID } from '../helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditMode } from '@/app/dashboards/[id]/EditModeContext';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Button } from '@/components/ui/button';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { deleteChart } from '@/app/lib/db/dashboards/charts';

type ResizableDraggableCardProps = {
  chartId: number;
  dashboardId: number;
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
  query: string;
  children?: React.ReactNode;
};

const ResizableDraggableCard = ({
  chartId,
  dashboardId,
  allCharts,
  title,
  query,
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
      <Card className='card h-auto w-96 border border-gray-700'>
        <CardHeader className='card-header flex flex-row items-center justify-between px-8'>
          <CardTitle className='card-title text-lg font-normal'>
            {title}
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Info
                size={16}
                color='rgb(255,255,255, 0.7)'
                className='chartinfo hover:cursor-pointer'
              />
            </DialogTrigger>

            {/* Increase the dialog content width by changing max-w-* */}
            <DialogContent className='dialog-content sm:max-w-4xl'>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {/* <DialogDescription>
            Chart description
          </DialogDescription> */}
              </DialogHeader>

              {/* Wrap the SyntaxHighlighter to allow horizontal scrolling */}
              <div key={'chart-info-' + title} className='my-4 overflow-x-auto'>
                {/* If you want a fixed inner width, you can use min-w instead of w */}
                <div className='min-w-[900px]'>
                  <SyntaxHighlighter language='sql' style={dracula}>
                    {query}
                  </SyntaxHighlighter>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <Button variant='outline' aria-disabled={true} disabled={true}>
                  Edit Chart
                </Button>
                <DialogClose asChild>
                  <Button
                    variant='destructive'
                    disabled={true}
                    aria-disabled={true}
                    onClick={() => deleteChart({ id: chartId, dashboardId })}
                  >
                    Delete Chart
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        {children}
      </Card>
    </Rnd>
  );
};

export default ResizableDraggableCard;
