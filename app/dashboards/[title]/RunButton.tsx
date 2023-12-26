'use client';

import React, { useCallback } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { VariableType } from '@/app/components/helpers';

const RunButton = ({
  formId,
  setVariables,
}: {
  formId?: string;
  setVariables: React.Dispatch<React.SetStateAction<VariableType[]>>;
}) => {
  const router = useRouter();

  const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const variablesElements = document.getElementsByClassName('variable-input');
    let urlQuery = '';
    const variableList: VariableType[] = [];
    const res = Array.from(variablesElements).every((element) => {
      const variable = element.className.split(' ')[1];
      const value = (element as HTMLButtonElement).value;
      const queryString = `${variable}=${value}`;
      urlQuery += queryString + '&';
      variableList.push({ variable, value });
      return true;
    });

    setVariables(variableList);

    if (res && urlQuery) {
      router.push('/dashboards/variabletest' + '?' + urlQuery);
    }
  };

  return (
    <button
      form={formId}
      className='btn btn-primary bg-[#563BD9] hover:bg-[#452AA5]'
      type='submit'
      onClick={onClickHandler}
    >
      <FaPlayCircle size={20} />
    </button>
  );
};

export default RunButton;
