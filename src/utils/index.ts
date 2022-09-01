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

export const almostEqual = (a: number, b: number, epsilon = 1e-6): boolean => {
  return Math.abs(a - b) < epsilon;
};

export const almostDivisibleBy = (dividend: number, divisor: number, epsilon = 1e-6): boolean => {
  const absMod = Math.abs(dividend % divisor);
  // `absMod` could be something like 0.0000001 or `divisor - 0.0000001`
  return almostEqual(absMod, 0, epsilon) || almostEqual(absMod - divisor, 0, epsilon);
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Exhaustive type checking not done for value: ${JSON.stringify(value)}`
  );
};
