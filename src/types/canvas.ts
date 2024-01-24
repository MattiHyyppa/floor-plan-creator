import type {
  DoorConfig,
  RectangleHouseConfig,
  LShapedHouseConfig,
  WallConfig,
  WindowConfig,
  BoxConfig,
  ColdApplianceConfig,
} from './shapes';

export type CustomShapeConfig =
  | DoorConfig
  | RectangleHouseConfig
  | LShapedHouseConfig
  | WallConfig
  | WindowConfig
  | BoxConfig
  | ColdApplianceConfig;

export const isDoor = (shape: CustomShapeConfig): shape is DoorConfig => {
  return (shape as DoorConfig).shape === 'door';
};

export const isRectangleHouse = (shape: CustomShapeConfig): shape is RectangleHouseConfig => {
  return (shape as RectangleHouseConfig).shape === 'rectangleHouse';
};

export const isLShapedHouse = (shape: CustomShapeConfig): shape is LShapedHouseConfig => {
  return (shape as LShapedHouseConfig).shape === 'lShapedHouse';
};

export const isWall = (shape: CustomShapeConfig): shape is WallConfig => {
  return (shape as WallConfig).shape === 'wall';
};

export const isWindow = (shape: CustomShapeConfig): shape is WindowConfig => {
  return (shape as WindowConfig).shape === 'window';
};

export const isBox = (shape: CustomShapeConfig): shape is BoxConfig => {
  return (shape as BoxConfig).shape === 'box';
};

export const isColdAppliance = (shape: CustomShapeConfig): shape is ColdApplianceConfig => {
  return (shape as ColdApplianceConfig).shape === 'coldAppliance';
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
