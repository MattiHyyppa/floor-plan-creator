import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const windowSchema = object({
  // Required
  id: string().required(),
  shape: string<'window'>().oneOf(['window']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  windowWidth: number().required(),
  wallThickness: number().required(),

  // Optional
  draggable: boolean(),
});

export default windowSchema;
