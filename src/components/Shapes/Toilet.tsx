import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Transformer, Group, Shape } from 'react-konva';

import type { ToiletConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import { cmToPixels } from '../../utils';

export interface ToiletProps {
  shape: ToiletConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: ToiletConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const Toilet = (props: ToiletProps): JSX.Element => {
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
        <Shape
          x={0}
          y={0}
          onClick={onSelect}
          onTap={onSelect}
          width={shape.width}
          height={shape.depth}
          sceneFunc={(context, canvasShape) => {
            const radius1 = 3;
            const depth1 = cmToPixels(20);

            context.beginPath();
            context.moveTo(shape.width / 2, 0);
            context.lineTo(shape.width - radius1, 0);
            context.arcTo(shape.width, 0, shape.width, depth1, radius1);
            context.lineTo(shape.width, depth1 - radius1);
            context.arcTo(shape.width, depth1, 0, depth1, radius1);
            context.lineTo(radius1, depth1);
            context.arcTo(0, depth1, 0, 0, radius1);
            context.lineTo(0, radius1);
            context.arcTo(0, 0, shape.width / 2, 0, radius1);
            context.lineTo(shape.width / 2, 0);

            const radius2 = shape.width / 2;

            context.moveTo(shape.width, depth1 / 2);
            context.lineTo(shape.width, shape.depth - radius2);
            let center = { x: shape.width / 2, y: shape.depth - radius2 };
            context.arc(center.x, center.y, radius2, 0, Math.PI, false);
            context.lineTo(0, depth1 / 2);

            const radius3 = 1;
            center = { x: shape.width / 2, y: depth1 / 2 };
            context.moveTo(center.x, center.y - radius3);
            context.arc(center.x, center.y, radius3, 0, 2 * Math.PI, false);

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

export default Toilet;
