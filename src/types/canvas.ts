import type {
  DoorConfig,
  RectangleHouseConfig,
  LShapedHouseConfig,
  WallConfig,
  WindowConfig,
} from './shapes';

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

export type CanvasUpdate =
  | {
      operation: 'update';
      previous: CustomShapeConfig;
      current: CustomShapeConfig;

      // `shapes[index]` is the shape object that was updated by this canvas operation,
      // where `shapes` has type `CanvasState['shapes']`.
      index: number;
    }
  | {
    operation: 'add';
    current: CustomShapeConfig;
    index: number;  // The shape at this index was added by this canvas operation.
  }
  | {
    operation: 'delete';
    previous: CustomShapeConfig;
    index: number;  // The shape at this index was deleted by this canvas operation.
  };

export interface CanvasState {
  shapes: CustomShapeConfig[];
  previousUpdates: CanvasUpdate[];
  previousUpdatesIndex: number;
}
