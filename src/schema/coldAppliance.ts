import {
  object,
  string,
  number,
  boolean,
} from 'yup';

const coldApplianceSchema = object({
  // Required
  id: string().required(),
  shape: string<'coldAppliance'>().oneOf(['coldAppliance']).required(),
  x: number().required(),
  y: number().required(),
  rotation: number().required(),
  width: number().positive().required(),
  height: number().positive().required(),

  // Optional
  draggable: boolean(),
});

export default coldApplianceSchema;
