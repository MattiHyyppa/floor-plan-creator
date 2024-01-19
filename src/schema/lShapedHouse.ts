import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const lShapedHouseSchema = object({
  // Required
  id: string().required(),
  shape: string<'lShapedHouse'>().oneOf(['lShapedHouse']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  exteriorWidth: number().required(),
  exteriorHeight: number().required(),
  wallThickness: number().required(),
  firstWingWidth: number().required(),
  secondWingWidth: number().required(),

  // Optional
  draggable: boolean(),
});

export default lShapedHouseSchema;
