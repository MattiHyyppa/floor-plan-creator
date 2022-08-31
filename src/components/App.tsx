import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Door, { type DoorProps } from './shapes/Door';
import RectangleHouse, { type RectangleHouseConfig } from './shapes/RectangleHouse';
import LShapedHouse, { type LShapedHouseConfig } from './shapes/LShapedHouse';
import Wall, { type WallConfig } from './shapes/Wall';
import SnappingStage from './SnappingStage';
import { cmToPixels } from '../utils';
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


const App = (): JSX.Element => {
  const [allShapes, setAllShapes] = useState<CustomShapeConfig[]>(initShapes());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateShape = (id: string, newAttrs: CustomShapeConfig) => {
    setAllShapes(
      allShapes.map((shape) => shape.id === id ? newAttrs : shape)
    );
  };

  return (
    <div id="container">
      <SnappingStage
        container="container"
        allShapes={allShapes}
        setSelectedId={setSelectedId}
        updateShape={updateShape}
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
      </SnappingStage>
    </div>
  );
};

export default App;
