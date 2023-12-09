import React from 'react';
import { ResizableBox } from 'react-resizable';
import styles from './ResizableCard.module.css';

const ResizableCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResizableBox
      className={`${styles.custombox} ${styles.box}`}
      width={200}
      height={200}
      onResize={(event, resizeData) => {
        console.log('resizing element event', event);
        console.log('resizing element resizeData', resizeData);
      }}
      handle={<span className={`${styles.newHandle}`} />}
      handleSize={[4, 4]}
    >
      {children}
    </ResizableBox>
  );
};

export default ResizableCard;
