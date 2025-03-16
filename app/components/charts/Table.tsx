import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { parseValue } from './parseValue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TableProps {
  data: any;
}

const TableComponent = ({ data }: TableProps) => {
  if (!data?.length) return null;
  const colNames = Object.keys(data[0]);

  return (
    <div className='max-h-[40vh] overflow-x-auto overflow-y-auto border-[1px]  sm:max-h-[50vh] lg:max-h-[60vh]'>
      <table className='h-auto w-full'>
        <TableCaption>Stacks Metrics</TableCaption>
        <TableHeader className='sticky top-0 z-10 border-b-4 border-solid border-gray-400 border-opacity-40 bg-primary-foreground'>
          <TableRow>
            {colNames.map((colName, i) => (
              <TableHead key={'th-' + colName + i}>{colName}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d: any, i: number) => (
            <TableRow key={'tr-' + i}>
              {colNames.map((colName, j) => {
                const parsedValue = parseValue(d[colName]).toString();
                const isTooLong = parsedValue.length > 30;
                const shownValue = isTooLong
                  ? parsedValue.slice(0, 10) + '...' + parsedValue.slice(-10)
                  : parsedValue;
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell
                          key={'td-' + colName + j}
                          className='max-w-40 overflow-scroll'
                        >
                          {shownValue}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>{parsedValue}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className='text-right'>$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </table>
    </div>
  );
};

export default TableComponent;
