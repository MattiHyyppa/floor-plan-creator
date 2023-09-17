import Konva from 'konva';

import theme from './shapeTheme';
import { almostDivisibleBy, degToRadians, almostEqual } from '.';

export interface ItemBound {
  absPos: number;
  absoluteOffset: number;
  snap: 'start' | 'end';
}

export interface NodeSnappingEdges {
  vertical: ItemBound[];
  horizontal: ItemBound[];
}

export interface LineGuidePositions {
  vertical: Array<{ absolute: number, relative: number }>;
  horizontal: Array<{ absolute: number, relative: number }>;
}

export interface LineGuide {
  absPos: number;
  relativePos: number;
  offset: number;
  snap: 'start' | 'end';
  diff: number;
  orientation: 'vertical' | 'horizontal';
}

/**
 * Get all points of the `node` which can trigger the snapping effect.
 * @param node A `Konva.Node` object on the canvas.
 * @returns Returns both vertical and horizontal points of the `node` that can
 *   trigger snapping.
 */
export const getNodeSnappingEdges = (node: Konva.Node): NodeSnappingEdges => {
  const stage = node.getStage();
  if (!stage) {
    throw new Error('The transformed node doesn\'t have a stage');
  }
  const scale = stage.scaleX();
  const absoluteBox = node.getClientRect();

  /*
  We want to adjust the width and height by subtracting `theme.strokeWidth` to make sure
  the shapes will be snapped such that their strokes are on top of each other when the user
  drags a shape close to another one. Otherwise, there would be a duplicate stroke between
  the shapes.
  */
  absoluteBox.width -= theme.strokeWidth * scale;
  absoluteBox.height -= theme.strokeWidth * scale;

  const absPos = node.absolutePosition();

  // Similarly, as in the `getLineGuideStops` function, we can snap over the edges of
  // each object on the canvas
  return {
    vertical: [
      {
        absPos: absoluteBox.x,
        absoluteOffset: absPos.x - absoluteBox.x,
        snap: 'start',
      },
      {
        absPos: absoluteBox.x + absoluteBox.width,
        absoluteOffset: absPos.x - absoluteBox.x - absoluteBox.width,
        snap: 'end',
      },
    ],
    horizontal: [
      {
        absPos: absoluteBox.y,
        absoluteOffset: absPos.y - absoluteBox.y,
        snap: 'start',
      },
      {
        absPos: absoluteBox.y + absoluteBox.height,
        absoluteOffset: absPos.y - absoluteBox.y - absoluteBox.height,
        snap: 'end',
      },
    ],
  };
};

/**
 * Get all x and y values that could trigger the snapping effect for all `Konva.Node` objects
 * on the canvas which have the `name` prop set to `object`. The `skipShape` node is ignored
 * and not included in the return value.
 * @param stage The `Konva.Stage` object onto which all layers have been drawn.
 * @param skipShape The node to be skipped in the search of possible line guide positions.
 *   This helps preventing snapping the moving object to the object itself.
 * @returns An object containing an array of possible line guide positions for both vertical
 *   and horizontal directions.
 */
export const getLineGuidePositions = (stage: Konva.Stage, skipShape: Konva.Node): LineGuidePositions => {
  const vertical: Array<{ absolute: number, relative: number }> = [];
  const horizontal: Array<{ absolute: number, relative: number }> = [];

  stage.find('.object').forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relBox = guideItem.getClientRect({ relativeTo: stage as any });
    const absBox = guideItem.getClientRect();
    const scale = stage.scaleX();

    absBox.width -= theme.strokeWidth * scale;
    absBox.height -= theme.strokeWidth * scale;

    // We can snap over the edges of each object on the canvas
    vertical.push(...[
      { absolute: absBox.x, relative: relBox.x },
      { absolute: absBox.x + absBox.width, relative: relBox.x + relBox.width }
    ]);
    horizontal.push(...[
      { absolute: absBox.y, relative: relBox.y },
      { absolute: absBox.y + absBox.height, relative: relBox.y + relBox.height }
    ]);

    // In addition to the exterior bounds, we can snap to the interior bounds
    // when the `guideItem` node represents a house. For simplicity, we add
    // the line guides for the interior side of the exterior walls only when
    // the rotation is divisible by 90.

    const isHouseNode = ('wallThickness' in guideItem.attrs)
      && ('exteriorWidth' in guideItem.attrs)
      && ('exteriorHeight' in guideItem.attrs);

    if (!isHouseNode || !almostDivisibleBy(guideItem.rotation(), 90)) {
      return;
    }

    const wallThickness = guideItem.getAttr('wallThickness') as number;
    const scaledWallThickness = wallThickness * scale;

    vertical.push(...[
      { absolute: absBox.x + scaledWallThickness, relative: relBox.x + wallThickness },
      { absolute: absBox.x + absBox.width - scaledWallThickness, relative: relBox.x + relBox.width - wallThickness }
    ]);

    horizontal.push(...[
      { absolute: absBox.y + scaledWallThickness, relative: relBox.y + wallThickness },
      { absolute: absBox.y + absBox.height - scaledWallThickness, relative: relBox.y + relBox.height - wallThickness }
    ]);

    // In addition to the added interior bounds, there are more interior bounds
    // to be added in the case of an L-shaped house. Of all the interior sides of
    // the exterior walls, there is one vertical and one horizontal bound still missing.
    // The corresponding exterior sides of the same two walls are also missing.

    // We already know at this point that the node is a house so let's just check the
    // L-shaped house specific properties
    const isLShapedHouse = ('firstWingWidth' in guideItem.attrs) &&
      ('secondWingWidth' in guideItem.attrs);

    if (!isLShapedHouse) {
      return;
    }

    const firstWingWidth = guideItem.getAttr('firstWingWidth') as number;
    const secondWingWidth = guideItem.getAttr('secondWingWidth') as number;
    const scaledWidth1 = firstWingWidth * scale;
    const scaledWidth2 = secondWingWidth * scale;

    const rotationRad = degToRadians(guideItem.rotation());
    const sin = Math.sin(rotationRad);
    const cos = Math.cos(rotationRad);

    // As in the case of the other interior walls, we only add line guides when the
    // rotation is (almost) divisible by 90 degrees. Let's check the 4 possible cases.

    // rotation is (almost) 0, 360, -360 or similar
    if (almostEqual(cos, 1) && almostEqual(sin, 0)) {
      // These values can be determined from the illustration in the
      // project-dir/src/components/shapes/LShapedHouse.tsx file. Note that the angles
      // work differently in Konva than in mathematics in the sense that rotating the shape
      // clockwise makes its rotation angle larger, not smaller, and vice versa.
      vertical.push(...[
        {
          absolute: absBox.x + scaledWidth2 - scaledWallThickness,
          relative: relBox.x + secondWingWidth - wallThickness
        },
        {
          absolute: absBox.x + scaledWidth2,
          relative: relBox.x + secondWingWidth
        }
      ]);
      horizontal.push(...[
        {
          absolute: absBox.y + absBox.height - scaledWidth1 + scaledWallThickness,
          relative: relBox.y + relBox.height - firstWingWidth + wallThickness
        },
        {
          absolute: absBox.y + absBox.height - scaledWidth1,
          relative: relBox.y + relBox.height - firstWingWidth
        },
      ]);
    }

    // rotation is (almost) 90, -270 or similar
    else if (almostEqual(cos, 0) && almostEqual(sin, 1)) {
      vertical.push(...[
        {
          absolute: absBox.x + scaledWidth1 - scaledWallThickness,
          relative: relBox.x + firstWingWidth - wallThickness
        },
        {
          absolute: absBox.x + scaledWidth1,
          relative: relBox.x + firstWingWidth
        }
      ]);
      horizontal.push(...[
        {
          absolute: absBox.y + scaledWidth2 - scaledWallThickness,
          relative: relBox.y + secondWingWidth - wallThickness
        },
        {
          absolute: absBox.y + scaledWidth2,
          relative: relBox.y + secondWingWidth
        }
      ]);
    }

    // rotation is (almost) 180, -180 or similar
    else if (almostEqual(cos, -1) && almostEqual(sin, 0)) {
      vertical.push(...[
        {
          absolute: absBox.x + absBox.width - scaledWidth2 + scaledWallThickness,
          relative: relBox.x + relBox.width - secondWingWidth + wallThickness,
        },
        {
          absolute: absBox.x + absBox.width - scaledWidth2,
          relative: relBox.x + relBox.width - secondWingWidth,
        },
      ]);
      horizontal.push(...[
        {
          absolute: absBox.y + scaledWidth1 - scaledWallThickness,
          relative: relBox.y + firstWingWidth - wallThickness,
        },
        {
          absolute: absBox.y + scaledWidth1,
          relative: relBox.y + firstWingWidth,
        }
      ]);
    }

    // rotation is (almost) 270, -90 or similar
    else if (almostEqual(cos, 0) && almostEqual(sin, -1)) {
      vertical.push(...[
        {
          absolute: absBox.x + absBox.width - scaledWidth1 + scaledWallThickness,
          relative: relBox.x + relBox.width - firstWingWidth + wallThickness,
        },
        {
          absolute: absBox.x + absBox.width - scaledWidth1,
          relative: relBox.x + relBox.width - firstWingWidth,
        },
      ]);
      horizontal.push(...[
        {
          absolute: absBox.y + absBox.height - scaledWidth2 + scaledWallThickness,
          relative: relBox.y + relBox.height - secondWingWidth + wallThickness,
        },
        {
          absolute: absBox.y + absBox.height - scaledWidth2,
          relative: relBox.y + relBox.height - secondWingWidth,
        },
      ]);
    }
  });

  return {
    vertical,
    horizontal,
  };
};

/**
 * From all possible line guide positions for the snapping effect, find at most one vertical
 * and at most one horizontal line guide which are actually close enough the moving node to
 * be snapped to.
 * @param lineGuidePositions The points of the other nodes on the canvas that can trigger snapping.
 * @param itemBounds The bounds of the currently considered node the can trigger snapping.
 * @param guideLineOffset How many pixels is close enough for the snapping to take place.
 * @returns At most one vertical and at most one horizontal line guide which are close enough the
 * moving node for the snapping to take place. The returned line guides have minimal distance to
 * the currently considered node with the `itemBounds` bounds.
 */
export const getGuides = (
  lineGuidePositions: LineGuidePositions,
  itemBounds: NodeSnappingEdges,
  guideLineOffset = 5
): LineGuide[] => {
  const resultV: LineGuide[] = [];
  const resultH: LineGuide[] = [];

  lineGuidePositions.vertical.forEach((lineGuidePos) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuidePos.absolute - itemBound.absPos);
      if (diff <= guideLineOffset) {
        resultV.push({
          absPos: lineGuidePos.absolute,       // The absolute position of the line guide
          relativePos: lineGuidePos.relative,  // The relative position of the line guide
          diff,                                // The distance between the line guide and the object
          snap: itemBound.snap,                // Did the START or END of the object trigger snapping
          // How much we need to offset the object from the line guide. This is important,
          // especially, when the end of the object triggered snapping and we don't want to
          // snap the top-left corner of the object to the line guide but instead the end of
          // the object.
          offset: itemBound.absoluteOffset,
          // The line guide has vertical direction meaning that `absPos` and `relativePos`
          // determine the x value of the line
          orientation: 'vertical',
        });
      }
    });
  });

  lineGuidePositions.horizontal.forEach((lineGuidePos) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuidePos.absolute - itemBound.absPos);
      if (diff <= guideLineOffset) {
        resultH.push({
          absPos: lineGuidePos.absolute,
          relativePos: lineGuidePos.relative,
          diff,
          snap: itemBound.snap,
          offset: itemBound.absoluteOffset,
          orientation: 'horizontal',
        });
      }
    });
  });

  const guides: LineGuide[] = [];

  // Find line guides with minimal distance for both directions
  const minV = resultV.sort((a, b) => a.diff - b.diff);
  const minH = resultH.sort((a, b) => a.diff - b.diff);

  if (minV.length > 0) {
    guides.push(minV[0]);
  }
  if (minH.length > 0) {
    guides.push(minH[0]);
  }

  return guides;
};

export const isNodeBeingResized = (node: Konva.Node): boolean => {
  return !almostEqual(node.scaleX(), 1) || !almostEqual(node.scaleY(), 1);
};

export const isNodeBeingResizedVertically = (node: Konva.Node): boolean => {
  if (!isNodeBeingResized(node)) {
    return false;
  }

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  const widthResized = !almostEqual(scaleX, 1) && almostEqual(scaleY, 1);
  const heightResized = almostEqual(scaleX, 1) && !almostEqual(scaleY, 1);

  // Rotation between [0, 360[
  const rotation = ((node.rotation() % 360) + 360) % 360;

  const isResizedVertically = ( (almostEqual(rotation, 0) || almostEqual(rotation, 180)) && heightResized ) ||
    ( (almostEqual(rotation, 90) || almostEqual(rotation, 270)) && widthResized );

  return isResizedVertically;
};

export const isNodeBeingResizedHorizontally = (node: Konva.Node): boolean => {
  if (!isNodeBeingResized(node)) {
    return false;
  }

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  const widthResized = !almostEqual(scaleX, 1) && almostEqual(scaleY, 1);
  const heightResized = almostEqual(scaleX, 1) && !almostEqual(scaleY, 1);

  // Rotation between [0, 360[
  const rotation = ((node.rotation() % 360) + 360) % 360;

  const isResizedHorizontally = ( (almostEqual(rotation, 0) || almostEqual(rotation, 180)) && widthResized ) ||
    ( (almostEqual(rotation, 90) || almostEqual(rotation, 270)) && heightResized );

  return isResizedHorizontally;
};
