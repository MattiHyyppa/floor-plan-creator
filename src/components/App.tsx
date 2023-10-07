import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { type Vector2d } from 'konva/lib/types';
import { Box } from '@chakra-ui/react';

import FullScreen from './FullScreen';
import Door, { type DoorConfig } from './Shapes/Door';
import RectangleHouse, { type RectangleHouseConfig } from './Shapes/RectangleHouse';
import LShapedHouse, { type LShapedHouseConfig } from './Shapes/LShapedHouse';
import Wall, { type WallConfig } from './Shapes/Wall';
import SnappingStage from './SnappingStage';
import Window, { type WindowConfig } from './Shapes/Window';
import { cmToPixels } from '../utils';
import { handleLineGuidesUpdateOnResize } from '../utils/snappingStage';
import { useWindowSize, useAppDispatch, useAppSelector } from '../hooks';
import {
  isDoor,
  isRectangleHouse,
  isLShapedHouse,
  isWall,
  isWindow,
  CustomShapeConfig,
} from '../types';
import { setSelectedShape } from '../redux/slices/selectedIdSlice';
import { setAllShapes, updateShape } from '../redux/slices/canvasSlice';
import SmallScreenAlert from './SmallScreenAlert';
import Menu from './Menu';

const initialDoors = (): DoorConfig[] => {
  return [
    {
      id: uuidv4(),
      x: 20,
      y: 20,
      rotation: 0,
      doorWidth: cmToPixels(80),
      kind: 'exterior',
      openingDirection: 'left',
      wallThickness: cmToPixels(30),
      draggable: false,
    },
    {
      id: uuidv4(),
      x: 80,
      y: 20,
      rotation: 0,
      doorWidth: cmToPixels(80),
      kind: 'exterior',
      openingDirection: 'right',
      wallThickness: cmToPixels(30),
      draggable: true,
    },
    {
      id: uuidv4(),
      x: 140,
      y: 20,
      rotation: 0,
      doorWidth: cmToPixels(80),
      kind: 'interior',
      openingDirection: 'right',
      wallThickness: cmToPixels(12),
      draggable: true,
    },
  ];
};

const initialHouse = (): RectangleHouseConfig => {
  return {
    id: uuidv4(),
    x: 100,
    y: 100,
    rotation: 0,
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
    rotation: 0,
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
      rotation: 0,
      width: cmToPixels(300),
      wallThickness: cmToPixels(12),
      draggable: true,
    }
  ];
};

const initialWindows = (): WindowConfig[] => {
  return [
    {
      id: uuidv4(),
      x: 400,
      y: 150,
      rotation: 0,
      windowWidth: cmToPixels(200),
      wallThickness: cmToPixels(30),
      draggable: false,
    }
  ];
};

const initShapes = (): CustomShapeConfig[] => {
  let shapes: CustomShapeConfig[] = [];

  shapes = shapes.concat(initialDoors());
  shapes = shapes.concat([initialHouse()]);
  shapes = shapes.concat([lShapedHouse()]);
  shapes = shapes.concat(initialWalls());
  shapes = shapes.concat(initialWindows());

  return shapes;
};


const App = (): JSX.Element => {
  const allShapes = useAppSelector((state) => state.canvas.shapes);
  const selectedId = useAppSelector((state) => state.selectedId.value);

  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();
  const menuWidth = Math.min(windowWidth * 0.28, 260);

  const handleLineGuidesOnResize = (node: Konva.Node, anchorPos: Vector2d) => (
    handleLineGuidesUpdateOnResize(node, anchorPos, dispatch)
  );

  // useEffect(() => {
  //   dispatch(setAllShapes(initShapes()));
  // }, [dispatch]);

  if (windowWidth < 700) {
    return <SmallScreenAlert />;
  }

  return (
    <>
      <FullScreen />
      <div id="container" style={{ width: '100%', height: '100%' }}>
        <Box
          position="fixed"
          h="100%"
          w={`${menuWidth}px`}
          zIndex={5000}
          background="gray.100"
          borderRight="1.5px solid var(--chakra-colors-gray-300)"
          overflowY="auto"
        >
          <Menu />
        </Box>
        <SnappingStage
          container="container"
          allShapes={allShapes}
          menuWidth={menuWidth}
        >
          {allShapes.filter(isRectangleHouse).map((house) => (
            <RectangleHouse
              key={house.id}
              isSelected={house.id === selectedId}
              onSelect={() => dispatch(setSelectedShape(house))}
              onChange={(newAttrs) => dispatch(updateShape({ id: house.id, newAttrs }))}
              house={house}
            />
          ))}
          {allShapes.filter(isLShapedHouse).map((house) => (
            <LShapedHouse
              key={house.id}
              isSelected={house.id === selectedId}
              onSelect={() => dispatch(setSelectedShape(house))}
              onChange={(newAttrs) => dispatch(updateShape({ id: house.id, newAttrs }))}
              house={house}
            />
          ))}
          {allShapes.filter(isWall).map((wall) => (
            <Wall
              key={wall.id}
              isSelected={wall.id === selectedId}
              onSelect={() => dispatch(setSelectedShape(wall))}
              onChange={(newAttrs) => dispatch(updateShape({ id: wall.id, newAttrs }))}
              handleLineGuidesOnResize={handleLineGuidesOnResize}
              wall={wall}
            />
          ))}
          {allShapes.filter(isDoor).map((door) => (
            <Door
              key={door.id}
              isSelected={door.id === selectedId}
              onSelect={() => dispatch(setSelectedShape(door))}
              onChange={(newAttrs) => dispatch(updateShape({ id: door.id, newAttrs }))}
              door={door}
            />
          ))}
          {allShapes.filter(isWindow).map(shape => (
            <Window
              key={shape.id}
              isSelected={shape.id === selectedId}
              onSelect={() => dispatch(setSelectedShape(shape))}
              onChange={(newAttrs) => dispatch(updateShape({ id: shape.id, newAttrs }))}
              window={shape}
            />
          ))}
        </SnappingStage>
      </div>
    </>
  );
};

export default App;
