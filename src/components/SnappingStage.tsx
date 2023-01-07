import React, { useState, useRef } from 'react';
import { ReactReduxContext, Provider } from 'react-redux';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { Box } from '@chakra-ui/react';

import ZoomButtons from './ZoomButtons';
import LineGuide from './Shapes/LineGuide';
import { handleLineGuidesUpdate } from '../utils/snappingStage';
import { useWindowSize, useAppSelector, useAppDispatch } from '../hooks';
import { setVerticalLineGuide, setHorizontalLineGuide } from '../redux/slices/lineGuidesSlice';
import { setSelectedId } from '../redux/slices/selectedIdSlice';

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
  const allShapes = useAppSelector((state) => state.shapes);

  const dispatch = useAppDispatch();

  const removeLineGuides = (): void => {
    horizontalLineGuide && dispatch(setHorizontalLineGuide(null));
    verticalLineGuide && dispatch(setVerticalLineGuide(null));
  };

  const deselectShape = <EventType,>(e: Konva.KonvaEventObject<EventType>) => {
    const clickedStage = e.target === e.target.getStage();
    if (clickedStage) {
      dispatch(setSelectedId(null));
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
