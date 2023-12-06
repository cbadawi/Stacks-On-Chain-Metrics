import React, { useState } from 'react';
import DropdownButton from '../DropdownButton';
import {
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  customizableChartOptions,
} from '../charts/helpers';
import SetCustomization from './SetCustomization';

interface CustomizeBarChart {
  columnNames: string[];
  customizableColumnTypes: CustomizableChartOptions[];
  setCustomizableColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartOptions[]>
  >;
  customizableAxesTypes: LeftRight[];
  setCustomizableAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
}

const CustomizeBarChart = ({
  columnNames,
  customizableColumnTypes,
  setCustomizableColumnsTypes,
  customizableAxesTypes,
  setCustomizableAxesTypes,
}: CustomizeBarChart) => {
  //
  const setColumnType = (
    newType: CustomizableChartOptions,
    columnIndex: number
  ) => {
    const types = [...customizableColumnTypes];
    types[columnIndex] = ChartType[newType] as unknown as ChartType;
    setCustomizableColumnsTypes(types);
  };

  const setAxesType = (
    newType: CustomizableChartOptions,
    columnIndex: number
  ) => {
    const types = [...customizableAxesTypes];
    types[columnIndex] = LeftRight[newType] as unknown as LeftRight;
    setCustomizableAxesTypes(types);
  };

  return (
    <div className='m-7 flex justify-center'>
      <div className='collapse collapse-arrow w-full rounded-lg bg-base-200 shadow-md sm:w-3/4 lg:w-9/12'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>
          Customize Bar Chart
        </div>
        <form className='collapse-content p-4'>
          <div className='flex justify-center'>
            <SetCustomization
              header='Set Chart Types'
              columnNames={columnNames}
              columnTypes={customizableColumnTypes}
              setter={setColumnType}
              optionsEnum={ChartType}
            />
            <SetCustomization
              header='Set Axis Position'
              columnNames={columnNames}
              columnTypes={customizableAxesTypes}
              setter={setAxesType}
              optionsEnum={LeftRight}
            />
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
