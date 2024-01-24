import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Transformer, Text as KonvaText } from 'react-konva';

import type { TextConfig } from '../../types';

export interface TextProps {
  shape: TextConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: TextConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const Text = (props: TextProps): JSX.Element => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isSelected, onSelect, onChange, shape } = props;

  useEffect(() => {
    if (isSelected && shape.draggable && transformerRef.current && textRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape.draggable]);

  return (
    <>
      <KonvaText
        ref={textRef}
        name="text"  // Note that we are not using "object" as in the other shapes to not trigger line guides
        fontFamily="InterVariable"
        {...shape}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange && onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(_e) => {
          const node = textRef.current;
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
      />
      {isSelected && shape.draggable && (
        <Transformer
          id={`${shape.id}-transformer`}
          ref={transformerRef}
          rotationSnaps={[0, 90, 180, 270]}
          resizeEnabled={false}
        />
      )}
    </>
  );
};

export default Text;
