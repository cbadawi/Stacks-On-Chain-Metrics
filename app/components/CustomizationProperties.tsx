import React from 'react';
import DropdownButton from './DropdownButton';
import {
  LeftRight,
  CustomizableChartTypes,
  CustomizableChartDropdownOptions,
  CustomizableAxesDropdownOptions,
} from './helpers';

interface CustomizationPropertiesProps {
  name: string;
  columnIndex: number;
  chartColumnTypes: CustomizableChartTypes[];
  chartAxesTypes: LeftRight[];
  setColumnsTypes: ({
    newType,
    columnName,
  }: {
    newType: CustomizableChartTypes;
    columnName: string;
  }) => void;
  setAxesTypes: ({
    newType,
    columnName,
  }: {
    newType: LeftRight;
    columnName: string;
  }) => void;
}

const CustomizationProperties = ({
  name,
  columnIndex,
  chartColumnTypes,
  chartAxesTypes,
  setColumnsTypes,
  setAxesTypes,
}: CustomizationPropertiesProps) => {
  return (
    <div>
      <span>{name}</span>
      <div className='flex'>
        <div>
          <span>Chart</span>
          <DropdownButton
            key={`column-dropdownbutton-${name}-chart`}
            buttonText={chartColumnTypes[columnIndex]}
            options={CustomizableChartDropdownOptions}
            setter={setColumnsTypes}
            label={name}
          />
        </div>
        <div>
          <span>Axis Position</span>
          <DropdownButton
            key={`column-dropdownbutton-${name}-axis`}
            buttonText={chartAxesTypes[columnIndex]}
            options={CustomizableAxesDropdownOptions}
            setter={setAxesTypes}
            label={name}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizationProperties;
