import { InferType } from 'yup';

import doorSchema from '../schema/door';
import rectangleHouseSchema from '../schema/rectangleHouse';
import lShapedHouseSchema from '../schema/lShapedHouse';
import wallSchema from '../schema/wall';
import windowSchema from '../schema/window';

export type DoorConfig = InferType<typeof doorSchema>;
export type RectangleHouseConfig = InferType<typeof rectangleHouseSchema>;
export type LShapedHouseConfig = InferType<typeof lShapedHouseSchema>;
export type WallConfig = InferType<typeof wallSchema>;
export type WindowConfig = InferType<typeof windowSchema>;