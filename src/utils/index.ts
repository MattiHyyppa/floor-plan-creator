export const degToRadians = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const radiansToDeg = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * A utility function for converting centimeters to pixels. The conversion is completely made up
 * and the idea is to make the initial sizes of the shapes look good without having the zoom in
 * or out the canvas.
 * @param cm A number representing a distance in centimeters.
 * @returns A number representing the same distance in pixels.
 */
export const cmToPixels = (cm: number): number => {
  return cm / 2;
};

export const almostEqual = (a: number, b: number, epsilon: number = 1e-6): boolean => {
  return Math.abs(a - b) < epsilon;
};
