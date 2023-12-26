import React from 'react';

const Variable = ({
  variable,
  inputPlaceholder,
  defaultValue,
}: {
  inputPlaceholder?: string;
  defaultValue?: string;
  variable: string;
}) => {
  return (
    <div
      key={`div-${variable}`}
      className='filter-wrap overflow-auto rounded-3xl bg-[#18191e] px-3 py-2 text-gray-300'
    >
      <label key={`label-${variable}`}>{variable} </label>
      <input
        name={variable}
        autoComplete='off'
        key={`variable-input-${variable}`}
        className={`variable-input ${variable} bg-[#18191e] text-gray-400`}
        placeholder={inputPlaceholder}
        defaultValue={defaultValue}
      ></input>
    </div>
  );
};

export default Variable;
