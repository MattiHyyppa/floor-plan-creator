import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer, Group, Shape } from 'react-konva';

import type { ColdApplianceConfig } from '../../types';
import theme from '../../utils/shapeTheme';

export interface ColdApplianceProps {
  shape: ColdApplianceConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: ColdApplianceConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const ColdAppliance = (props: ColdApplianceProps): JSX.Element => {
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
            depth: shape.depth * scaleY,
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
            const dx = Math.min(5, shape.width / 2);
            context.beginPath();
            context.moveTo(shape.width, 0);
            context.lineTo(shape.width / 2 - dx, shape.depth / 2);
            context.lineTo(shape.width / 2 + dx, shape.depth / 2);
            context.lineTo(0, shape.depth);
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

export default ColdAppliance;
