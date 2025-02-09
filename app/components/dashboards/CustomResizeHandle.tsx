import { MoveDiagonal2 } from 'lucide-react';

const CustomResizeHandle = ({ resizeHandle }: { resizeHandle: string }) => (
  <div
    style={{
      cursor: 'se-resize',
    }}
  >
    <MoveDiagonal2 size={16} color='red' />
  </div>
);

export default CustomResizeHandle;
