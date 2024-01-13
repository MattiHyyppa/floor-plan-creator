import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Shape, Transformer, Group } from 'react-konva';

import { RectangleHouseConfig } from './RectangleHouse';
import theme from '../../utils/shapeTheme';
import { cmToPixels } from '../../utils';

/* An L-shaped house has the following dimensions:
              4
      +----------------+
      |                |
      |                |
      |                |
      |                |
    1 |                |
      |                +------------------------+
      |                                         |
      |                                         |
      |                                         | 3
      |                                         |
      +-----------------------------------------+
                        2
  1 = exteriorHeight
  2 = exteriorWidth
  3 = firstWingWidth
  4 = secondWingWidth

  The dimensions are measured along the exterior side of the walls so, for example,
  the length of firstWingWidth measured from the interior side is:
  firstWingWidth - 2 * wallThickness.

  The shape can be rotated after which the dimensions are a bit different. For example,
  a 90 deg rotation in either direction could be interpreted such that at least exteriorWidth
  and exteriorHeight would be swapped. However, the dimensions as specified in the picture
  apply for the case when rotation is zero and the names of the dimensions rotate with the shape.
  Therefore, we don't have to worry about swapping any names when rotating.

  NOTE! All the the custom shapes have a stroke of width `theme.strokeWidth` as determined
  in the project-dir/src/utils/shapeTheme.ts file. Konva handles drawing the stroke such that
  half of it is outside and half is inside the bounds of the shape. This means that if the x
  and y params are both set to 100 and `theme.strokeWidth === 1`, the top-left corner is actually
  drawn at (99.5, 99.5).
*/
export interface LShapedHouseConfig extends RectangleHouseConfig {
  firstWingWidth: number;
  secondWingWidth: number;
}

export interface LShapedHouseProps {
  house: LShapedHouseConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: LShapedHouseConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const defaultExteriorWidth = cmToPixels(1400);
const defaultExteriorHeight = cmToPixels(1000);
const defaultFirstWingWidth = cmToPixels(500);
const defaultSecondWingWidth = cmToPixels(500);

const LShapedHouse = (props: LShapedHouseProps): JSX.Element => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isSelected, onSelect, onChange, house } = props;

  useEffect(() => {
    if (isSelected && house.draggable && transformerRef.current && groupRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, house.draggable]);

  return (
    <>
      <Group
        ref={groupRef}
        name="object"
        {...house}
        width={house.exteriorWidth}
        height={house.exteriorHeight}
        onDragEnd={(e) => {
          onChange && onChange({
            // previous state
            ...house,
            // transformed state
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(_e) => {
          const node = groupRef.current;
          if (!node) {
            return;
          }

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange && onChange({
            ...house,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            exteriorWidth: house.exteriorWidth * scaleX,
            exteriorHeight: house.exteriorHeight * scaleY,
            firstWingWidth: house.firstWingWidth * scaleY,
            secondWingWidth: house.secondWingWidth * scaleX,
          });
        }}
      >
        <Shape
          x={0}
          y={0}
          width={house.exteriorWidth}
          height={house.exteriorHeight}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill={theme.wallColor}
          onClick={onSelect}
          onTap={onSelect}
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, house.exteriorHeight);
            context.lineTo(house.exteriorWidth, house.exteriorHeight);
            context.lineTo(house.exteriorWidth, house.exteriorHeight - house.firstWingWidth);
            context.lineTo(house.secondWingWidth, house.exteriorHeight - house.firstWingWidth);
            context.lineTo(house.secondWingWidth, 0);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
        />
        <Shape
          x={0}
          y={0}
          width={house.exteriorWidth}
          height={house.exteriorHeight}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill={theme.floorColor}
          onClick={onSelect}
          onTap={onSelect}
          sceneFunc={(context, shape) => {
            const {
              exteriorWidth,
              exteriorHeight,
              wallThickness,
              firstWingWidth,
              secondWingWidth,
            } = house;

            context.beginPath();
            context.moveTo(wallThickness, wallThickness);
            context.lineTo(wallThickness, exteriorHeight - wallThickness);
            context.lineTo(exteriorWidth - wallThickness, exteriorHeight - wallThickness);
            context.lineTo(exteriorWidth - wallThickness, exteriorHeight - firstWingWidth + wallThickness);
            context.lineTo(secondWingWidth - wallThickness, exteriorHeight - firstWingWidth + wallThickness);
            context.lineTo(secondWingWidth - wallThickness, wallThickness);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
        />
      </Group>
      {isSelected && house.draggable && (
        <Transformer
          id={`${house.id}-transformer`}
          ref={transformerRef}
          ignoreStroke={true}
          rotationSnaps={[0, 90, 180, 270]}
          boundBoxFunc={(_oldBox, newBox) => {
            return newBox;
          }}
        />
      )}
    </>
  );
};

LShapedHouse.defaultProps = {
  exteriorWidth: defaultExteriorWidth,
  exteriorHeight: defaultExteriorHeight,
  firstWingWidth: defaultFirstWingWidth,
  secondWingWidth: defaultSecondWingWidth,
  isSelected: false,
};

export default LShapedHouse;
