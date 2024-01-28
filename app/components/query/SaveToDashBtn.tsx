import React, { ReactNode } from 'react';
import Modal from '../Modal';
import SaveToDashboardForm from './SaveToDashboardForm';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import { VariableType } from '../helpers';

type ModalProps = {
  OpenButtonChilden: any;
  saveToDashCounter: number;
  setSaveToDashCounter: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  chartType: ChartType;
  variableDefaults: VariableType[];
  chartColumnsTypes: CustomizableChartTypes[];
  chartAxesTypes: LeftRight[];
};

const SaveToDashBtn = ({
  OpenButtonChilden,
  saveToDashCounter,
  setSaveToDashCounter,
  query,
  chartType,
  variableDefaults,
  chartColumnsTypes,
  chartAxesTypes,
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
            chartAxesTypes={chartAxesTypes}
            chartColumnsTypes={chartColumnsTypes}
          />
        }
      />
    </div>
  );
};

export default SaveToDashBtn;
