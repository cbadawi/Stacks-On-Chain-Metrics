import React from 'react';

interface TableProps {
  data: any;
}

const parseTableData = (tableData: any) => {
  if (typeof tableData === 'boolean') return JSON.stringify(tableData);
  return tableData;
};

// TODO add pagination button
const Table = ({ data }: TableProps) => {
  if (!data?.length) return null;
  const colNames = Object.keys(data[0]);
  // TODO if styling fails, build a table with divs similar to gamma's
  return (
    <div className='max-h-[90vh] max-w-[90%] overflow-x-scroll'>
      <table className='h-auto w-auto'>
        <thead className=' bg-[#0d0d0c]'>
          <tr>
            <th key={'#'} className='p-2 text-center text-lg'>
              #
            </th>
            {colNames.map((col: string, index: number) => {
              return (
                <th key={'th-' + index} className='p-2 text-center text-lg'>
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-400  divide-opacity-40  text-lg'>
          {data.map((row: any, index: any) => {
            return (
              <tr
                key={index}
                className='border-b border-solid border-gray-400 border-opacity-40  text-lg hover:bg-gray-800'
              >
                <td className='p-2 text-center'>{index}</td>
                {colNames.map((col: any) => {
                  return (
                    <td key={col} className='p-2 text-center'>
                      {parseTableData(data[index][col])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
