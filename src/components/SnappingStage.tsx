import { useState, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';

import LineGuide from './shapes/LineGuide';
import { type CustomShapeConfig } from '../types';
import { type LineGuideConfig } from './shapes/LineGuide';
import { assertNever } from '../utils';
import {
  getNodeSnappingEdges,
  getLineGuideStops,
  getGuides,
} from '../utils/konva';

export interface SnappingStageConfig {
  allShapes: CustomShapeConfig[];
  children: React.ReactNode;

  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export type SnappingStageProps = SnappingStageConfig & Konva.StageConfig;

const SnappingStage = ({
  allShapes,
  setSelectedId,
  children,
  ...props
}: SnappingStageProps): JSX.Element => {

  const [horizontalLineGuide, setHorizontalLineGuide] = useState<LineGuideConfig | null>(null);
  const [verticalLineGuide, setVerticalLineGuide] = useState<LineGuideConfig | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const removeLineGuides = (): void => {
    setHorizontalLineGuide(null);
    setVerticalLineGuide(null);
  };

  const deselectShape = <EventType,>(
    e: Konva.KonvaEventObject<EventType>,
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const clickedStage = e.target === e.target.getStage();
    if (clickedStage) {
      setSelectedId(null);
    }
  };

  const handleLineGuidesOnMove = (e: Konva.KonvaEventObject<DragEvent>): void => {
    if (!stageRef.current) {
      return;
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
    const lineGuideStops = getLineGuideStops(stageRef.current, movedNode);

    // Get the bounds of the `movedNode`
    const itemBounds = getNodeSnappingEdges(movedNode);

    // Find all line guides which are close enough the `movedNode`.
    const guides = getGuides(lineGuideStops, itemBounds);

    if (!guides.length) {
      // No guides closeby at all
      setHorizontalLineGuide(null);
      setVerticalLineGuide(null);
      return;
    }

    if (!guides.find((guide) => guide.orientation === 'horizontal')) {
      // No horizontal guides but there are vertical ones.
      setHorizontalLineGuide(null);
    }

    if (!guides.find((guide) => guide.orientation === 'vertical')) {
      // No vertical guides but there are horizontal ones.
      setVerticalLineGuide(null);
    }

    const absPos = movedNode.absolutePosition();

    guides.forEach((lg) => {
      switch (lg.orientation) {
      case 'vertical':
        setVerticalLineGuide({ x: lg.lineGuide, direction: 'vertical' });
        absPos.x = lg.lineGuide + lg.offset;
        break;
      case 'horizontal':
        setHorizontalLineGuide({ y: lg.lineGuide, direction: 'horizontal' });
        absPos.y = lg.lineGuide + lg.offset;
        break;
      default:
        assertNever(lg.orientation);
        break;
      }
    });

    // Force the position of the `movedNode` to create the snapping effect
    movedNode.absolutePosition(absPos);
  };

  return (
    <Stage
      ref={stageRef}
      onMouseDown={(e) => deselectShape(e, setSelectedId)}
      onTouchStart={(e) => deselectShape(e, setSelectedId)}
      {...props}
    >
      <Layer
        onDragMove={handleLineGuidesOnMove}
        onDragEnd={(_e) => removeLineGuides()}
      >
        {children}
        {horizontalLineGuide && <LineGuide {...horizontalLineGuide} />}
        {verticalLineGuide && <LineGuide {...verticalLineGuide} />}
      </Layer>
    </Stage>
  );
};

export default SnappingStage;
