import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer, Group } from 'react-konva';

import type { BoxConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import { cmToPixels } from '../../utils';

export interface BoxProps {
  box: BoxConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: BoxConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const defaultWidth = cmToPixels(100);
const defaultHeight = cmToPixels(60);

const Box = (props: BoxProps): JSX.Element => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isSelected, onSelect, onChange, box } = props;

  useEffect(() => {
    if (isSelected && box.draggable && transformerRef.current && groupRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, box.draggable]);

  return (
    <>
      <Group
        ref={groupRef}
        name="object"
        {...box}
        width={box.width}
        height={box.height}
        onDragEnd={(e) => {
          onChange && onChange({
            ...box,
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
            ...box,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: box.width * scaleX,
            height: box.height * scaleY,
          });
        }}
      >
        <Rect
          x={0}
          y={0}
          width={box.width}
          height={box.height}
          stroke={theme.strokeColor}
          strokeWidth={theme.strokeWidth}
          fill="white"
          onClick={onSelect}
          onTap={onSelect}
        />
      </Group>
      {isSelected && box.draggable && (
        <Transformer
          id={`${box.id}-transformer`}
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
