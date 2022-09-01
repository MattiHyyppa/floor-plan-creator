import { type DoorProps } from './components/shapes/Door';
import { type RectangleHouseConfig } from './components/shapes/RectangleHouse';
import { type LShapedHouseConfig } from './components/shapes/LShapedHouse';
import { type WallConfig } from './components/shapes/Wall';

export type CustomShapeConfig = DoorProps | RectangleHouseConfig | LShapedHouseConfig | WallConfig;

export const isDoor = (shape: CustomShapeConfig): shape is DoorProps => {
  return (shape as DoorProps).doorWidth !== undefined;
};

export const isRectangleHouse = (shape: CustomShapeConfig): shape is RectangleHouseConfig => {
  return (shape as RectangleHouseConfig).exteriorWidth !== undefined && !isLShapedHouse(shape);
};

export const isLShapedHouse = (shape: CustomShapeConfig): shape is LShapedHouseConfig => {
  return (shape as LShapedHouseConfig).firstWingWidth !== undefined;
};

export const isWall = (shape: CustomShapeConfig): shape is WallConfig => {
  return (shape as WallConfig).wallThickness !== undefined &&
    !('exteriorWidth' in shape) && !('doorWidth' in shape);
};
