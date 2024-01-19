import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer, Group } from 'react-konva';

import type { RectangleHouseConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import { cmToPixels } from '../../utils';

export interface RectangleHouseProps {
  house: RectangleHouseConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: RectangleHouseConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const defaultExteriorWidth = cmToPixels(1000);
const defaultExteriorHeight = cmToPixels(800);

const RectangleHouse = (props: RectangleHouseProps): JSX.Element => {
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
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={house.exteriorWidth}
          height={house.exteriorHeight}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill={theme.wallColor}
          onClick={onSelect}
          onTap={onSelect}
        />
        <Rect
          x={house.wallThickness}
          y={house.wallThickness}
          width={house.exteriorWidth - 2 * house.wallThickness}
          height={house.exteriorHeight - 2 * house.wallThickness}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill={theme.floorColor}
          onClick={onSelect}
          onTap={onSelect}
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

RectangleHouse.defaultProps = {
  exteriorWidth: defaultExteriorWidth,
  exteriorHeight: defaultExteriorHeight,
  isSelected: false,
};

export default RectangleHouse;
