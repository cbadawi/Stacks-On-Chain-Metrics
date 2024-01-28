import React, { ReactNode } from 'react';
import Modal from '../Modal';
import SaveToDashboardForm from './SaveToDashboardForm';
import { ChartType } from '@prisma/client';
import { VariableType } from '../helpers';

type ModalProps = {
  OpenButtonChilden: any;
  saveToDashCounter: number;
  setSaveToDashCounter: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  chartType: ChartType;
  variableDefaults: VariableType[];
};

const SaveToDashBtn = ({
  OpenButtonChilden,
  saveToDashCounter,
  setSaveToDashCounter,
  query,
  chartType,
  variableDefaults,
}: ModalProps) => {
  const modalId = 'save-to-dash-modal';
  return (
    <div>
      <button
        className='btn'
        onClick={() => {
          (document.getElementById(modalId) as HTMLDialogElement).showModal();
          setSaveToDashCounter(saveToDashCounter++);
        }}
      >
        {OpenButtonChilden}
      </button>
      <Modal
        modalId={modalId}
        modalChildren={
          <SaveToDashboardForm
            modalId={modalId}
            query={query}
            chartType={chartType}
            saveToDashCounter={saveToDashCounter}
            variableDefaults={variableDefaults}
          />
        }
      />
    </div>
  );
};

export default SaveToDashBtn;
