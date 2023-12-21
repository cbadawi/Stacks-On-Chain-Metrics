import React from 'react';

type ModalProps = {
  OpenButtonChilden: any;
  ModalChildren: any;
};

const Modal = ({ OpenButtonChilden, ModalChildren }: ModalProps) => {
  return (
    <div>
      <button
        className='btn'
        onClick={() =>
          (document.getElementById('modal') as HTMLDialogElement).showModal()
        }
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
