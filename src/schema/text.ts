import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const textSchema = object({
  // Required
  id: string().required(),
  shape: string<'text'>().oneOf(['text']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  fontSize: number().required(),
  text: string().required().max(30),

  // Optional
  draggable: boolean(),
});

export default textSchema;
