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
  data: any[];
}

interface CustomTableCellProps {
  value: any;
  colName: string;
  isLast: boolean;
  colCount: number;
}

const CustomTableCell = ({
  value,
  colName,
  isLast,
  colCount,
}: CustomTableCellProps) => {
  const parsedValue = prettyValue(value);
  const isTooLong = parsedValue.length > 30;
  const isTooLongAndHasManyColumns = isTooLong && colCount !== 1;
  const shownValue = isTooLongAndHasManyColumns
    ? parsedValue.slice(0, 10) + '...' + parsedValue.slice(-10)
    : parsedValue;

  const borderClass = !isLast ? 'border-r border-gray-300 ' : '';

  if (colName.toLowerCase().endsWith('link')) {
    return (
      <TableCell
        className={`${borderClass} scrollbar-hide max-w-40 overflow-scroll whitespace-nowrap`}
      >
        <Link
          href={parsedValue}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          <LinkIcon className='h-4 w-4' />
        </Link>
      </TableCell>
    );
  }

  if (isTooLongAndHasManyColumns) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell
              className={`${borderClass} scrollbar-hide max-w-40 overflow-x-scroll whitespace-nowrap`}
            >
              <span className='select-none'>{shownValue}</span>
            </TableCell>
          </TooltipTrigger>
          <TooltipContent>
            <span className='select-all'>{parsedValue}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TableCell
      className={`${borderClass} scrollbar-hide max-w-40 overflow-scroll`}
    >
      {shownValue}
    </TableCell>
  );
};

const TableComponent = ({ data }: TableProps) => {
  if (!data?.length) return null;
  const colNames = Object.keys(data[0]);

  return (
    <div className='max-h-[40vh] overflow-x-auto overflow-y-auto border-[1px] sm:max-h-[50vh] lg:max-h-[60vh]'>
      <table className='h-auto w-full'>
        <TableCaption>Stacks On Chain</TableCaption>
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
              {colNames.map((colName, j) => (
                <CustomTableCell
                  key={'td-' + colName + j}
                  value={d[colName]}
                  colName={colName}
                  isLast={j === colNames.length - 1}
                  colCount={colNames.length}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
};

export default TableComponent;
