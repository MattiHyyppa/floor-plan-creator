import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const coldApplianceSchema = object({
  id: string().required(),
  shape: string<'coldAppliance'>().oneOf(['coldAppliance']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  height: number().positive().required(),
  draggable: boolean().required(),
});

export default coldApplianceSchema;
