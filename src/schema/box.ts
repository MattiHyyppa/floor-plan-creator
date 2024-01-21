import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const boxSchema = object({
  // Required
  id: string().required(),
  shape: string<'box'>().oneOf(['box']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  height: number().positive().required(),

  // Optional
  draggable: boolean(),
});

export default boxSchema;
