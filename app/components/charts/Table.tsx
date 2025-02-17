import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui/table';
import React from 'react';

interface TableProps {
  data: any;
}

const parseTableData = (tableData: any) => {
  if (typeof tableData === 'boolean') return JSON.stringify(tableData);
  // if (tableData.length && tableData.length > 50)
  //   return tableData.slice(0, 30) + '...';
  return (tableData || '').toString();
};

const TableComponent = ({ data }: TableProps) => {
  if (!data?.length) return null;
  const colNames = Object.keys(data[0]);

  return (
    <div className='max-h-[40vh] overflow-x-auto overflow-y-auto border-[1px]  sm:max-h-[50vh] lg:max-h-[60vh]'>
      <table className='h-auto w-full bg-[#0d0d0c] text-white'>
        <TableCaption>Stacks Metrics</TableCaption>
        <TableHeader className='sticky top-0 z-10 border-b-4 border-solid border-gray-400 border-opacity-40 bg-[#0d0d0c]'>
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
                <TableCell
                  key={'td-' + colName + j}
                  className='max-w-40 overflow-scroll'
                >
                  {parseTableData(d[colName])}
                </TableCell>
              ))}
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
