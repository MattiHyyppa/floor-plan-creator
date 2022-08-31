import Konva from 'konva';
import theme from './shapeTheme';

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
  /*
  Note that `node.getClientRect()` returns an object which has `x` and `y` fields
  like the object returned by `node.absolutePosition()`. However, `node.absolutePosition`
  seems to return the same values as the `x` and `y` props passed to the shape component
  but `node.getClientRect` seems to return the top-left corner of the drawn shape. In case,
  the shape has no stroke, the values should be the same but otherwise not.

  Check the note in the beginning of the project-dir/src/components/shapes/LShapedHouse.tsx
  file.

  We want to adjust the width and height by subtracting `theme.strokeWidth` to make sure
  the shapes will be snapped such that their strokes are on top of each other when the user
  drags a shape close to another one. Otherwise, there would be an ugly duplicate stroke
  between the shapes.
  */
  let { width, height } = node.getClientRect();
  width -= theme.strokeWidth;
  height -= theme.strokeWidth;
  const { x, y } = node.absolutePosition();

  // Similarly, as in the `getLineGuideStops` function, we can snap over the edges of
  // each object on the canvas
  return {
    vertical: [
      {
        guide: x,
        offset: 0,
        snap: 'start',
      },
      {
        guide: x + width,
        offset: - width,
        snap: 'end',
      },
    ],
    horizontal: [
      {
        guide: y,
        offset: 0,
        snap: 'start',
      },
      {
        guide: y + height,
        offset: - height,
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

    let { width, height } = guideItem.getClientRect();
    width -= theme.strokeWidth;
    height -= theme.strokeWidth;
    const { x, y } = guideItem.absolutePosition();

    // We can snap over the edges of each object on the canvas
    vertical.push(...[x, x + width]);
    horizontal.push(...[y, y + height]);
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
      if (diff < guideLineOffset) {
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
