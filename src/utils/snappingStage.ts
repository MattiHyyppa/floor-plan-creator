import Konva from 'konva';
import { type Vector2d } from 'konva/lib/types';

import { CustomShapeConfig } from '../types';
import { AppDispatch } from '../redux';
import { assertNever } from '.';
import { setVerticalLineGuide, setHorizontalLineGuide } from '../redux/slices/lineGuidesSlice';
import {
  getLineGuidePositions,
  getNodeSnappingEdges,
  getGuides,
  isNodeBeingResizedVertically,
  isNodeBeingResizedHorizontally,
} from './konva';

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
export const handleLineGuidesUpdate: LineGuideUpdateFunc = (
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


type LineGuideUpdateOnResizeFunc = (
  node: Konva.Node,
  anchorPos: Vector2d,
  dispatch: AppDispatch
) => ({ x: number } | { y: number })[];

export const handleLineGuidesUpdateOnResize: LineGuideUpdateOnResizeFunc = (
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

  const isResizedVertically = isNodeBeingResizedVertically(node);
  const isResizedHorizontally = isNodeBeingResizedHorizontally(node);

  // Note that for vertical line guides, we store x values and not y values. A vertical line guide
  // appears when the size of an object has been transformed in the horizontal direction (i.e., in
  // the direction of x-axis and not y-axis).
  const resultV: Array<{ xAbs: number, xRel: number, diff: number }> = [];
  const resultH: Array<{ yAbs: number, yRel: number, diff: number }> = [];

  const guideLineOffset = 5;

  lineGuidePositions.vertical.forEach(lineGuidePos => {
    // We want to make sure that the distance between the potential line guide
    // and the pointer would be small enough to trigger snapping.
    const diff = Math.abs(lineGuidePos.absolute - pointerPos.x);
    const pointerCloseToGuide = diff <= guideLineOffset;

    // Note that the position of the pointer (instead of the anchor) is compared to the position
    // of the line guides. Otherwise, it would be possible that the anchor would get stuck after
    // first snapping effect. In such a case when the anchor gets stuck and cannot be moved, the
    // pointer can still move past the snapping point --> let's use the pointer position, instead.

    // Because of using the pointer position, we also want to make sure that the anchor and the
    // pointer are close to each other. Otherwise, the snapping could be triggered falsely in the
    // opposite direction compared to the resize direction.
    const anchorAndPointerDiff = Math.abs(pointerPos.x - anchorPos.x);
    const pointerCloseToAnchor = anchorAndPointerDiff <= guideLineOffset;

    if (pointerCloseToGuide && pointerCloseToAnchor && !isResizedVertically) {
      resultV.push({
        xAbs: lineGuidePos.absolute,
        xRel: lineGuidePos.relative,
        diff: diff,
      });
    }
  });

  lineGuidePositions.horizontal.forEach(lineGuidePos => {
    const diff = Math.abs(lineGuidePos.absolute - pointerPos.y);
    const pointerCloseToGuide = diff <= guideLineOffset;
    const anchorAndPointerDiff = Math.abs(pointerPos.y - anchorPos.y);
    const pointerCloseToAnchor = anchorAndPointerDiff <= guideLineOffset;

    if (pointerCloseToGuide && pointerCloseToAnchor && !isResizedHorizontally) {
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
