import React from 'react';
import { Rnd } from 'react-rnd';
import { Position, PositionWithID } from '../helpers';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../Modal';
import { Chart } from '@prisma/client';

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
  baseModalId,
  titleHeaderHeightRem,
  titleHeaderPaddingRem,
  childrenHorizontalPaddingRem,
  onStopHandler,
  onMovementHandler,
  children,
}: ResizableDraggableCardProps) => {
  const titleHeight = `h-[${titleHeaderHeightRem}rem]`;
  const titlePadding = `p-[${titleHeaderPaddingRem}rem]`;
  const childPadding = `px-[${childrenHorizontalPaddingRem}rem]`;
  const chart = allCharts.find((c) => c.id == chartId);
  return (
    chart && (
      <Rnd
        bounds='parent'
        enableResizing={true}
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
        // TODO call updateContainerHeight on resize not just on resizestop
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
        className='draggable-chart flex items-center justify-center border border-gray-700 bg-[#141414]'
      >
        <div className='r-n-d mx-2 flex items-center justify-between'>
          {title && (
            <div
              className={`card-title ${titleHeight} ${titlePadding} text-lg font-normal`}
            >
              {title}
            </div>
          )}
          <FaInfoCircle
            size={16}
            color='rgb(255,255,255, 0.7)'
            onClick={() => {
              (
                document.getElementById(
                  baseModalId + title
                ) as HTMLDialogElement
              )?.showModal();
            }}
          />
        </div>
        <div className={`card-children flex ${childPadding}`}>{children}</div>
      </Rnd>
    )
  );
};

export default ResizableDraggableCard;
