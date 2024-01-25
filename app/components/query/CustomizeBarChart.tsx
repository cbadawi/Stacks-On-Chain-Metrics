import React from 'react';
import {
  CHART_CONTAINER_WIDTH,
  CustomizableChartTypes,
  LeftRight,
} from '../helpers';
import CustomizationProperties from '../CustomizationProperties';

interface CustomizeBarChart {
  columnNames: string[];
  chartColumnTypes: CustomizableChartTypes[];
  setChartColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartTypes[]>
  >;
  chartAxesTypes: LeftRight[];
  setChartAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
}

const CustomizeBarChart = ({
  columnNames,
  chartColumnTypes,
  setChartColumnsTypes,
  chartAxesTypes,
  setChartAxesTypes,
}: CustomizeBarChart) => {
  //
  const setColumnType = ({
    newType,
    columnName,
  }: {
    newType: CustomizableChartTypes;
    columnName: string;
  }) => {
    console.log('setColumnType');
    const types = [...chartColumnTypes];
    const columnIndex = columnNames.indexOf(columnName);
    if (columnIndex == -1) return;
    types[columnIndex] = newType;
    setChartColumnsTypes(types);
  };

  const setAxesType = ({
    newType,
    columnName,
  }: {
    newType: LeftRight;
    columnName: string;
  }) => {
    const types = [...chartAxesTypes];
    const columnIndex = columnNames.indexOf(columnName);
    if (columnIndex == -1) return;
    types[columnIndex] = newType;
    setChartAxesTypes(types);
  };

  return (
    <div className={`my-7 flex items-center justify-center`}>
      <div
        className={`collapse collapse-arrow rounded-lg bg-base-200 shadow-md`}
        style={{ width: `${CHART_CONTAINER_WIDTH}px` }}
      >
        <input type='checkbox' />
        <div className='collapse-title flex justify-center text-xl font-medium'>
          Customize Bar Chart
        </div>
        <form className='collapse-content'>
          <div className='md flex flex-col justify-center gap-3 overflow-y-scroll'>
            {columnNames.map((name, index) => (
              <CustomizationProperties
                key={`CustomizationProperties-${index}`}
                name={name}
                columnIndex={index}
                chartColumnTypes={chartColumnTypes}
                chartAxesTypes={chartAxesTypes}
                setColumnsTypes={setColumnType}
                setAxesTypes={setAxesType}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomizeBarChart;
