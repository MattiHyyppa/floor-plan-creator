import type {
  DoorConfig,
  RectangleHouseConfig,
  LShapedHouseConfig,
  WallConfig,
  WindowConfig,
  BoxConfig,
  ElectricApplianceConfig,
  TextConfig,
  SinkConfig,
  StoveConfig,
  ToiletConfig,
  TapeMeasureConfig,
} from './shapes';

export type CustomShapeConfig =
  | DoorConfig
  | RectangleHouseConfig
  | LShapedHouseConfig
  | WallConfig
  | WindowConfig
  | BoxConfig
  | ElectricApplianceConfig
  | TextConfig
  | SinkConfig
  | StoveConfig
  | ToiletConfig
  | TapeMeasureConfig;

export const isDoor = (shape: CustomShapeConfig): shape is DoorConfig => {
  return (shape as DoorConfig).shapeName === 'door';
};

export const isRectangleHouse = (shape: CustomShapeConfig): shape is RectangleHouseConfig => {
  return (shape as RectangleHouseConfig).shapeName === 'rectangleHouse';
};

export const isLShapedHouse = (shape: CustomShapeConfig): shape is LShapedHouseConfig => {
  return (shape as LShapedHouseConfig).shapeName === 'lShapedHouse';
};

export const isWall = (shape: CustomShapeConfig): shape is WallConfig => {
  return (shape as WallConfig).shapeName === 'wall';
};

export const isWindow = (shape: CustomShapeConfig): shape is WindowConfig => {
  return (shape as WindowConfig).shapeName === 'window';
};

export const isBox = (shape: CustomShapeConfig): shape is BoxConfig => {
  return (shape as BoxConfig).shapeName === 'box';
};

export const isElectricAppliance = (shape: CustomShapeConfig): shape is ElectricApplianceConfig => {
  return (shape as ElectricApplianceConfig).shapeName === 'electricAppliance';
};

export const isText = (shape: CustomShapeConfig): shape is TextConfig => {
  return (shape as TextConfig).shapeName === 'text';
};

export const isSink = (shape: CustomShapeConfig): shape is SinkConfig => {
  return (shape as SinkConfig).shapeName === 'sink';
};

export const isStove = (shape: CustomShapeConfig): shape is StoveConfig => {
  return (shape as StoveConfig).shapeName === 'stove';
};

export const isToilet = (shape: CustomShapeConfig): shape is ToiletConfig => {
  return (shape as ToiletConfig).shapeName === 'toilet';
};

export const isTapeMeasure = (shape: CustomShapeConfig): shape is TapeMeasureConfig => {
  return (shape as TapeMeasureConfig).shapeName === 'tapeMeasure';
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
