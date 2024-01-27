import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const rectangleHouseSchema = object({
  id: string().required(),
  shapeName: string<'rectangleHouse'>().oneOf(['rectangleHouse']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  exteriorWidth: number().positive().required(),
  exteriorHeight: number().positive().required(),
  wallThickness: number().positive().required(),
  draggable: boolean().required(),
});

export default rectangleHouseSchema;
