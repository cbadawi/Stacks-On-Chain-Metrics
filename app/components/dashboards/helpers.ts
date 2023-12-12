const STEPS_IN_PIXEL = 16 * 2;

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
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getClosestDropzones = (
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

/**
 * Calculates x & y coordinates of the child with respect from the parent given the
 * position from the viewport.
 */
export const getPositionFromParent = (child: Position, parent: Position) => {
  return {
    x: child.x - parent.x,
    y: child.y - parent.y,
  };
};

// Event Listeners
// https://javascript.info/mouse-drag-and-drop
export const onMouseDown = (
  e: DragEvent,
  draggable: HTMLElement,
  draggables: NodeListOf<Element>,
  setDropzones: React.Dispatch<React.SetStateAction<Position[]>>,
  displayedDropzones: number
) => {
  const draggableBoundingRect = draggable.getBoundingClientRect();
  let shiftX = e.clientX - draggableBoundingRect.left;
  let shiftY = e.clientY - draggableBoundingRect.top;

  draggable.style.position = 'absolute';
  draggable.style.zIndex = '1000';
  document.body.append(draggable);

  moveAt({ x: e.pageX - shiftX, y: e.pageY - shiftY });

  function moveAt({ x, y }: Position) {
    const incrementX = 50;
    const incrementY = 50;

    x = Math.round(x / incrementX) * incrementX;
    y = Math.round(y / incrementY) * incrementY;

    draggable.style.left = x + 'px';
    draggable.style.top = y + 'px';
  }

  function handleDropzones(wrapper: Element) {
    const wrapperBoundingRect: DOMRect = wrapper.getBoundingClientRect();
    let allDraggablesBoundingRects: DOMRect[] = [];
    draggables.forEach((d) =>
      allDraggablesBoundingRects.push(d.getBoundingClientRect())
    );
    const dropzonesPositionsFromViewport = findAvailablePositions(
      draggable.getBoundingClientRect(),
      wrapperBoundingRect,
      allDraggablesBoundingRects
    );
    const dropzonePositionsFromParent = dropzonesPositionsFromViewport.map(
      (pos) => getPositionFromParent(pos, wrapperBoundingRect)
    );

    const currentPosition = getPositionFromParent(
      draggableBoundingRect,
      wrapperBoundingRect
    );

    const closestDropzones = getClosestDropzones(
      currentPosition,
      dropzonePositionsFromParent,
      displayedDropzones
    );

    setDropzones(closestDropzones);
  }

  function onMouseMove(e: any) {
    const wrapper = document.querySelector('.draggables-wrapper');
    if (!wrapper || !draggable) return;

    const cardPositionFromDoc = {
      x: (e as DragEvent).pageX - shiftX,
      y: (e as DragEvent).pageY - shiftY,
    };
    moveAt(cardPositionFromDoc);
    // TODO handle bugs
    // handleDropzones(wrapper)
  }

  document.addEventListener('mousemove', onMouseMove);

  // https://melkornemesis.medium.com/handling-javascript-mouseup-event-outside-element-b0a34090bb56
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
    draggable.onmouseup = null;
  });
};

// drag & drop api
export const dragendEventListener = (
  e: DragEvent,
  chartUniqueKey: string,
  draggable: Element,
  setDropboxes: React.Dispatch<React.SetStateAction<Position[]>>
) => {
  if (!(draggable instanceof HTMLElement)) return;
  // setDropboxes([]);
  const intialPosition = getChartInitialPosition(chartUniqueKey);
  if (!intialPosition) {
    console.error(
      `Chart initial position not found chartUniqueKey: ${chartUniqueKey}`
    );
    return;
  }
  // const finalPosition = getDraggingPositionFromWrapper(draggable);
  // if (!currentPosition) return;

  // // translate requires the distance moved from current position, not the final destination
  // // both finalPosition & intialPosition are with respect to the parent container
  // const distanceX = finalPosition.x - JSON.parse(intialPosition!).x;
  // const distanceY = finalPosition.y - JSON.parse(intialPosition!).y;
  // const transform = `translate(${distanceX}px, ${distanceY}px)`;
  // draggable.style.transform = transform;
  draggable.classList.remove('currently-dragging');
};

export function dragEventListener(
  e: DragEvent,
  chartUniqueKey: string,
  draggable: Element,
  draggables: NodeListOf<Element>,
  setDropzones: React.Dispatch<React.SetStateAction<Position[]>>,
  displayedDropboxes: number
) {
  const currentPositionFromEvent = { x: e.clientX, y: e.clientY };
  const wrapper = document.querySelector('.draggables-wrapper');
  if (!wrapper) return;
  const wrapperBoundingRect: DOMRect = wrapper.getBoundingClientRect();
  let allDraggablesBoundingRects: DOMRect[] = [];
  draggables.forEach((d) =>
    allDraggablesBoundingRects.push(d.getBoundingClientRect())
  );
  const draggableBoundingRect = draggable.getBoundingClientRect();

  console.log(
    'draggableBoundingRect',
    draggableBoundingRect.x,
    draggableBoundingRect.y,
    currentPositionFromEvent
  );

  const currentPosition = getPositionFromParent(
    draggableBoundingRect,
    wrapperBoundingRect
  );
  if (!currentPosition) return;

  // TODO this index should be safe to use since the event listeners are only added once
  // But i can see a scenario where it could cause bugs, when a user exits the dashboard and comes back
  // So use a new unique identifier for charts such as chart title, & see when its best to clear session/local storage
  saveChartInitialPosition(chartUniqueKey, currentPosition);

  // Bounding rect values are relative to viewport
  const dropzonesPositions = findAvailablePositions(
    draggableBoundingRect,
    wrapperBoundingRect,
    allDraggablesBoundingRects
  );

  const dropzonePositionsFromParent = dropzonesPositions.map((pos) =>
    getPositionFromParent(pos, wrapperBoundingRect)
  );

  const closestDropzones = getClosestDropzones(
    currentPosition,
    dropzonesPositions,
    displayedDropboxes
  );

  setDropzones(closestDropzones);
}
