import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const wallSchema = object({
  id: string().required(),
  shape: string<'wall'>().oneOf(['wall']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  wallThickness: number().positive().required(),
  draggable: boolean().required(),
});

export default wallSchema;
