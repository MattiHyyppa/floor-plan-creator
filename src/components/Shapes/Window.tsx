import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Shape, Transformer } from 'react-konva';

import type { WindowConfig } from '../../types';
import theme from '../../utils/shapeTheme';

export interface WindowProps {
  shape: WindowConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: WindowConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const Window = (props: WindowProps): JSX.Element => {
  const { shape, isSelected, onChange, onSelect } = props;

  const shapeRef = useRef<Konva.Shape>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && shape.draggable && transformerRef.current && shapeRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape.draggable]);

  const width = shape.windowWidth;
  const height = shape.wallThickness;

  return (
    <>
      <Shape
        ref={shapeRef}
        name="object"
        {...shape}
        width={width}
        height={height}
        onClick={onSelect}
        onTap={onSelect}
        stroke={theme.strokeColor}
        strokeWidth={theme.strokeWidth}
        fill={theme.floorColor}
        onDragEnd={(e) => {
          onChange && onChange({
            // previous state
            ...shape,
            // transformed state
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(_e) => {
          const node = shapeRef.current;
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
            windowWidth: node.width() * scaleX,
            wallThickness: node.height() * scaleY,
          });
        }}
        sceneFunc={(context, canvasShape) => {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(width, 0);
          context.lineTo(width, height);
          context.lineTo(0, height);
          context.lineTo(0, 0);
          context.moveTo(0, height / 2);
          context.lineTo(width, height / 2);
          context.closePath();
          context.fillStrokeShape(canvasShape);
        }}
      />
      {isSelected && shape.draggable && (
        <Transformer
          id={`${shape.id}-transformer`}
          ref={transformerRef}
          ignoreStroke={true}
          rotationSnaps={[0, 90, 180, 270]}
          boundBoxFunc={(_oldBox, newBox) => newBox}
        />
      )}
    </>
  );
};

Window.defaultProps = {
  isSelected: false,
};

export default Window;
