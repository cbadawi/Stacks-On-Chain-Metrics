import React, { ReactNode } from 'react';

const Modal = ({
  modalChildren,
  modalId,
}: {
  modalChildren: ReactNode;
  modalId: string;
}) => {
  return (
    <dialog id={modalId} className='modal'>
      <div className='modal-box'>{modalChildren}</div>
      {/* do not remove this button, breaks focus to close modal */}
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
