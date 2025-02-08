import {
  doesOverlap,
  isAvailablePosition,
  Position,
} from '../components/helpers';

function findFirstAvailablePosition(
  allCharts: Position[],
  newWidth: number,
  newHeight: number
): { x: number; y: number } | null {
  let x = 0;
  let y = 0;

  let xSteps = 5;
  let ySteps = 5;

  const maxX: number = 10000;
  const maxY: number = 10000;

  while (y + newHeight <= maxY) {
    const newCard: Position = {
      x,
      y,
      width: newWidth,
      height: newHeight,
    };

    const isColliding = allCharts.some((card) => doesOverlap(newCard, card));

    if (!isColliding) {
      return { x, y };
    }

    x += xSteps;

    // If we go beyond maxX, reset x to 0 and move y down 1
    if (x + newWidth > maxX) {
      x = 0;
      y += ySteps;
    }
  }

  return null;
}
