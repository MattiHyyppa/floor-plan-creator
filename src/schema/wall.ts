import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const wallSchema = object({
  // Required
  id: string().required(),
  shape: string<'wall'>().oneOf(['wall']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  wallThickness: number().positive().required(),

  // Optional
  draggable: boolean(),
});

export default wallSchema;
