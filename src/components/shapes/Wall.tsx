import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer } from 'react-konva';
import _ from 'lodash';

import theme from '../../utils/shapeTheme';

export interface WallConfig {
  id: string;
  x: number;
  y: number;
  rotation: number;
  draggable?: boolean;
  width: number;
  wallThickness: number;
}

export interface WallProps {
  wall: WallConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: WallConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const Wall = (props: WallProps): JSX.Element => {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isSelected, onSelect, onChange, wall } = props;

  // Props for the `Rect` component
  const rectProps = _.pick(wall, ['id', 'x', 'y', 'rotation', 'width', 'draggable']);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        name="object"
        {...rectProps}
        height={wall.wallThickness}
        stroke={theme.strokeColor}
        strokeWidth={theme.strokeWidth}
        fill={theme.wallColor}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange && onChange({
            // previous state
            ...wall,
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
            ...wall,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            wallThickness: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          id={`${wall.id}-transformer`}
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

Wall.defaultProps = {
  isSelected: false,
};

export default Wall;
