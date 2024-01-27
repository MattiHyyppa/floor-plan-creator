import {
  object,
  string,
  number,
  boolean,
  mixed,
} from 'yup';

const doorKinds = ['interior', 'exterior'] as const;
type DoorKind = typeof doorKinds[number];

export const isDoorKind = (value: unknown): value is DoorKind => {
  return doorKinds.includes(value as DoorKind);
};

const openingDirections = ['right', 'left'] as const;
type OpeningDirection = typeof openingDirections[number];

export const isOpeningDirection = (value: unknown): value is OpeningDirection => {
  return openingDirections.includes(value as OpeningDirection);
};

const doorSchema = object({
  id: string().required(),
  shape: string<'door'>().oneOf(['door']).required(),
  x: number().positive().required(),
  y: number().positive().required(),
  doorWidth: number().positive().required(),
  rotation: number().required(),
  wallThickness: number().positive().required(),
  kind: mixed<DoorKind>().oneOf(doorKinds).required(),
  openingDirection: mixed<OpeningDirection>().oneOf(openingDirections).required(),
  draggable: boolean().required(),
});

export default doorSchema;
