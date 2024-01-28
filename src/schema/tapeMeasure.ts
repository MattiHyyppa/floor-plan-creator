import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const tapeMeasureSchema = object({
  id: string().required(),
  shapeName: string<'tapeMeasure'>().oneOf(['tapeMeasure']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  draggable: boolean().required(),
});

export default tapeMeasureSchema;
