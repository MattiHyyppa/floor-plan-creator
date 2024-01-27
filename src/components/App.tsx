import { Box } from '@chakra-ui/react';

import FullScreen from './FullScreen';
import Door from './Shapes/Door';
import RectangleHouse from './Shapes/RectangleHouse';
import LShapedHouse from './Shapes/LShapedHouse';
import Wall, { type WallProps } from './Shapes/Wall';
import SnappingStage from './SnappingStage';
import Window from './Shapes/Window';
import BoxShape from './Shapes/Box';
import ColdAppliance from './Shapes/ColdAppliance';
import Text from './Shapes/Text';
import Sink from './Shapes/Sink';
import { handleLineGuidesUpdateOnResize } from '../utils/snappingStage';
import { useWindowSize, useAppDispatch, useAppSelector } from '../hooks';
import type {
  CustomShapeConfig,
  RectangleHouseConfig,
  LShapedHouseConfig,
  DoorConfig,
  WallConfig,
  WindowConfig,
  BoxConfig,
  ColdApplianceConfig,
  TextConfig,
  SinkConfig,
} from '../types';
import {
  isRectangleHouse,
  isLShapedHouse,
  isDoor,
  isWall,
  isWindow,
  isBox,
  isColdAppliance,
  isText,
  isSink,
} from '../types';
import { setSelectedShape } from '../redux/slices/selectedIdSlice';
import { updateShape } from '../redux/slices/canvasSlice';
import { setActiveTab } from '../redux/slices/menuSlice';
import SmallScreenAlert from './SmallScreenAlert';
import Menu from './Menu';
import type { AppDispatch } from '../redux';


const mapShapeToComponent = (
  shape: CustomShapeConfig,
  selectedId: string | null,
  selectShape: (shape: CustomShapeConfig) => void,
  dispatch: AppDispatch,
) => {

  // Props that are common for all shape components
  const getProps = <T extends CustomShapeConfig,>(s: T) => {
    return {
      isSelected: s.id === selectedId,
      onSelect: () => selectShape(s),
      onChange: (newAttrs: T) => dispatch(updateShape({ id: s.id, newAttrs })),
      shape: s,
      key: s.id,
    };
  };

  // Wall component requires also additional props
  const getWallProps = (s: WallConfig): WallProps => {
    const commonProps = getProps(s);
    return {
      ...commonProps,
      handleLineGuidesOnResize: (node, anchorPos) => handleLineGuidesUpdateOnResize(node, anchorPos, dispatch),
    };
  };

  // An object with different shape names as keys. Each value is a function that returns the
  // shape component corresponding to the correct shape name.
  const options = {
    rectangleHouse: () => <RectangleHouse {...getProps(shape as RectangleHouseConfig)} />,
    lShapedHouse: () => <LShapedHouse {...getProps(shape as LShapedHouseConfig)} />,
    door: () => <Door {...getProps(shape as DoorConfig)} />,
    wall: () => <Wall {...getWallProps(shape as WallConfig)} />,
    window: () => <Window {...getProps(shape as WindowConfig)} />,
    box: () => <BoxShape {...getProps(shape as BoxConfig)} />,
    coldAppliance: () => <ColdAppliance {...getProps(shape as ColdApplianceConfig)} />,
    text: () => <Text {...getProps(shape as TextConfig)} />,
    sink: () => <Sink {...getProps(shape as SinkConfig)} />,
  };

  return options[shape.shapeName];
};


const predicatesInDrawingOrder = [
  isRectangleHouse,
  isLShapedHouse,
  isWall,
  isWindow,
  isDoor,
  isBox,
  isColdAppliance,
  isText,
  isSink,
];


const App = (): JSX.Element => {
  const allShapes = useAppSelector((state) => state.canvas.shapes);
  const selectedId = useAppSelector((state) => state.selectedId.value);

  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();
  const menuWidth = Math.min(windowWidth * 0.28, 260);

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
          {predicatesInDrawingOrder.flatMap((predicate) => {
            return (
              allShapes.filter(predicate).map(shape => {
                const getShapeComponent = mapShapeToComponent(shape, selectedId, selectShape, dispatch);
                return getShapeComponent();
              })
            );
          })}
        </SnappingStage>
      </div>
    </>
  );
};

export default App;
