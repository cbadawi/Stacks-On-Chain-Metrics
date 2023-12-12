import React from 'react';

// https://dev.to/ndickers/drag-drop-implementation-using-htmlcss-and-javascript-8mc
// https://javascript.info/mouse-drag-and-drop
// https://www.youtube.com/results?search_query=drop+zone+javascript
// One possible solution would be to programaically create all possible drop zone components at the dragstart event listener
// and then Add dragover event listener to dropZone element or drop event fires when dragged element drops in dropZone.

type DropZoneProps = {
  height: string;
  width: string;
  xTransform: `${string}px` | `${string}rem`;
  yTransform: `${string}px` | `${string}rem`;
};

const DropZone = ({ height, width, xTransform, yTransform }: DropZoneProps) => {
  let className = `drop-zone ${height} ${width} absolute top-0 left-0 bg-red-100 text-black`;
  // hadling complex dynamic styling : https://stackoverflow.com/questions/72560190/using-dynamic-position-values-in-tailwind-css
  return (
    <div
      className={className}
      style={{ transform: `translate(${xTransform}, ${yTransform})` }}
    >
      {`translate(${xTransform}, ${yTransform})`}{' '}
    </div>
  );
};

export default DropZone;
