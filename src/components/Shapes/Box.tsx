import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer, Group } from 'react-konva';

import type { BoxConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import { cmToPixels } from '../../utils';

export interface BoxProps {
  shape: BoxConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: BoxConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const defaultWidth = cmToPixels(100);
const defaultHeight = cmToPixels(60);

const Box = (props: BoxProps): JSX.Element => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isSelected, onSelect, onChange, shape } = props;

  useEffect(() => {
    if (isSelected && shape.draggable && transformerRef.current && groupRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape.draggable]);

  return (
    <>
      <Group
        ref={groupRef}
        name="object"
        {...shape}
        width={shape.width}
        height={shape.height}
        onDragEnd={(e) => {
          onChange && onChange({
            ...shape,
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
            ...shape,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: shape.width * scaleX,
            height: shape.height * scaleY,
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={shape.width}
          height={shape.height}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill="white"
          onClick={onSelect}
          onTap={onSelect}
        />
      </Group>
      {isSelected && shape.draggable && (
        <Transformer
          id={`${shape.id}-transformer`}
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

Box.defaultProps = {
  width: defaultWidth,
  height: defaultHeight,
  isSelected: false,
};

export default Box;