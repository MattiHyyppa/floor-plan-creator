export * from './canvas';
export * from './menu';

// Konva doesn't export the Box type so we need to define it manually
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
