import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer, Group, Shape } from 'react-konva';

import type { StoveConfig } from '../../types';
import theme from '../../utils/shapeTheme';

export interface StoveProps {
  shape: StoveConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: StoveConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const Stove = (props: StoveProps): JSX.Element => {
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
        height={shape.depth}
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
          onChange && onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={shape.width}
          height={shape.depth}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill="white"
          onClick={onSelect}
          onTap={onSelect}
        />
        <Shape
          x={0}
          y={0}
          onClick={onSelect}
          onTap={onSelect}
          width={shape.width}
          height={shape.depth}
          sceneFunc={(context, canvasShape) => {
            const radius = 4;
            const params = [0, 2 * Math.PI, false] as const;  // Full circle in clockwise direction
            context.beginPath();

            let center = { x: shape.width / 4, y: shape.depth / 4 };
            context.moveTo(center.x + radius, center.y);
            context.arc(center.x, center.y, radius, ...params);

            center = { x: shape.width * 3 / 4, y: shape.depth / 4 };
            context.moveTo(center.x + radius, center.y);
            context.arc(center.x, center.y, radius, ...params);

            center = { x: shape.width / 4, y: shape.depth * 3 / 4 };
            context.moveTo(center.x + radius, center.y);
            context.arc(center.x, center.y, radius, ...params);

            center = { x: shape.width * 3 / 4, y: shape.depth * 3 / 4 };
            context.moveTo(center.x + radius, center.y);
            context.arc(center.x, center.y, radius, ...params);

            context.fillStrokeShape(canvasShape);
          }}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
        />
      </Group>
      {isSelected && shape.draggable && (
        <Transformer
          id={`${shape.id}-transformer`}
          ref={transformerRef}
          resizeEnabled={false}
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

export default Stove;
