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
        onClick={() => {
          (document.getElementById('modal') as HTMLDialogElement).showModal();
        }}
      >
        {OpenButtonChilden}
      </button>
      <dialog id='modal' className='modal'>
        <div className='modal-box'>{ModalChildren}</div>
      </dialog>
    </div>
  );
};

export default Modal;
