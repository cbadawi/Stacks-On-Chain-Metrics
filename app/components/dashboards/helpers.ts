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

export type Position = { x: number; y: number };

const getDistance = (pos1: Position, pos2: Position) => {
  // pythagorean theorem
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getClosestDropZones = (
  currentPosition: Position,
  dropzones: Position[],
  n?: number // number of dropzones to return
) => {
  const distances = dropzones.map((dropzone) => ({
    dropzone,
    distance: getDistance(currentPosition, dropzone),
  }));

  distances.sort((a, b) => a.distance - b.distance);
  if (!n) return distances.map((d) => d.dropzone);

  const closestTargets = distances.slice(0, n).map((item) => item.dropzone);
  return closestTargets;
};

const saveChartInitialPosition = (
  chartUniqueKey: string,
  initialPosition: Position
) => {
  if (!localStorage.getItem(chartUniqueKey))
    localStorage.setItem(chartUniqueKey, JSON.stringify(initialPosition));
};

const getChartInitialPosition = (chartUniqueKey: string) => {
  return localStorage.getItem(chartUniqueKey);
};

// Event Listeners
export function dragEventListener(
  e: DragEvent,
  chartUniqueKey: string,
  draggable: Element,
  wrapperBoundingRect: DOMRect,
  allDraggablesBoundingRects: DOMRect[],
  setDropboxes: React.Dispatch<React.SetStateAction<Position[]>>,
  displayedDropboxes: number
) {
  const currentPosition = { x: e.clientX, y: e.clientY };
  // TODO this index should be safe to use since the event listeners are only added once
  // But i can see a scenario where it could cause bugs, when a user exits the dashboard and comes back
  // So use a new unique identifier for charts such as chart title, & see when its best to clear session/local storage
  saveChartInitialPosition(chartUniqueKey, currentPosition);
  draggable.classList.add('currently-dragging');

  const draggableBoundingRect = draggable.getBoundingClientRect();
  const dropboxesPositions = findAvailablePositions(
    draggableBoundingRect,
    wrapperBoundingRect,
    allDraggablesBoundingRects
  );

  setDropboxes(
    getClosestDropZones(currentPosition, dropboxesPositions, displayedDropboxes)
  );
}

export const dragendEventListener = (
  e: DragEvent,
  chartUniqueKey: string,
  draggable: Element,
  setDropboxes: React.Dispatch<React.SetStateAction<Position[]>>
) => {
  if (!(draggable instanceof HTMLElement)) return;
  setDropboxes([]);
  const intialPosition = getChartInitialPosition(chartUniqueKey);
  if (!intialPosition) {
    console.error(
      `Chart initial position not found chartUniqueKey: ${chartUniqueKey}`
    );
    return;
  }
  const newX = e.clientX;
  const newY = e.clientY;
  // translate requires the distance moved from current position, not the final destination
  const distanceX = newX - JSON.parse(intialPosition!).x;
  const distanceY = newY - JSON.parse(intialPosition!).y;
  const transform = `translate(${distanceX}px, ${distanceY}px)`;
  draggable.style.transform = transform;
  draggable.classList.remove('currently-dragging');
};
