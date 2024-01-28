import type { InferType } from 'yup';

import doorSchema from '../schema/door';
import rectangleHouseSchema from '../schema/rectangleHouse';
import lShapedHouseSchema from '../schema/lShapedHouse';
import wallSchema from '../schema/wall';
import windowSchema from '../schema/window';
import boxSchema from '../schema/box';
import electricApplianceSchema from '../schema/electricAppliance';
import textSchema from '../schema/text';
import sinkSchema from '../schema/sink';
import stoveSchema from '../schema/stove';
import toiletSchema from '../schema/toilet';
import tapeMeasureSchema from '../schema/tapeMeasure';

export type DoorConfig = InferType<typeof doorSchema>;
export type RectangleHouseConfig = InferType<typeof rectangleHouseSchema>;
export type LShapedHouseConfig = InferType<typeof lShapedHouseSchema>;
export type WallConfig = InferType<typeof wallSchema>;
export type WindowConfig = InferType<typeof windowSchema>;
export type BoxConfig = InferType<typeof boxSchema>;
export type ElectricApplianceConfig = InferType<typeof electricApplianceSchema>;
export type TextConfig = InferType<typeof textSchema>;
export type SinkConfig = InferType<typeof sinkSchema>;
export type StoveConfig = InferType<typeof stoveSchema>;
export type ToiletConfig = InferType<typeof toiletSchema>;
export type TapeMeasureConfig = InferType<typeof tapeMeasureSchema>;
