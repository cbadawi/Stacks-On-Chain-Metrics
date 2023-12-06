import React, { useState } from 'react';
import DropdownButton from '../DropdownButton';
import {
  CustomizableChartOptions,
  customizableChartOptions,
} from '../charts/helpers';

interface CustomizeBarChart {
  columnNames: string[];
  customizableColumnTypes: CustomizableChartOptions[];
  setCustomizableColumnTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartOptions[]>
  >;
}

const CustomizeBarChart = ({
  columnNames,
  customizableColumnTypes,
  setCustomizableColumnTypes,
}: CustomizeBarChart) => {
  const setColumnType = (
    newType: CustomizableChartOptions,
    columnIndex: number
  ) => {
    const types = [...customizableColumnTypes];
    types[columnIndex] = newType;
    setCustomizableColumnTypes(types);
  };

  // TODO axis options
  return (
    <div className='m-7 flex justify-center'>
      <div className='collapse collapse-arrow w-full rounded-lg bg-base-200 shadow-md sm:w-3/4 lg:w-9/12'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>
          Customize Bar Chart
        </div>
        <form className='collapse-content p-4'>
          <div className='flex justify-center'>
            <div className='m-4 w-1/2 bg-gray-800 py-4 text-white shadow-lg'>
              <h2 className='border-b border-gray-200 pl-2 text-xl font-medium'>
                Set Column Type
              </h2>
              <ul>
                {columnNames.map((col, index) => (
                  <li key={`column-li-${index}`} className='flex items-center'>
                    <div className='relative flex h-14 w-full items-center border-b border-gray-700'>
                      <span className='ml-2 max-w-[4rem] overflow-hidden text-lg text-gray-300'>
                        {col}
                      </span>
                      <div className='absolute left-20'>
                        <DropdownButton
                          key={`column-DropdownButton-${index}`}
                          buttonText={customizableColumnTypes[index]}
                          options={customizableChartOptions}
                          dropdownButtonIndex={index}
                          setter={setColumnType}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div className='m-4 w-1/2 bg-gray-800 py-4 text-white shadow-lg'>
              <h2 className='mb-4 border-b border-gray-200 pl-2 text-xl font-medium'>
                Set Axis
              </h2>
              <ul>
                {columnNames.map((col, index) => (
                  <li
                    key={`axis-li-${index}`}
                    className='mb-2 flex items-center'
                  >
                    <div className='flex w-full items-center border-b border-gray-700'>
                      <span className='ml-2 text-lg text-gray-300'>{col}</span>
                      <DropdownButton
                        key={`axis-DropdownButton-${index}`}
                        buttonText={customizableColumnTypes[index]}
                        options={customizableChartOptions}
                        dropdownButtonIndex={index}
                        setter={setColumnType}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>

          <button className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'>
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomizeBarChart;
