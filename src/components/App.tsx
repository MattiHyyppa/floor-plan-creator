import Konva from 'konva';
import { type Vector2d } from 'konva/lib/types';
import { Box } from '@chakra-ui/react';

import FullScreen from './FullScreen';
import Door from './Shapes/Door';
import RectangleHouse from './Shapes/RectangleHouse';
import LShapedHouse from './Shapes/LShapedHouse';
import Wall from './Shapes/Wall';
import SnappingStage from './SnappingStage';
import Window from './Shapes/Window';
import BoxShape from './Shapes/Box';
import { handleLineGuidesUpdateOnResize } from '../utils/snappingStage';
import { useWindowSize, useAppDispatch, useAppSelector } from '../hooks';
import {
  isDoor,
  isRectangleHouse,
  isLShapedHouse,
  isWall,
  isWindow,
  isBox,
} from '../types';
import type { CustomShapeConfig } from '../types';
import { setSelectedShape } from '../redux/slices/selectedIdSlice';
import { updateShape } from '../redux/slices/canvasSlice';
import { setActiveTab } from '../redux/slices/menuSlice';
import SmallScreenAlert from './SmallScreenAlert';
import Menu from './Menu';

const App = (): JSX.Element => {
  const allShapes = useAppSelector((state) => state.canvas.shapes);
  const selectedId = useAppSelector((state) => state.selectedId.value);

  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();
  const menuWidth = Math.min(windowWidth * 0.28, 260);

  const handleLineGuidesOnResize = (node: Konva.Node, anchorPos: Vector2d) => (
    handleLineGuidesUpdateOnResize(node, anchorPos, dispatch)
  );

  const selectShape = (shape: CustomShapeConfig) => {
    dispatch(setSelectedShape(shape));
    dispatch(setActiveTab(1));
  };

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
              onSelect={() => selectShape(house)}
              onChange={(newAttrs) => dispatch(updateShape({ id: house.id, newAttrs }))}
              house={house}
            />
          ))}
          {allShapes.filter(isLShapedHouse).map((house) => (
            <LShapedHouse
              key={house.id}
              isSelected={house.id === selectedId}
              onSelect={() => selectShape(house)}
              onChange={(newAttrs) => dispatch(updateShape({ id: house.id, newAttrs }))}
              house={house}
            />
          ))}
          {allShapes.filter(isWall).map((wall) => (
            <Wall
              key={wall.id}
              isSelected={wall.id === selectedId}
              onSelect={() => selectShape(wall)}
              onChange={(newAttrs) => dispatch(updateShape({ id: wall.id, newAttrs }))}
              handleLineGuidesOnResize={handleLineGuidesOnResize}
              wall={wall}
            />
          ))}
          {allShapes.filter(isDoor).map((door) => (
            <Door
              key={door.id}
              isSelected={door.id === selectedId}
              onSelect={() => selectShape(door)}
              onChange={(newAttrs) => dispatch(updateShape({ id: door.id, newAttrs }))}
              door={door}
            />
          ))}
          {allShapes.filter(isWindow).map(shape => (
            <Window
              key={shape.id}
              isSelected={shape.id === selectedId}
              onSelect={() => selectShape(shape)}
              onChange={(newAttrs) => dispatch(updateShape({ id: shape.id, newAttrs }))}
              window={shape}
            />
          ))}
          {allShapes.filter(isBox).map(shape => (
            <BoxShape
              key={shape.id}
              isSelected={shape.id === selectedId}
              onSelect={() => selectShape(shape)}
              onChange={(newAttrs) => dispatch(updateShape({ id: shape.id, newAttrs }))}
              box={shape}
            />
          ))}
        </SnappingStage>
      </div>
    </>
  );
};

export default App;
