import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const boxSchema = object({
  id: string().required(),
  shapeName: string<'box'>().oneOf(['box']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default boxSchema;
