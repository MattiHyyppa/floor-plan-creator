import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const coldApplianceSchema = object({
  id: string().required(),
  shapeName: string<'coldAppliance'>().oneOf(['coldAppliance']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  depth: number().positive().required(),
  draggable: boolean().required(),
});

export default coldApplianceSchema;
