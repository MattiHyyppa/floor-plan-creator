import {
  object,
  string,
  number,
  boolean,
  mixed,
} from 'yup';

const doorKinds = ['interior', 'exterior'] as const;
type DoorKind = typeof doorKinds[number];

const openingDirections = ['right', 'left'] as const;
type OpeningDirection = typeof openingDirections[number];

const doorSchema = object({
  // Required
  id: string().required(),
  shape: string<'door'>().oneOf(['door']).required(),
  x: number().required(),
  y: number().required(),
  doorWidth: number().required(),
  rotation: number().required(),
  wallThickness: number().required(),
  kind: mixed<DoorKind>().oneOf(doorKinds).required(),
  openingDirection: mixed<OpeningDirection>().oneOf(openingDirections).required(),

  // Optional
  draggable: boolean(),
});

export default doorSchema;
