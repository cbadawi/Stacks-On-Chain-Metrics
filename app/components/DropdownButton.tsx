import React from 'react';

interface DropdownButtonProps {
  buttonText: string;
  options: string[];
  setter: (params: any) => void;
  label?: string;
}

const DropdownButton = ({
  buttonText,
  options,
  setter,
  label,
}: DropdownButtonProps) => {
  return (
    <div className='dropdown'>
      <div tabIndex={0} role='button' className='btn px-3 text-xs'>
        {buttonText}
      </div>
      <ul
        tabIndex={0}
        className='menu dropdown-content relative z-20 rounded-bl-box bg-base-100 text-white shadow'
      >
        {options.map((option, index) => (
          <li key={'li-' + index} className='relative z-50'>
            <a
              key={'a-' + index}
              onClick={() => {
                console.log('option', option);
                if (label) setter({ newType: option, columnName: label });
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
