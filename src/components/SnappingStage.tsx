import React, { useState, useRef } from 'react';
import { ReactReduxContext, Provider } from 'react-redux';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { Box } from '@chakra-ui/react';
import { type Vector2d } from 'konva/lib/types';

import ZoomButtons from './ZoomButtons';
import LineGuide from './shapes/LineGuide';
import { type CustomShapeConfig } from '../types';
import { assertNever } from '../utils';
import {
  getNodeSnappingEdges,
  getLineGuidePositions,
  getGuides,
} from '../utils/konva';
import { useWindowSize, useAppSelector, useAppDispatch } from '../hooks';
import { setVerticalLineGuide, setHorizontalLineGuide } from '../redux/slices/lineGuidesSlice';
import type { AppDispatch } from '../redux';

type LineGuideUpdateFunc = (
  e: Konva.KonvaEventObject<DragEvent>,
  stageRef: React.RefObject<Konva.Stage>,
  allShapes: CustomShapeConfig[],
  dispatch: AppDispatch,
) => void;

/**
 * A function for setting horizontal and vertical line guides correctly so that an object
 * which has been dragged on the canvas can be snapped to objects nearby. This function can
 * be used for the `onDragMove` prop of a Konva `Layer` but cannot be used for setting the
 * line guides when objects are resized (transformed). For that purpose, check the
 * `handleLineGuidesUpdateOnTransform` function.
*/
const handleLineGuidesUpdate: LineGuideUpdateFunc = (
  e,
  stageRef,
  allShapes,
  dispatch
) => {
  if (!stageRef || !stageRef.current) {
    throw new Error('Stage ref is either null or it doesn\'t have the current property.');
  }

  let movedShape = allShapes.find(shape => shape.id === e.target.id());
  if (!movedShape) {
    // It could be that the user has clicked a shape before dragging it and, therefore,
    // the transformer of the shape is the `e.target` instead of actual shape corresponding
    // to the transformer. Each custom shape has a transformer whose id is the same as the
    // shape's but appended with a '-transformer' string.
    const possibleTransformerId = e.target.id();
    const shapeId = possibleTransformerId.replace('-transformer', '');
    movedShape = allShapes.find(shape => shape.id === shapeId);
    if (!movedShape) {
      throw new Error('An object that was moved was not found from the state.');
    }
  }
  const movedNode = movedShape.id === e.target.id()
    // The target is the shape itself
    ? e.target
    // The target is the transformer and we want to find the node corresponding the actual shape
    : stageRef.current.findOne(`#${movedShape.id}`);

  // Get all x and y values that could trigger the snapping effect for all nodes except for
  // `movedNode` itself.
  const lineGuidePositions = getLineGuidePositions(stageRef.current, movedNode);
  // Get the bounds of the `movedNode`
  const itemBounds = getNodeSnappingEdges(movedNode);
  // Find all line guides which are close enough the `movedNode`.
  const guides = getGuides(lineGuidePositions, itemBounds);

  if (!guides.length) {
    // No guides closeby at all
    dispatch(setHorizontalLineGuide(null));
    dispatch(setVerticalLineGuide(null));
    return;
  }
  if (!guides.find((guide) => guide.orientation === 'horizontal')) {
    // No horizontal guides but there are vertical ones.
    dispatch(setHorizontalLineGuide(null));
  }
  if (!guides.find((guide) => guide.orientation === 'vertical')) {
    // No vertical guides but there are horizontal ones.
    dispatch(setVerticalLineGuide(null));
  }
  const absPos = movedNode.absolutePosition();

  guides.forEach((lg) => {
    switch (lg.orientation) {
    case 'vertical':
      dispatch(setVerticalLineGuide({ x: lg.relativePos, direction: 'vertical' }));
      absPos.x = lg.absPos + lg.offset;
      break;
    case 'horizontal':
      dispatch(setHorizontalLineGuide({ y: lg.relativePos, direction: 'horizontal' }));
      absPos.y = lg.absPos + lg.offset;
      break;
    default:
      assertNever(lg.orientation);
      break;
    }
  });
  // Force the position of the `movedNode` to create the snapping effect
  movedNode.absolutePosition(absPos);
};

type LineGuideUpdateOnTransformFunc = (
  node: Konva.Node,
  anchorPos: Vector2d,
  dispatch: AppDispatch
) => ({ x: number } | { y: number })[];

export const handleLineGuidesUpdateOnTransform: LineGuideUpdateOnTransformFunc = (
  node,
  anchorPos,
  dispatch
) => {

  const stage = node.getStage();
  if (!stage) {
    throw new Error(`Node with id ${node.id} and name ${node.name} is not associated with a Konva Stage.`);
  }

  // Get all x and y values that could trigger the snapping effect for all nodes except for
  // `node` itself.
  const lineGuidePositions = getLineGuidePositions(stage, node);

  const pointerPos = stage.getPointerPosition();
  if (!pointerPos) {
    return [];
  }

  // Note that for vertical line guides, we store x values and not y values. A vertical line guide
  // appears when the size of an object has been transformed in the horizontal direction (i.e., in
  // the direction of x-axis and not y-axis).
  const resultV: Array<{ xAbs: number, xRel: number, diff: number }> = [];
  const resultH: Array<{ yAbs: number, yRel: number, diff: number }> = [];

  lineGuidePositions.vertical.forEach(lineGuidePos => {
    // We want to make sure that the distance between the potential line guide
    // and the pointer would be small enough to trigger snapping.
    const diff = Math.abs(lineGuidePos.absolute - pointerPos.x);
    // We also want to make sure that the anchor used for transforming the object's size
    // is close enough to the pointer. Otherwise, it would be possible that the pointer is
    // very far from the anchor we are trying to snap and the pointer could still trigger snapping
    // in the other direction (horizontal in this case) in case the pointer is close to a horizontal
    // potential line guide even if the anchor (and the current object to be transformed) were not.
    // Using the pointer position is still needed because if we only used the anchor position,
    // the anchor will get trapped in the first line guide position after snapping and it cannot leave
    // the snapping point before the transformation ends even if the pointer could move past the
    // snapping point.
    const anchorAndPointerDiff = Math.abs(pointerPos.x - anchorPos.x);
    const guideLineOffset = 5;
    if (diff <= guideLineOffset && anchorAndPointerDiff <= guideLineOffset) {
      resultV.push({
        xAbs: lineGuidePos.absolute,
        xRel: lineGuidePos.relative,
        diff: diff,
      });
    }
  });

  lineGuidePositions.horizontal.forEach(lineGuidePos => {
    const diff = Math.abs(lineGuidePos.absolute - pointerPos.y);
    const anchorAndPointerDiff = Math.abs(pointerPos.y - anchorPos.y);
    const guideLineOffset = 5;
    if (diff <= guideLineOffset && anchorAndPointerDiff <= guideLineOffset) {
      resultH.push({
        yAbs: lineGuidePos.absolute,
        yRel: lineGuidePos.relative,
        diff: diff,
      });
    }
  });

  const minV = resultV.sort((a, b) => a.diff - b.diff);
  const minH = resultH.sort((a, b) => a.diff - b.diff);

  const result: ({ x: number } | { y: number })[] = [];

  if (minV.length === 0 && minH.length === 0) {
    dispatch(setHorizontalLineGuide(null));
    dispatch(setVerticalLineGuide(null));
  }

  if (minV.length > 0) {
    dispatch(setVerticalLineGuide({ x: minV[0].xRel, direction: 'vertical' }));
    result.push({ x: minV[0].xAbs });
  }
  if (minH.length > 0) {
    dispatch(setHorizontalLineGuide({ y: minH[0].yRel, direction: 'horizontal' }));
    result.push({ y: minH[0].yAbs });
  }

  return result;
};

export interface SnappingStageConfig {
  allShapes: CustomShapeConfig[];
  children: React.ReactNode;
  menuWidth: number;

  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export type SnappingStageProps = SnappingStageConfig & Konva.StageConfig;

const SnappingStage = (props: SnappingStageProps): JSX.Element => {
  const {
    allShapes,
    setSelectedId,
    children,
    menuWidth,
    ...otherProps
  } = props;

  const [scale, setScale] = useState<number>(1);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const stageRef = useRef<Konva.Stage | null>(null);

  const verticalLineGuide = useAppSelector((state) => state.lineGuides.vertical);
  const horizontalLineGuide = useAppSelector((state) => state.lineGuides.horizontal);

  const dispatch = useAppDispatch();

  const removeLineGuides = (): void => {
    horizontalLineGuide && dispatch(setHorizontalLineGuide(null));
    verticalLineGuide && dispatch(setVerticalLineGuide(null));
  };

  const deselectShape = <EventType,>(e: Konva.KonvaEventObject<EventType>) => {
    const clickedStage = e.target === e.target.getStage();
    if (clickedStage) {
      setSelectedId(null);
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
