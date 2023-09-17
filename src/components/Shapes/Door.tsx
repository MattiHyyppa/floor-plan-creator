import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Shape, Transformer, Group, Rect } from 'react-konva';

import { degToRadians, almostEqual, cmToPixels, } from '../../utils';
import theme from '../../utils/shapeTheme';
import { useAppSelector } from '../../hooks';
import type { Box } from '../../types';

export interface DoorConfig {
  id: string;
  x: number;
  y: number;
  doorWidth: number;
  rotation: number;
  wallThickness: number;
  kind: 'interior' | 'exterior';
  openingDirection: 'right' | 'left';
  isSelected?: boolean;
  draggable?: boolean;
}

interface DoorProps {
  door: DoorConfig;

  onChange?: (newAttrs: DoorConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const initialDoorWidth = cmToPixels(80);

type InitialTransformerBoxFunc = (
  x: number,
  y: number,
  rotation:number,
  wallThickness:number,
  kind: 'interior' | 'exterior'
) => Box;

const initialTransformerBox: InitialTransformerBoxFunc = (x, y, rotation, wallThickness, kind) => {
  return {
    x,
    y,
    width: initialDoorWidth,
    height: initialDoorWidth + (kind === 'interior' ? wallThickness : wallThickness / 2),
    rotation: rotation || 0,
  };
};

const Door = ({ door, onChange, onSelect }: DoorProps): JSX.Element => {
  const selectedId = useAppSelector((state) => state.selectedId.value);
  const isSelected = selectedId === door.id;

  const { doorWidth, wallThickness, kind, openingDirection } = door;
  const additionalHeight = kind === 'interior' ? wallThickness : wallThickness / 2;

  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const previousTransformerBoxRef = useRef<Box>(
    initialTransformerBox(door.x, door.y, door.rotation, wallThickness, kind)
  );

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
        name="object"
        {...door}
        width={doorWidth}
        height={doorWidth + additionalHeight}
        onDragEnd={(e) => {
          onChange && onChange({
            // previous state
            ...door,
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

          node.scaleX(1);
          node.scaleY(1);

          onChange && onChange({
            ...door,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            doorWidth: node.width() * scaleX,
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={doorWidth}
          height={wallThickness}
          onClick={onSelect}
          onTap={onSelect}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill={theme.floorColor}
        />
        <Shape
          x={0}
          y={additionalHeight}
          onClick={onSelect}
          onTap={onSelect}
          width={doorWidth}
          height={doorWidth}
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(0, 0);
            if (openingDirection === 'right') {
              context.lineTo(0, doorWidth);
              context.arc(0, 0, doorWidth, degToRadians(90), degToRadians(0), true);
            }
            else {
              context.arc(doorWidth, 0, doorWidth, degToRadians(180), degToRadians(90), true);
              context.lineTo(doorWidth, 0);
            }
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
        />
      </Group>

      {isSelected && (
        <Transformer
          id={`${door.id}-transformer`}
          ref={transformerRef}
          ignoreStroke={true}
          rotationSnaps={[0, 90, 180, 270]}
          boundBoxFunc={(_oldBox, newBox) => {
            /*  Let's determine if the door has been resized either horizontally or
                vertically. We need to take care that the following equation always
                holds: `height = width + additionalHeight`.

                Note that we need `previousTransformerBoxRef` for keeping the previous box
                state because the `oldBox` of the next function call migth not be exactly
                the same as the `newBox` of the current function call.
            */
            const prevWidth = previousTransformerBoxRef.current.width;
            const prevHeight = previousTransformerBoxRef.current.height;

            let returnBox: Box;

            // Width is changed but height is not --> manually change height
            if (!almostEqual(prevWidth, newBox.width) && almostEqual(prevHeight, newBox.height)) {
              returnBox = {
                ...newBox,
                height: newBox.width + additionalHeight,
              };
            }
            // Height is changed but width is not --> manually change width
            else if (almostEqual(prevWidth, newBox.width) && !almostEqual(prevHeight, newBox.height)) {
              returnBox = {
                ...newBox,
                width: newBox.height - additionalHeight,
              };
            }
            // Width and height are being changed the same amount but the height has to be
            // manually made `additionalHeight` pixels larger.
            else {
              returnBox = {
                ...newBox,
                height: newBox.width + additionalHeight,
              };
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
  isSelected: false,
};

export default Door;
