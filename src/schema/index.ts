import doorSchema from './door';
import rectangleHouseSchema from './rectangleHouse';
import lShapedHouseSchema from './lShapedHouse';
import wallSchema from './wall';
import windowSchema from './window';
import boxSchema from './box';
import coldApplianceSchema from './coldAppliance';
import textSchema from './text';

export const shapeToSchema = {
  door: doorSchema,
  rectangleHouse: rectangleHouseSchema,
  lShapedHouse: lShapedHouseSchema,
  wall: wallSchema,
  window: windowSchema,
  box: boxSchema,
  coldAppliance: coldApplianceSchema,
  text: textSchema,
};
