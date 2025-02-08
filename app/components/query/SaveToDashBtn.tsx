import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
import { VariableType } from '../helpers';
import { ChartType } from '@prisma/client';
import { Save } from 'lucide-react';
import { SaveToDashDialog } from './SaveToDashDialog';

const SaveToDashBtn = ({
  query,
  variableDefaults,
  chartType,
}: {
  chartType: ChartType;
  variableDefaults: VariableType[];
  query: string;
}) => {
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
