import { prettyValue } from '@/app/lib/pretty';
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

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
                const parsedValue = prettyValue(d[colName]);
                const isTooLong = parsedValue.length > 30;
                const shownValue =
                  isTooLong && colNames.length !== 1
                    ? parsedValue.slice(0, 10) + '...' + parsedValue.slice(-10)
                    : parsedValue;
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell
                          key={'td-' + colName + j}
                          className='max-w-40 overflow-hidden'
                        >
                          {colName.toLowerCase() === 'link' ? (
                            <Link
                              href={parsedValue}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 hover:underline'
                            >
                              {<LinkIcon className='h-4 w-4' />}
                            </Link>
                          ) : (
                            shownValue
                          )}
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
