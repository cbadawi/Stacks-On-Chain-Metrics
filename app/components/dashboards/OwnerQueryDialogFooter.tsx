'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { deleteChart } from '@/app/lib/db/dashboards/charts';
import { QueryContextParams } from '@/app/contexts/QueryContext';

type OwnerQueryDialogFooterProps = {
  isOwner: boolean;
  dashboardId: number;
  chart: {
    id: number;
    query: string;
    type: string;
    title: string;
  };
  owner: string;
};

const OwnerQueryDialogFooter = ({
  isOwner,
  dashboardId,
  chart,
  owner,
}: OwnerQueryDialogFooterProps) => {
  if (!isOwner) return null;

  return (
    <div className='my-5 flex items-center justify-between'>
      <Link
        href={{
          pathname: '/query',
          query: {
            dashboardId,
            query: chart.query,
            updateMode: true,
            chartId: chart.id,
            chartType: chart.type,
            chartTitle: chart.title,
          } as QueryContextParams,
        }}
      >
        <Button variant='outline'>Edit Chart</Button>
      </Link>
      <DialogClose asChild>
        <Button
          variant='destructive'
          onClick={async () => {
            const res = await deleteChart({
              id: chart.id,
              dashboardId,
              owner,
            });
            console.log({ deletechartres: res });
          }}
        >
          Delete Chart
        </Button>
      </DialogClose>
    </div>
  );
};

export default OwnerQueryDialogFooter;
