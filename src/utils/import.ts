import { setAllShapes } from '../redux/slices/canvasSlice';
import type { CustomShapeConfig } from '../types';
import type { AppDispatch } from '../redux';
import { shapeToSchema } from '../schema';

export const loadShapesFromFile = async (fileContent: string, dispatch: AppDispatch): Promise<{ status: 'success' | 'error' }> => {
  const validatedShapes = await validateShapesJSON(JSON.parse(fileContent));
  if (!validatedShapes) {
    return { status: 'error' };
  }
  dispatch(setAllShapes(validatedShapes));
  return { status: 'success' };
};


export const validateShapesJSON = async (data: unknown): Promise<CustomShapeConfig[] | null> => {
  if (!Array.isArray(data)) {
    console.log('The JSON data is not an array');
    return null;
  }

  const validatedData: CustomShapeConfig[] = [];

  for (const shape of data) {
    if ((typeof shape !== 'object') || !('shapeName' in shape) || (typeof shape['shapeName'] !== 'string')) {
      console.log('The shape', shape, 'is not formatted correctly');
      return null;
    }

    const shapeName = shape['shapeName'];
    if (!(shapeName in shapeToSchema)) {
      console.log('Validation schema could not be found for shape', shape);
      return null;
    }

    const name = shapeName as keyof typeof shapeToSchema;
    const schema = shapeToSchema[name];

    try {
      const validatedShape = await schema.validate(shape, { stripUnknown: true });
      validatedData.push(validatedShape);
    } catch (error) {
      console.log('Validation error occurred when trying to validate shape', shape);
      console.log(error);
      return null;
    }
  }

  // Check that IDs are unique in the `validatedData`
  const idArray = validatedData.map(shape => shape.id);
  const idSet = new Set(idArray);

  if (idSet.size < idArray.length) {
    console.log('The IDs of the shapes were not unique');
    return null;
  }

  return validatedData;
};
