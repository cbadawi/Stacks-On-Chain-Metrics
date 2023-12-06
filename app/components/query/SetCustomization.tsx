import React from 'react';
import DropdownButton from '../DropdownButton';
import {
  ChartType,
  CustomizableChartOptions,
  customizableChartOptions,
  enumToArray,
} from '../charts/helpers';

interface SetCustomizationProps {
  header: string;
  columnNames: string[];
  columnTypes: any[];
  setter: (newType: any, columnIndex: number) => void;
  optionsEnum: any;
}

const colorConfig = {
  odd: 'bg-gray-700',
  even: 'bg-gray-600',
};

const SetCustomization = ({
  header,
  columnNames,
  columnTypes,
  setter,
  optionsEnum,
}: SetCustomizationProps) => {
  return (
    <div className='m-4 w-1/2 bg-gray-800 py-4 text-white shadow-lg '>
      <h2 className='border-b border-gray-200 pl-2 text-xl font-medium'>
        {header}
      </h2>
      {/* TODO add to ul max-h-64 overflow-y-scroll + make sure the dropdown menu shows */}
      <ul className=''>
        {columnNames.map((col, index) => {
          const columnTypeStr = optionsEnum[columnTypes[index]];
          const colorConfigKey = !(index % 2) ? 'even' : 'odd';
          return (
            <li key={`column-li-${index}`} className='flex items-center'>
              <div
                className={`relative flex h-14 w-full items-center border-b border-gray-700 ${colorConfig[colorConfigKey]}`}
              >
                <span className='ml-2 max-w-[4rem] overflow-hidden text-lg text-gray-300'>
                  {col}
                </span>
                <div className='absolute left-20'>
                  <DropdownButton
                    key={`column-dropdownbutton-${index}`}
                    buttonText={columnTypeStr}
                    options={enumToArray(optionsEnum)}
                    dropdownButtonIndex={index}
                    setter={setter}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SetCustomization;
