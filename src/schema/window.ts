import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const windowSchema = object({
  id: string().required(),
  shapeName: string<'window'>().oneOf(['window']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  windowWidth: number().positive().required(),
  wallThickness: number().positive().required(),
  draggable: boolean().required(),
});

export default windowSchema;
