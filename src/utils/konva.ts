import Konva from 'konva';
import { theme } from './shapeTheme';

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
    vertical.push(...[x, x + width]);
    horizontal.push(...[y, y + height]);
  });

  return {
    vertical,
    horizontal,
  };
};

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
      if (diff < guideLineOffset) {
        resultV.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
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
