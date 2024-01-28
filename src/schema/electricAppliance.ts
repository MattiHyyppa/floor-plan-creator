import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const electricApplianceSchema = object({
  id: string().required(),
  shapeName: string<'electricAppliance'>().oneOf(['electricAppliance']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default electricApplianceSchema;
