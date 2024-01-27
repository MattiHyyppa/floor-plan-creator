import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const lShapedHouseSchema = object({
  id: string().required(),
  shape: string<'lShapedHouse'>().oneOf(['lShapedHouse']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  exteriorWidth: number().positive().required(),
  exteriorHeight: number().positive().required(),
  wallThickness: number().positive().required(),
  firstWingWidth: number().positive().required(),
  secondWingWidth: number().positive().required(),
  draggable: boolean().required(),
});

export default lShapedHouseSchema;
