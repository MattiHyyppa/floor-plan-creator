import doorSchema from './door';
import rectangleHouseSchema from './rectangleHouse';
import lShapedHouseSchema from './lShapedHouse';
import wallSchema from './wall';
import windowSchema from './window';
import boxSchema from './box';
import electricApplianceSchema from './electricAppliance';
import textSchema from './text';
import sinkSchema from './sink';
import stoveSchema from './stove';
import toiletSchema from './toilet';

export const shapeToSchema = {
  door: doorSchema,
  rectangleHouse: rectangleHouseSchema,
  lShapedHouse: lShapedHouseSchema,
  wall: wallSchema,
  window: windowSchema,
  box: boxSchema,
  electricAppliance: electricApplianceSchema,
  text: textSchema,
  sink: sinkSchema,
  stove: stoveSchema,
  toilet: toiletSchema,
};
