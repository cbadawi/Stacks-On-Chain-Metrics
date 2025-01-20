import React from 'react';

interface TableProps {
  data: any;
}

const parseTableData = (tableData: any) => {
  if (typeof tableData === 'boolean') return JSON.stringify(tableData);
  return tableData;
};

const Table = ({ data }: TableProps) => {
  if (!data?.length) return null;
  const colNames = Object.keys(data[0]);

  return (
    <div className='max-h-[40vh] overflow-x-auto overflow-y-auto border-[1px] sm:max-h-[40vh] lg:max-h-[45vh]'>
      <table className='h-auto w-full bg-[#0d0d0c] text-white'>
        <thead className='sticky top-0 z-10 border-b-4 border-solid border-gray-400 border-opacity-40 bg-[#0d0d0c]'>
          <tr>
            <th key={'#'} className='w-4 p-2 text-center text-lg'>
              #
            </th>
            {colNames.map((col: string, index: number) => (
              <th key={'th-' + index} className='p-2 text-center text-lg'>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-400 divide-opacity-40 text-lg'>
          {data.map((row: any, index: number) => (
            <tr
              key={index}
              className='border-b border-solid border-gray-400 border-opacity-40 text-lg hover:bg-gray-800'
            >
              <td className='p-2 text-center'>{index}</td>
              {colNames.map((col: any) => (
                <td key={col} className='p-2 text-center'>
                  {parseTableData(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
