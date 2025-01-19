import { Tags } from '@prisma/client';
import React from 'react';

const TagsInput = () => {
  return (
    <div className='tags-input dropdown w-full'>
      <input
        name='tags'
        placeholder='Optional dashboard tags'
        className='textarea textarea-bordered mb-3 w-full'
      />
      <ul
        tabIndex={0}
        className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow'
      >
        {Object.values(Tags).map((tag, index) => {
          return (
            <li key={'li' + index}>
              <a key={'a' + index}>{tag}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TagsInput;
