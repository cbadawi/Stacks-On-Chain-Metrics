import React from 'react';

type ModalProps = {
  OpenButtonChilden: any;
  ModalChildren: any;
  saveToDashCounter: number;
  setSaveToDashCounter: React.Dispatch<React.SetStateAction<number>>;
};

const Modal = ({
  OpenButtonChilden,
  ModalChildren,
  saveToDashCounter,
  setSaveToDashCounter,
}: ModalProps) => {
  return (
    <div>
      <button
        className='btn'
        onClick={() => {
          (document.getElementById('modal') as HTMLDialogElement).showModal();
          setSaveToDashCounter(saveToDashCounter++);
        }}
      >
        {OpenButtonChilden}
      </button>
      <dialog id='modal' className='modal'>
        <div className='modal-box'>{ModalChildren}</div>
        {/* do not remove this button, breaks focus to close modal */}
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Modal;
