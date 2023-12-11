const STEPS_IN_PIXEL = 16 * 5;

// TODO this does not include parent padding and starts from 0 eventhough parent has p-4
export function findAvailablePositions(
  card: { width: number; height: number },
  parentElement: { width: number; height: number },
  occupiedPositions: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[]
) {
  const cardWidth = card.width;
  const cardHeight = card.height;
  const parentWidth = parentElement.width;
  const parentHeight = parentElement.height;
  const availablePositions = [];
  // x is the leftmost point of the draggable element
  // y is the highest point of the draggable element
  for (
    let yCounter = 0;
    yCounter <= parentHeight - cardHeight;
    yCounter += STEPS_IN_PIXEL
  ) {
    for (
      let xCounter = 0;
      xCounter <= parentWidth - cardWidth;
      xCounter += STEPS_IN_PIXEL
    ) {
      let isOccupied = false;
      for (const occupiedPos of occupiedPositions) {
        const { x, y, width, height } = occupiedPos;
        if (
          xCounter + cardWidth > x &&
          xCounter < x + width &&
          yCounter + cardHeight > y &&
          yCounter < y + height
        ) {
          isOccupied = true;
          break;
        }
      }
      if (!isOccupied) {
        availablePositions.push({ x: xCounter, y: yCounter });
      }
    }
  }
  return availablePositions;
}
