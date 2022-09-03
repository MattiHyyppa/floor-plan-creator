import Konva from 'konva';

import theme from './shapeTheme';
import { almostDivisibleBy, degToRadians, almostEqual } from '.';

export interface ItemBound {
  guide: number;
  offset: number;
  snap: 'start' | 'end';
}

export interface NodeSnappingEdges {
  vertical: ItemBound[];
  horizontal: ItemBound[];
}

export interface LineGuideStops {
  vertical: number[];
  horizontal: number[];
}

export interface LineGuide {
  lineGuide: number;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const box = node.getClientRect({ relativeTo: stage as any });

  /*
  We want to adjust the width and height by subtracting `theme.strokeWidth` to make sure
  the shapes will be snapped such that their strokes are on top of each other when the user
  drags a shape close to another one. Otherwise, there would be a duplicate stroke between
  the shapes.
  */
  box.width -= theme.strokeWidth;
  box.height -= theme.strokeWidth;

  const absPos = node.absolutePosition();

  // Similarly, as in the `getLineGuideStops` function, we can snap over the edges of
  // each object on the canvas
  return {
    vertical: [
      {
        guide: box.x,
        offset: absPos.x - box.x,
        snap: 'start',
      },
      {
        guide: box.x + box.width,
        offset: absPos.x - box.x - box.width,
        snap: 'end',
      },
    ],
    horizontal: [
      {
        guide: box.y,
        offset: absPos.y - box.y,
        snap: 'start',
      },
      {
        guide: box.y + box.height,
        offset: absPos.y - box.y - box.height,
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
export const getLineGuideStops = (stage: Konva.Stage, skipShape: Konva.Node): LineGuideStops => {
  const vertical: number[] = [];
  const horizontal: number[] = [];

  stage.find('.object').forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const box = guideItem.getClientRect({ relativeTo: stage as any });

    box.width -= theme.strokeWidth;
    box.height -= theme.strokeWidth;

    // We can snap over the edges of each object on the canvas
    vertical.push(...[box.x, box.x + box.width]);
    horizontal.push(...[box.y, box.y + box.height]);

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

    vertical.push(...[box.x + wallThickness, box.x + box.width - wallThickness]);
    horizontal.push(...[box.y + wallThickness, box.y + box.height - wallThickness]);

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
      vertical.push(...[box.x + secondWingWidth - wallThickness, box.x + secondWingWidth]);
      horizontal.push(...[
        box.y + box.height - firstWingWidth + wallThickness,
        box.y + box.height - firstWingWidth,
      ]);
    }

    // rotation is (almost) 90, -270 or similar
    else if (almostEqual(cos, 0) && almostEqual(sin, 1)) {
      vertical.push(...[box.x + firstWingWidth - wallThickness, box.x + firstWingWidth]);
      horizontal.push(...[box.y + secondWingWidth - wallThickness, box.y + secondWingWidth]);
    }

    // rotation is (almost) 180, -180 or similar
    else if (almostEqual(cos, -1) && almostEqual(sin, 0)) {
      vertical.push(...[
        box.x + box.width - secondWingWidth + wallThickness,
        box.x + box.width - secondWingWidth,
      ]);
      horizontal.push(...[box.y + firstWingWidth - wallThickness, box.y + firstWingWidth]);
    }

    // rotation is (almost) 270, -90 or similar
    else if (almostEqual(cos, 0) && almostEqual(sin, -1)) {
      vertical.push(...[
        box.x + box.width - firstWingWidth + wallThickness,
        box.x + box.width - firstWingWidth,
      ]);
      horizontal.push(...[
        box.y + box.height - secondWingWidth + wallThickness,
        box.y + box.height - secondWingWidth,
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
 * @param lineGuideStops The points of the other nodes on the canvas that can trigger snapping.
 * @param itemBounds The bounds of the currently considered node the can trigger snapping.
 * @param guideLineOffset How many pixels is close enough for the snapping to take place.
 * @returns At most one vertical and at most one horizontal line guide which are close enough the
 * moving node for the snapping to take place. The returned line guides have minimal distance to
 * the currently considered node with the `itemBounds` bounds.
 */
export const getGuides = (
  lineGuideStops: LineGuideStops,
  itemBounds: NodeSnappingEdges,
  guideLineOffset = 5
): LineGuide[] => {
  const resultV: LineGuide[] = [];
  const resultH: LineGuide[] = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff <= guideLineOffset) {
        resultV.push({
          lineGuide,                  // The position of the line guide
          diff,                       // The distance between the line guide and the object
          snap: itemBound.snap,       // Did the START or END of the object trigger snapping
          // How much we need to offset the object from the line guide. This is important,
          // especially, when the end of the object triggered snapping and we don't want to
          // snap the top-left corner of the object to the line guide but instead the end of
          // the object.
          offset: itemBound.offset,
          // The line guide has vertical direction meaning that the `lineGuide` position
          // determines the x value of the line
          orientation: 'vertical',
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff <= guideLineOffset) {
        resultH.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
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
