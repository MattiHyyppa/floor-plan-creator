import { type DoorConfig } from './components/Shapes/Door';
import { type RectangleHouseConfig } from './components/Shapes/RectangleHouse';
import { type LShapedHouseConfig } from './components/Shapes/LShapedHouse';
import { type WallConfig } from './components/Shapes/Wall';
import { type WindowConfig } from './components/Shapes/Window';

export type CustomShapeConfig = DoorConfig | RectangleHouseConfig | LShapedHouseConfig | WallConfig | WindowConfig;

export const isDoor = (shape: CustomShapeConfig): shape is DoorConfig => {
  return (shape as DoorConfig).doorWidth !== undefined;
};

export const isRectangleHouse = (shape: CustomShapeConfig): shape is RectangleHouseConfig => {
  return (shape as RectangleHouseConfig).exteriorWidth !== undefined && !isLShapedHouse(shape);
};

export const isLShapedHouse = (shape: CustomShapeConfig): shape is LShapedHouseConfig => {
  return (shape as LShapedHouseConfig).firstWingWidth !== undefined;
};

export const isWall = (shape: CustomShapeConfig): shape is WallConfig => {
  return (shape as WallConfig).wallThickness !== undefined &&
    !('exteriorWidth' in shape) && !('doorWidth' in shape) && !('windowWidth' in shape);
};

export const isWindow = (shape: CustomShapeConfig): shape is WindowConfig => {
  return (shape as WindowConfig).windowWidth !== undefined;
};
