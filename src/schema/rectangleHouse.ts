import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const rectangleHouseSchema = object({
  // Required
  id: string().required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  exteriorWidth: number().required(),
  exteriorHeight: number().required(),
  wallThickness: number().required(),

  // Optional
  draggable: boolean(),
});

export default rectangleHouseSchema;
