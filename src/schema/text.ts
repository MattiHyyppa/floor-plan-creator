import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const textSchema = object({
  id: string().required(),
  shapeName: string<'text'>().oneOf(['text']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  fontSize: number().required(),
  text: string().required().max(30),
  draggable: boolean().required(),
});

export default textSchema;
