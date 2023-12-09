import React from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
import styles from './Example.module.css';

const ResizableCard = () => {
  const state = {
    height: 500,
    width: 700,
    absoluteWidth: 900,
    absoluteHeight: 800,
    absoluteTop: 1000,
    absoluteLeft: 600,
  };
  // https://github.com/react-grid-layout/react-resizable/blob/54a8518b68e189b31e72149e693d60bbf3bde5df/examples/ExampleLayout.js
  return (
    <div>
      <h3>Statically Positioned Layout</h3>
      <div className='layoutRoot'>
        <ResizableBox
          className={`${styles.custombox} ${styles.box}`}
          width={200}
          height={200}
          onResize={() => {
            console.log('resizing element');
          }}
          handle={<span className={`${styles.newHandle}`} />}
          handleSize={[4, 4]}
        >
          <span className={styles.text}>
            {'<ResizableBox> with custom overflow style & handle in SE corner.'}
          </span>
        </ResizableBox>

        <div>
          <h3>Statically Positioned Layout</h3>
          <div className='layoutRoot'>
            <Resizable
              className={styles.box}
              height={state.height}
              width={state.width}
              onResize={() => {
                console.log('resizing element');
              }}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <div
                style={{
                  width: state.width + 'px',
                  height: state.height + 'px',
                }}
              >
                <span className={styles.text}>
                  {
                    'Raw use of <Resizable> element. 200x200, all Resize Handles.'
                  }
                </span>
                <button
                  onClick={() => console.log('onclick')}
                  style={{ marginTop: '10px' }}
                >
                  Reset this element's width/height
                </button>
              </div>
            </Resizable>
            <ResizableBox className={styles.box} width={200} height={200}>
              <span className={styles.text}>{'<ResizableBox>'}</span>
            </ResizableBox>
            <ResizableBox
              className='custom-box box'
              width={200}
              height={200}
              handle={<span className='custom-handle custom-handle-se' />}
              handleSize={[8, 8]}
            >
              <span className={styles.text}>
                {
                  '<ResizableBox> with custom overflow style & handle in SE corner.'
                }
              </span>
            </ResizableBox>
            <ResizableBox
              className='custom-box box'
              width={200}
              height={200}
              // TODO handle={<CustomResizeHandle />}
              handleSize={[8, 8]}
            >
              <span className={styles.text}>
                {'ToDO <ResizableBox> with a custom resize handle component.'}
              </span>
            </ResizableBox>
            <ResizableBox
              className='custom-box box'
              width={200}
              height={200}
              handle={(h, ref) => (
                <span
                  className={`custom-handle custom-handle-${h}`}
                  ref={ref}
                />
              )}
              handleSize={[8, 8]}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                {'<ResizableBox> with custom handles in all locations.'}
              </span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              draggableOpts={{ grid: [25, 25] }}
            >
              <span className={styles.text}>
                Resizable box that snaps to even intervals of 25px.
              </span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              minConstraints={[150, 150]}
              maxConstraints={[500, 300]}
            >
              <span className={styles.text}>
                Resizable box, starting at 200x200. Min size is 150x150, max is
                500x300.
              </span>
            </ResizableBox>
            <ResizableBox
              className={`${styles.box} ${styles.hoverhandles}`}
              width={200}
              height={200}
              minConstraints={[150, 150]}
              maxConstraints={[500, 300]}
            >
              <span className={styles.text}>
                Resizable box with a handle that only appears on hover.
              </span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              lockAspectRatio={true}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                Resizable square with a locked aspect ratio.
              </span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={120}
              lockAspectRatio={true}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                Resizable rectangle with a locked aspect ratio.
              </span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              axis='x'
            >
              <span className={styles.text}>Only resizable by "x" axis.</span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              axis='y'
            >
              <span className={styles.text}>Only resizable by "y" axis.</span>
            </ResizableBox>
            <ResizableBox
              className={styles.box}
              width={200}
              height={200}
              axis='both'
            >
              <span className={styles.text}>Resizable ("both" axis).</span>
            </ResizableBox>
            <ResizableBox className={styles.box} width={200} height={200}>
              //TODO axis='none'
              <span className={styles.text}>Not resizable ("none" axis).</span>
            </ResizableBox>
          </div>

          <h3>Absolutely Positioned Layout</h3>
          <div className={`${styles.layoutRoot} ${styles.absoluteLayout}`}>
            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.topaligned} ${styles.leftaligned}`}
              height={200}
              width={200}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>Top-left Aligned</span>
            </ResizableBox>
            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.bottomaligned} ${styles.leftaligned}`}
              height={200}
              width={200}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>Bottom-left Aligned</span>
            </ResizableBox>
            {/* See implementation of `onResizeAbsolute` for how this can be moved around its container */}
            <Resizable
              className={`${styles.box} ${styles.absolutelypositioned}`}
              height={state.absoluteHeight}
              width={state.absoluteWidth}
              onResize={() => console.log('onResizeAbsolute')}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <div
                style={{
                  width: state.absoluteWidth,
                  height: state.absoluteHeight,
                  margin: `${state.absoluteTop} 0 0 ${state.absoluteLeft}`,
                }}
              >
                <span className={styles.text}>
                  {
                    'Raw use of <Resizable> element with controlled position. Resize and reposition in all directions.'
                  }
                </span>
              </div>
            </Resizable>
            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.topaligned} ${styles.rightaligned}`}
              height={200}
              width={200}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>Top-right Aligned</span>
            </ResizableBox>
            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.bottomaligned} ${styles.rightaligned}`}
              height={200}
              width={200}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>Bottom-right Aligned</span>
            </ResizableBox>
          </div>

          <h3>Scaled Absolute Layout</h3>
          <div>
            <small>
              If you are nesting Resizables in an element with{' '}
              <code>transform: scale(n)</code>, be sure to pass the same{' '}
              <code>n</code>&nbsp; as the <code>transformScale</code> property.
              <br />
              This box has scale 0.75.
            </small>
          </div>
          <div
            className={`${styles.layoutRoot} ${styles.absoluteLayout} ${styles.scaledLayout}`}
          >
            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.topaligned} ${styles.leftaligned}`}
              width={200}
              height={200}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                {'<ResizableBox> with incorrect scale 1'}
              </span>
            </ResizableBox>

            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.bottomaligned} ${styles.leftaligned}`}
              width={200}
              height={200}
              transformScale={0.75}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                {'<ResizableBox> with correct scale 0.75'}
              </span>
            </ResizableBox>

            {/* See implementation of `onResizeAbsolute` for how this can be moved around its container */}
            <Resizable
              className={`${styles.box} ${styles.absolutelypositioned}`}
              height={state.absoluteHeight}
              width={state.absoluteWidth}
              onResize={() => console.log('onResizeAbsolute')}
              transformScale={0.75}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <div
                style={{
                  width: state.absoluteWidth,
                  height: state.absoluteHeight,
                  margin: `${state.absoluteTop} 0 0 ${state.absoluteLeft}`,
                }}
              >
                <span className={styles.text}>
                  {
                    'Raw use of <Resizable> element with controlled position. Resize and reposition in all directions.'
                  }
                </span>
              </div>
            </Resizable>

            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.topaligned} r${styles.ightaligned}`}
              width={200}
              height={200}
              transformScale={0.75}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                {'<ResizableBox> with correct scale 0.75'}
              </span>
            </ResizableBox>

            <ResizableBox
              className={`${styles.box} ${styles.absolutelypositioned} ${styles.bottomaligned} ${styles.rightaligned}`}
              width={200}
              height={200}
              transformScale={0.75}
              resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
            >
              <span className={styles.text}>
                {'<ResizableBox> with correct scale 0.75'}
              </span>
            </ResizableBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableCard;
