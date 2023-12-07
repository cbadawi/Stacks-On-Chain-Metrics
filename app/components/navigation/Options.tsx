import React from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';

const Options = () => {
  return (
    <div className='dropdown dropdown-end dropdown-top dropdown-hover fixed bottom-2 right-2 z-50 flex'>
      <div tabIndex={0} role='button' className='btn m-1'>
        <CiMenuKebab colot='white' size={25} />
      </div>
      <ul
        tabIndex={0}
        className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow'
      >
        <li>
          <a
            href='https://github.com/cbadawi/stacksmetrics/issues/new'
            target='_blank'
            className='flex items-center justify-between'
          >
            Report an issue, idea or feedback <FaGithub size={25} />
          </a>
        </li>
        <li>
          <a className='flex items-center justify-between'>
            Health checks <MdOutlineHealthAndSafety color='red' size={25} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Options;
