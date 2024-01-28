import { useEffect, useRef } from 'react';
import Konva from 'konva';
import {
  Rect,
  Transformer,
  Group,
  Shape,
  Text as KonvaText,
} from 'react-konva';

import type { TapeMeasureConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import {
  cmToPixels,
  range,
  pixelsToMeters,
  round,
} from '../../utils';

export interface TapeMeasureProps {
  shape: TapeMeasureConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: TapeMeasureConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const TapeMeasure = (props: TapeMeasureProps): JSX.Element => {
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

  const height = cmToPixels(30);

  return (
    <>
      <Group
        ref={groupRef}
        name="object"
        {...shape}
        width={shape.width}
        height={height}
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
          node.scaleX(1);
          onChange && onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: shape.width * scaleX,
          });
        }}
      >
        {/*
          An invisible rectangle that is rendered around the tape measure line to make clicking it easier.
        */}
        <Rect
          x={0}
          y={0}
          width={shape.width}
          height={height}
          opacity={0}
          onClick={onSelect}
          onTap={onSelect}
        />
        {/*
          The tape measure line
        */}
        <Shape
          x={0}
          y={0}
          width={shape.width}
          height={height}
          onClick={onSelect}
          onTap={onSelect}
          sceneFunc={(context, canvasShape) => {
            const stepSize = cmToPixels(100);
            const steps = range(0, shape.width, stepSize);

            if (steps[steps.length - 1] !== shape.width) {
              steps.push(shape.width);
            }

            context.beginPath();
            context.moveTo(0, height / 2);
            context.lineTo(shape.width, height / 2);

            steps.forEach((step, index) => {
              if ((index === 0) || (index === steps.length - 1)) {
                context.moveTo(step, 0);
                context.lineTo(step, height);
              }
              else {
                context.moveTo(step, height / 4);
                context.lineTo(step, height * 3 / 4);
              }
            });

            context.fillStrokeShape(canvasShape);
          }}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
        />
        {/*
          The length of the tape measure line displayed as text
        */}
        <KonvaText
          x={shape.width / 2}
          y={-10}
          rotation={-shape.rotation}
          fontFamily="InterVariable"
          fontSize={14}
          onClick={onSelect}
          onTap={onSelect}
          text={`${round(pixelsToMeters(shape.width), 2)}`}
        />
      </Group>
      {isSelected && shape.draggable && (
        <Transformer
          id={`${shape.id}-transformer`}
          ref={transformerRef}
          ignoreStroke={true}
          enabledAnchors={['middle-left', 'middle-right']}
          rotationSnaps={[0, 90, 180, 270]}
          boundBoxFunc={(_oldBox, newBox) => {
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TapeMeasure;
