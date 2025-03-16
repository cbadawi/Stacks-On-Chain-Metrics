'use client';

import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import ChartInfoDialog from './ChartInfoDialog';
import { ChartType } from '../helpers';
import type { Chart } from '@prisma/client';

type ChartHeaderProps = {
  chart: Chart;
  dashboardId: number;
  owner: string;
  isOwner: boolean;
};

const ChartHeader = ({
  chart,
  dashboardId,
  owner,
  isOwner,
}: ChartHeaderProps) => {
  if (chart.type === ChartType.NUMBER) {
    return (
      <CardHeader className='card-header absolute right-0 top-0 flex flex-row items-center justify-between px-8 py-2 pt-4'>
        <ChartInfoDialog
          chart={chart}
          dashboardId={dashboardId}
          owner={owner}
          isOwner={isOwner}
        />
      </CardHeader>
    );
  }
  return (
    <CardHeader className='card-header flex flex-row items-center justify-between px-8 py-2 pt-4'>
      <CardTitle className='card-title text-lg font-normal'>
        {chart.title}
      </CardTitle>
      <ChartInfoDialog
        chart={chart}
        dashboardId={dashboardId}
        owner={owner}
        isOwner={isOwner}
      />
    </CardHeader>
  );
};

export default ChartHeader;
