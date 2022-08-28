import { useState, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import Door from './shapes/Door'
import type { DoorProps } from './shapes/Door';
import RectangleHouse from './shapes/RectangleHouse';
import type { RectangleHouseConfig } from './shapes/RectangleHouse';
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

type KonvaEvent<EventType> = Konva.KonvaEventObject<EventType>;
type SetSelectedIdType = React.Dispatch<React.SetStateAction<string | null>>;

const deselectShape = <EventType,>(e: KonvaEvent<EventType>, setSelectedId: SetSelectedIdType) => {
  const clickedStage = e.target === e.target.getStage();
  if (clickedStage) {
    setSelectedId(null);
  }
};

const App = (): JSX.Element => {
  const [doors, setDoors] = useState<DoorProps[]>([]);
  const [house, setHouse] = useState<RectangleHouseConfig>(initialHouse());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setDoors(initialDoors());
  }, []);

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
          onSelect={() => setSelectedId(house.id || null)}
          onChange={(newAttrs) => setHouse(newAttrs)}
          house={house}
        />
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
