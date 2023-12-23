import React from 'react';
import { CustomizableChartOptions, LeftRight } from '../helpers';
import SetCustomization from './SetCustomization';
import { ChartType } from '@prisma/client';

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
    types[columnIndex] = ChartType[
      newType
    ] as unknown as CustomizableChartOptions;
    setCustomizableColumnsTypes(types);
  };

  const setAxesType = (newType: LeftRight, columnIndex: number) => {
    const types = [...customizableAxesTypes];
    types[columnIndex] = LeftRight[newType] as unknown as LeftRight;
    setCustomizableAxesTypes(types);
  };

  const BarAndLineChartTypes = {
    BAR: ChartType.BAR,
    LINE: ChartType.LINE,
  };

  return (
    <div className='m-7 flex justify-center'>
      <div className='collapse collapse-arrow w-full rounded-lg bg-base-200 shadow-md sm:w-3/4 lg:w-9/12'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>
          Customize Bar Chart
        </div>
        <form className='collapse-content p-4'>
          <div className='flex justify-center overflow-y-scroll'>
            <SetCustomization
              header='Set Chart Types'
              columnNames={columnNames}
              columnTypes={customizableColumnTypes}
              setter={setColumnType}
              optionsEnum={BarAndLineChartTypes}
            />
            <SetCustomization
              header='Set Axis Position'
              columnNames={columnNames}
              columnTypes={customizableAxesTypes}
              setter={setAxesType}
              optionsEnum={LeftRight}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomizeBarChart;
