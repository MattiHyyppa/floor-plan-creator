import doorSchema from '../schema/door';
import rectangleHouseSchema from '../schema/rectangleHouse';
import lShapedHouseSchema from '../schema/lShapedHouse';
import wallSchema from '../schema/wall';
import windowSchema from '../schema/window';
import { setAllShapes } from '../redux/slices/canvasSlice';
import type { CustomShapeConfig } from '../types';
import type { AppDispatch } from '../redux';


const shapeToSchema = {
  door: doorSchema,
  rectangleHouse: rectangleHouseSchema,
  lShapedHouse: lShapedHouseSchema,
  wall: wallSchema,
  window: windowSchema,
};


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
    console.log('An error occurred when validating shapes from a JSON file');
    return null;
  }

  const validatedData: CustomShapeConfig[] = [];

  for (const shape of data) {
    if ((typeof shape !== 'object') || !('shape' in shape) || (typeof shape['shape'] !== 'string')) {
      console.log('An error occurred when validating shapes from a JSON file');
      return null;
    }

    const shapeName = shape['shape'];
    if (!(shapeName in shapeToSchema)) {
      console.log('An error occurred when validating shapes from a JSON file');
      return null;
    }

    const name = shapeName as keyof typeof shapeToSchema;
    const schema = shapeToSchema[name];

    try {
      const validatedShape = await schema.validate(shape, { stripUnknown: true });
      validatedData.push(validatedShape);
    } catch (error) {
      console.log('An error occurred when validating shapes from a JSON file');
      console.log(error);
      return null;
    }
  }

  // Check that IDs are unique in the `validatedData`
  const idArray = validatedData.map(shape => shape.id);
  const idSet = new Set(idArray);

  if (idSet.size < idArray.length) {
    console.log('An error occurred when validating shapes from a JSON file');
    return null;
  }

  return validatedData;
};
