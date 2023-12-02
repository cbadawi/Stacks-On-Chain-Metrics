import React from 'react';

interface TableProps {
  data: any;
}

const Table = ({ data }: TableProps) => {
  const colNames = Object.keys(data[0]);
  // TODO if styling fails, build a table with divs similar to gamma's
  return (
    <table className='max-h-96 w-[90%] overflow-x-scroll overflow-y-scroll'>
      <thead className=' bg-[#1e2023]'>
        <th key={'#'}>#</th>
        {colNames.map((col: any) => {
          return <th key={col}>{col}</th>;
        })}
      </thead>
      <tbody>
        {data.map((row: any, index: any) => {
          return (
            <tr
              key={index}
              className='border-b border-solid border-gray-400 border-opacity-40'
            >
              <td>{index}</td>
              {colNames.map((col: any) => {
                return <td key={col}>{data[index][col]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
