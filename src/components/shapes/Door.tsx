import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Shape, Transformer } from 'react-konva';

import { degToRadians, almostEqual, cmToPixels } from '../../utils';

interface DoorConfig {
  onChange?: (newAttrs: DoorProps) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  isSelected?: boolean;
  doorWidth?: number;
};

export type DoorProps = DoorConfig & Konva.ShapeConfig;

// Konva doesn't export the Box type so we need to define it manually
export interface Box {
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
};

const initialDoorWidth = cmToPixels(80);

const initialTransformerBox = (
  x: number | undefined,
  y: number | undefined,
  rotation: number | undefined
): Box => ({
  x: x || 0,
  y: y || 0,
  width: initialDoorWidth,
  height: initialDoorWidth,
  rotation: rotation || 0,
});

const Door = ({ onChange, onSelect, isSelected, doorWidth, ...props }: DoorProps): JSX.Element => {
  const shapeRef = useRef<Konva.Shape>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const previousTransformerBoxRef = useRef<Box>(
    initialTransformerBox(props.x, props.y, props.rotation)
  );

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Shape
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        width={doorWidth}
        height={doorWidth}
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(0, doorWidth);
          context.arc(0, 0, doorWidth, degToRadians(90), degToRadians(0), true);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        stroke="black"
        strokeWidth={1}
        onDragEnd={(e) => {
          onChange && onChange({
            // previous state
            ...props,
            doorWidth,
            // transformed state
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) {
            return;
          }

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange && onChange({
            ...props,
            x: node.x(),
            y: node.y(),
            doorWidth: node.width() * scaleX,
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
        {...props}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          ignoreStroke={true}
          boundBoxFunc={(oldBox, newBox) => {
            /*  Let's determine if the door has been resized either horizontally or
                vertically. In such a case, we need to take care of keeping the bounding
                box of the door shape a square.

                Note that we need `previousTransformerBoxRef` for keeping the previous box
                state because the `oldBox` of the next function call migth not be exactly
                the same as the `newBox` of the current function call!
            */
            const prevWidth = previousTransformerBoxRef.current.width;
            const prevHeight = previousTransformerBoxRef.current.height;

            let returnBox: Box;

            // Width is changed but height is not --> manually change height
            if (!almostEqual(prevWidth, newBox.width) && almostEqual(prevHeight, newBox.height)) {
              returnBox = {
                ...newBox,
                height: newBox.width,
              };
            }
            // Height is changed but eidth is not --> manually change width
            else if (almostEqual(prevWidth, newBox.width) && !almostEqual(prevHeight, newBox.height)) {
              returnBox = {
                ...newBox,
                width: newBox.height,
              };
            }
            else {
              returnBox = newBox;
            }

            previousTransformerBoxRef.current = returnBox;
            return returnBox;
          }}
        />
      )}
    </>
  );
};

Door.defaultProps = {
  doorWidth: initialDoorWidth,
  isSelected: false,
};

export default Door;
