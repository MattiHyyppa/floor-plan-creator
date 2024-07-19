import React, { useState, useRef } from 'react';
import { ReactReduxContext, Provider } from 'react-redux';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { Box } from '@chakra-ui/react';

import ZoomButtons from './ZoomButtons';
import UndoRedoButtons from './UndoRedoButtons';
import LineGuide from './Shapes/LineGuide';
import { handleLineGuidesUpdate } from '../utils/snappingStage';
import {
  useWindowSize,
  useAppSelector,
  useAppDispatch,
  useArrowKeyEvents,
} from '../hooks';
import { setVerticalLineGuide, setHorizontalLineGuide } from '../redux/slices/lineGuidesSlice';
import { setSelectedId } from '../redux/slices/selectedIdSlice';
import { undoShapeOperation, redoShapeOperation, } from '../redux/slices/canvasSlice';
import { setActiveTab } from '../redux/slices/menuSlice';

export interface SnappingStageConfig {
  children: React.ReactNode;
  menuWidth: number;
}

export type SnappingStageProps = SnappingStageConfig & Konva.StageConfig;

const SnappingStage = (props: SnappingStageProps): JSX.Element => {
  const {
    children,
    menuWidth,
    ...otherProps
  } = props;

  const [scale, setScale] = useState<number>(1);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const stageRef = useRef<Konva.Stage | null>(null);

  const verticalLineGuide = useAppSelector((state) => state.lineGuides.vertical);
  const horizontalLineGuide = useAppSelector((state) => state.lineGuides.horizontal);
  const canvasState = useAppSelector((state) => state.canvas);
  const allShapes = canvasState.shapes;

  const dispatch = useAppDispatch();

  useArrowKeyEvents();

  const removeLineGuides = (): void => {
    horizontalLineGuide && dispatch(setHorizontalLineGuide(null));
    verticalLineGuide && dispatch(setVerticalLineGuide(null));
  };

  const deselectShape = <EventType,>(e: Konva.KonvaEventObject<EventType>) => {
    const clickedStage = e.target === e.target.getStage();
    if (clickedStage) {
      dispatch(setSelectedId(null));
      dispatch(setActiveTab(0));
    }
  };

  const handleLineGuidesOnMove = (e: Konva.KonvaEventObject<DragEvent>) => (
    handleLineGuidesUpdate(e, stageRef, allShapes, dispatch)
  );

  const zoomButtonsLeftMargin = `${8 + menuWidth}px`;

  return (
    <div>
      <Box position="fixed" zIndex={1000} top={2} left={zoomButtonsLeftMargin}>
        <ZoomButtons
          onZoomIn={_e => setScale(scale + 0.1)}
          onZoomOut={_e => setScale(scale - 0.1)}
        />
      </Box>
      <Box position="fixed" zIndex={1000} top={2} right={2}>
        <UndoRedoButtons
          onUndo={_e => dispatch(undoShapeOperation())}
          onRedo={_e => dispatch(redoShapeOperation())}
          undoDisabled={canvasState.previousUpdatesIndex < 0}
          redoDisabled={canvasState.previousUpdatesIndex >= canvasState.previousUpdates.length - 1}
        />
      </Box>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage
            ref={stageRef}
            x={menuWidth}
            scaleX={scale}
            scaleY={scale}
            width={windowWidth * Math.max(scale, 1)}
            height={windowHeight * Math.max(scale, 1)}
            onMouseDown={(e) => deselectShape(e)}
            onTouchStart={(e) => deselectShape(e)}
            {...otherProps}
          >
            <Provider store={store}>
              <Layer
                onDragMove={handleLineGuidesOnMove}
                onDragEnd={(_e) => removeLineGuides()}
              >
                {children}
                {horizontalLineGuide && <LineGuide {...horizontalLineGuide} />}
                {verticalLineGuide && <LineGuide {...verticalLineGuide} />}
              </Layer>
            </Provider>
          </Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  );
};

export default SnappingStage;
