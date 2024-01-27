import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const sinkSchema = object({
  id: string().required(),
  shapeName: string<'sink'>().oneOf(['sink']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default sinkSchema;
