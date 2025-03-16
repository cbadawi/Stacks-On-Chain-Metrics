'use client';

import React from 'react';
import { Info } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import OwnerQueryDialogFooter from './OwnerQueryDialogFooter';
import { Chart } from '@prisma/client';

type ChartInfoDialogProps = {
  chart: Chart;
  dashboardId: number;
  owner: string;
  isOwner: boolean;
};

const ChartInfoDialog = ({
  chart,
  dashboardId,
  owner,
  isOwner,
}: ChartInfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Info size={16} className='chartinfo hover:cursor-pointer' />
      </DialogTrigger>

      <DialogContent className='dialog-content max-h-[80%] sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{chart.title}</DialogTitle>
        </DialogHeader>

        <div className='grid h-full max-h-[65vh] grid-rows-[1fr,auto]'>
          <div className='overflow-hidden'>
            <SyntaxHighlighter
              language='sql'
              style={dracula}
              customStyle={{
                height: '100%',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                margin: 0,
              }}
            >
              {chart.query}
            </SyntaxHighlighter>
          </div>

          <OwnerQueryDialogFooter
            isOwner={isOwner}
            dashboardId={dashboardId}
            chart={chart}
            owner={owner}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartInfoDialog;
