import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const toiletSchema = object({
  id: string().required(),
  shapeName: string<'toilet'>().oneOf(['toilet']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default toiletSchema;
