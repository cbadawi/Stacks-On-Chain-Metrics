import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { VariableType } from '../helpers';
import { ChartType } from '@prisma/client';
import { Save } from 'lucide-react';
import { SaveToDashDialog } from './SaveToDashDialog';
import { useQuery } from '@/app/contexts/QueryContext';
import { updateChart } from '@/app/lib/db/dashboards/charts';

const SaveToDashBtn = ({
  query,
  variableDefaults,
  chartType,
}: {
  chartType: ChartType;
  variableDefaults: VariableType;
  query: string;
}) => {
  const { updateMode, chartId, chartTitle, dashboardId } = useQuery();
  console.log({ updateMode, chartId, chartTitle, dashboardId });
  if (updateMode && chartId) {
    return (
      <Button
        variant='outline'
        className='border border-orange-500'
        size={'lg'}
        onClick={async () => {
          const response = await updateChart({
            id: chartId,
            query,
            type: chartType,
          });
          if (!response.success) {
            toast.error(<p>Failed to submit the form : {response.message}</p>);
          } else {
            toast('Chart has been updated', {
              description: chartTitle,
              action: {
                label: 'Go to chart',
                onClick: () =>
                  window.open(`/dashboards/${dashboardId}`, '_blank'),
              },
            });
          }
        }}
      >
        <Save color='#6543FC' size={20} />
      </Button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size={'lg'}>
          <Save color='#6543FC' size={20} />
        </Button>
      </DialogTrigger>
      <SaveToDashDialog
        chartType={chartType}
        variableDefaults={variableDefaults}
        query={query}
      />
    </Dialog>
  );
};

export default SaveToDashBtn;
