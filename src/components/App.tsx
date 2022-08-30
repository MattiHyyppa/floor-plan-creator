import { useState, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import Door, { type DoorProps } from './shapes/Door';
import RectangleHouse, { type RectangleHouseConfig } from './shapes/RectangleHouse';
import LShapedHouse, { type LShapedHouseConfig } from './shapes/LShapedHouse';
import Wall, { type WallConfig } from './shapes/Wall';
import LineGuide, { type LineGuideConfig } from './shapes/LineGuide';
import { cmToPixels, assertNever } from '../utils';
import { getLineGuideStops, getNodeSnappingEdges, getGuides } from '../utils/konva';
import {
  isDoor,
  isRectangleHouse,
  isLShapedHouse,
  isWall,
  CustomShapeConfig,
} from '../types';

const initialDoors = (): DoorProps[] => {
  return [
    {
      id: uuidv4(),
      x: 10,
      y: 10,
      doorWidth: cmToPixels(80),
      draggable: true,
    },
  ];
};

const initialHouse = (): RectangleHouseConfig => {
  return {
    id: uuidv4(),
    x: 100,
    y: 100,
    exteriorWidth: cmToPixels(1200),
    exteriorHeight: cmToPixels(1000),
    wallThickness: cmToPixels(30),
    draggable: true,
  };
};

const lShapedHouse = (): LShapedHouseConfig => {
  return {
    id: uuidv4(),
    x: 200,
    y: 200,
    exteriorWidth: cmToPixels(1400),
    exteriorHeight: cmToPixels(1000),
    wallThickness: cmToPixels(30),
    draggable: true,
    firstWingWidth: cmToPixels(500),
    secondWingWidth: cmToPixels(500),
  };
};

const initialWalls = (): WallConfig[] => {
  return [
    {
      id: uuidv4(),
      x: 150,
      y: 150,
      width: cmToPixels(300),
      wallThickness: cmToPixels(12),
      draggable: true,
    }
  ];
};

const initShapes = (): CustomShapeConfig[] => {
  return initialDoors()
    .concat([initialHouse()])
    .concat([lShapedHouse()])
    .concat(initialWalls());
};

type KonvaEvent<EventType> = Konva.KonvaEventObject<EventType>;
type SetSelectedIdType = React.Dispatch<React.SetStateAction<string | null>>;

const deselectShape = <EventType,>(e: KonvaEvent<EventType>, setSelectedId: SetSelectedIdType) => {
  const clickedStage = e.target === e.target.getStage();
  if (clickedStage) {
    setSelectedId(null);
  }
};

const handleLineGuidesOnMove = (
  e: KonvaEvent<DragEvent>,
  stageRef: React.RefObject<Konva.Stage>,
  allShapes: CustomShapeConfig[],
  updateShape: (id: string, newAttrs: CustomShapeConfig) => void,
  setHorizontalLineGuide: React.Dispatch<React.SetStateAction<LineGuideConfig | null>>,
  setVerticalLineGuide: React.Dispatch<React.SetStateAction<LineGuideConfig | null>>
): void => {
  if (!stageRef.current) {
    return;
  }
  const lineGuideStops = getLineGuideStops(stageRef.current, e.target);
  const itemBounds = getNodeSnappingEdges(e.target);
  const guides = getGuides(lineGuideStops, itemBounds, 3);

  if (!guides.length) {
    setHorizontalLineGuide(null);
    setVerticalLineGuide(null);
    return;
  }

  if (!guides.find((guide) => guide.orientation === 'horizontal')) {
    setHorizontalLineGuide(null);
  }

  if (!guides.find((guide) => guide.orientation === 'vertical')) {
    setVerticalLineGuide(null);
  }

  let movedObject = allShapes.find(shape => shape.id === e.target.id());
  if (!movedObject) {
    // It could be that the user has clicked a shape before dragging it and, therefore,
    // the transformer of the shape is the `e.target`. Each custom shape has a
    // transformer whose id is the same as the shape's but appended with a '-transformer'
    // string.
    const possibleTransformerId = e.target.id();
    const shapeId = possibleTransformerId.replace('-transformer', '');
    movedObject = allShapes.find(shape => shape.id === shapeId);

    if (!movedObject) {
      throw new Error('An object that was moved was not found from the state.');
    }
  }

  const absPos = e.target.absolutePosition();

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

  e.target.absolutePosition(absPos);

  const updatedShape = {
    ...movedObject,
    ...absPos,
  };

  updateShape(updatedShape.id, updatedShape);
};

const App = (): JSX.Element => {
  const [allShapes, setAllShapes] = useState<CustomShapeConfig[]>(initShapes());
  const [horizontalLineGuide, setHorizontalLineGuide] = useState<LineGuideConfig | null>(null);
  const [verticalLineGuide, setVerticalLineGuide] = useState<LineGuideConfig | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stageRef = useRef<Konva.Stage>(null);

  const updateShape = (id: string, newAttrs: CustomShapeConfig) => {
    setAllShapes(
      allShapes.map((shape) => shape.id === id ? newAttrs : shape)
    );
  };

  const removeLineGuides = (): void => {
    setHorizontalLineGuide(null);
    setVerticalLineGuide(null);
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => deselectShape(e, setSelectedId)}
      onTouchStart={(e) => deselectShape(e, setSelectedId)}
    >
      <Layer
        onDragMove={(e) => {
          handleLineGuidesOnMove(e, stageRef, allShapes, updateShape, setHorizontalLineGuide, setVerticalLineGuide);
        }}
        onDragEnd={(_e) => removeLineGuides()}
      >
        {allShapes.filter(isRectangleHouse).map((house) => (
          <RectangleHouse
            key={house.id}
            isSelected={house.id === selectedId}
            onSelect={() => setSelectedId(house.id)}
            onChange={(newAttrs) => updateShape(house.id, newAttrs)}
            house={house}
          />
        ))}

        {allShapes.filter(isLShapedHouse).map((house) => (
          <LShapedHouse
            key={house.id}
            isSelected={house.id === selectedId}
            onSelect={() => setSelectedId(house.id)}
            onChange={(newAttrs) => updateShape(house.id, newAttrs)}
            house={house}
          />
        ))}


        {allShapes.filter(isWall).map((wall) => (
          <Wall
            key={wall.id}
            isSelected={wall.id === selectedId}
            onSelect={() => setSelectedId(wall.id)}
            onChange={(newAttrs) => updateShape(wall.id, newAttrs)}
            wall={wall}
          />
        ))}

        {allShapes.filter(isDoor).map((door) => (
          <Door
            key={door.id}
            isSelected={door.id === selectedId}
            onSelect={() => setSelectedId(door.id)}
            onChange={(newAttrs) => updateShape(door.id, newAttrs)}
            {...door}
          />
        ))}

        {horizontalLineGuide && <LineGuide {...horizontalLineGuide} />}
        {verticalLineGuide && <LineGuide {...verticalLineGuide} />}
      </Layer>
    </Stage>
  );
};

export default App;
