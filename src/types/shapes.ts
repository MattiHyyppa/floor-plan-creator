import { InferType } from 'yup';

import doorSchema from '../schema/door';
import rectangleHouseSchema from '../schema/rectangleHouse';
import lShapedHouseSchema from '../schema/lShapedHouse';
import wallSchema from '../schema/wall';
import windowSchema from '../schema/window';
import boxSchema from '../schema/box';
import coldApplianceSchema from '../schema/coldAppliance';

export type DoorConfig = InferType<typeof doorSchema>;
export type RectangleHouseConfig = InferType<typeof rectangleHouseSchema>;
export type LShapedHouseConfig = InferType<typeof lShapedHouseSchema>;
export type WallConfig = InferType<typeof wallSchema>;
export type WindowConfig = InferType<typeof windowSchema>;
export type BoxConfig = InferType<typeof boxSchema>;
export type ColdApplianceConfig = InferType<typeof coldApplianceSchema>;
