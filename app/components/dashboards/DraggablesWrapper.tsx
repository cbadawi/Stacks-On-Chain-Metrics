'use client';

import React, { useEffect, useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { fetchData } from '@/app/lib/serverData';
import { stacksData2Array } from '@/app/helpers/delet';
import { ChartType } from '../charts/helpers';

export type CardProperties = { height: number; width: number };

const DraggablesWrapper = () => {
  const [data, setData] = useState([]);
  const [cardProperties, setCardProperties] = useState<CardProperties>({
    height: 400,
    width: 550,
  });

  const query = `select block_height, count(1) from transactions group by 1 order by 1 limit 50`;
  const chart: ChartType = ChartType.line;
  useEffect(() => {
    runQuery(query);
  }, []);

  const title = 'card title';
  const titleHeaderPaddingRem = 0.5;
  const titleHeaderHeightRem = 2;
  const childrenHorizontalPaddingRem = 1.5;
  const chartContainerHeight =
    cardProperties.height -
    convertRemToPixels(titleHeaderHeightRem + 2 * titleHeaderPaddingRem);
  const chartContainerWidth =
    cardProperties.width - convertRemToPixels(childrenHorizontalPaddingRem);
  const runQuery = async (query: string) => {
    const response = await fetchData(query);
    const json = stacksData2Array(response);
    setData(json);
  };

  return (
    <div className='draggables-wrapper relative h-full min-h-[100vh] w-full'>
      {/* {JSON.stringify(data)} */}
      <ResizableDraggableCard
        title={title}
        height={cardProperties.height}
        width={cardProperties.width}
        setCardProperties={setCardProperties}
        titleHeaderHeightRem={titleHeaderHeightRem}
        titleHeaderPaddingRem={titleHeaderPaddingRem}
        childrenHorizontalPaddingRem={childrenHorizontalPaddingRem}
      >
        {!!data?.length && (
          <ChartContainer
            data={data}
            chartType={chart}
            height={chartContainerHeight}
            width={chartContainerWidth}
          />
        )}
      </ResizableDraggableCard>
    </div>
  );
};

export default DraggablesWrapper;
