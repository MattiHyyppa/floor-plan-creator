import { useState, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import Door, { type DoorProps } from './shapes/Door'
import RectangleHouse, { type RectangleHouseConfig } from './shapes/RectangleHouse';
import LShapedHouse, { type LShapedHouseConfig } from './shapes/LShapedHouse';
import Wall, { type WallConfig } from './shapes/Wall';
import { cmToPixels } from '../utils';

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

type KonvaEvent<EventType> = Konva.KonvaEventObject<EventType>;
type SetSelectedIdType = React.Dispatch<React.SetStateAction<string | null>>;

const deselectShape = <EventType,>(e: KonvaEvent<EventType>, setSelectedId: SetSelectedIdType) => {
  const clickedStage = e.target === e.target.getStage();
  if (clickedStage) {
    setSelectedId(null);
  }
};

const App = (): JSX.Element => {
  const [doors, setDoors] = useState<DoorProps[]>(initialDoors());
  const [house, setHouse] = useState<RectangleHouseConfig>(initialHouse());
  const [lHouse, setLHouse] = useState<LShapedHouseConfig>(lShapedHouse());
  const [walls, setWalls] = useState<WallConfig[]>(initialWalls());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => deselectShape(e, setSelectedId)}
      onTouchStart={(e) => deselectShape(e, setSelectedId)}
    >
      <Layer>
        <RectangleHouse
          isSelected={house.id === selectedId}
          onSelect={() => setSelectedId(house.id)}
          onChange={(newAttrs) => setHouse(newAttrs)}
          house={house}
        />
        <LShapedHouse
          isSelected={lHouse.id === selectedId}
          onSelect={() => setSelectedId(lHouse.id)}
          onChange={(newAttrs) => setLHouse(newAttrs)}
          house={lHouse}
        />
        {walls.map((wall, i) => (
          <Wall
            key={wall.id}
            isSelected={wall.id === selectedId}
            onSelect={() => setSelectedId(wall.id)}
            onChange={(newAttrs) => {
              const wallsCopy = walls.slice();
              wallsCopy[i] = newAttrs;
              setWalls(wallsCopy);
            }}
            wall={wall}
          />
        ))}
        {doors.map((door, i) => (
          <Door
            key={door.id}
            isSelected={door.id === selectedId}
            onSelect={() => setSelectedId(door.id || null)}
            onChange={(newAttrs) => {
              const doorsCopy = doors.slice();
              doorsCopy[i] = newAttrs;
              setDoors(doorsCopy);
            }}
            {...door}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default App;
