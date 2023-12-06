import React from 'react';
import { CustomizableChartOptions } from './charts/helpers';

interface DropdownButtonProps {
  buttonText: string;
  options: string[];
  setter: (newType: CustomizableChartOptions, columnIndex: number) => void;
  dropdownButtonIndex: number;
}

const DropdownButton = ({
  buttonText,
  options,
  setter,
  dropdownButtonIndex,
}: DropdownButtonProps) => {
  return (
    <div className='dropdown'>
      <div tabIndex={0} role='button' className='btn px-3 text-xs'>
        {buttonText}
      </div>
      <ul
        tabIndex={0}
        className='menu dropdown-content z-[1] rounded-bl-box bg-base-100 text-white shadow'
      >
        {options.map((option, index) => (
          <li key={'li-' + index}>
            <a
              key={'a-' + index}
              onClick={() => {
                setter(option, dropdownButtonIndex);
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
            >
              {option}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownButton;
