import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const stoveSchema = object({
  id: string().required(),
  shapeName: string<'stove'>().oneOf(['stove']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default stoveSchema;
