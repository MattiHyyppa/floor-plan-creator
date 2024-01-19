import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Rect, Transformer } from 'react-konva';
import { type Vector2d } from 'konva/lib/types';

import type { WallConfig } from '../../types';
import theme from '../../utils/shapeTheme';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setHorizontalLineGuide, setVerticalLineGuide } from '../../redux/slices/lineGuidesSlice';

export interface WallProps {
  wall: WallConfig;
  isSelected?: boolean;

  onChange?: (newAttrs: WallConfig) => void;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleLineGuidesOnResize: (node: Konva.Node, anchorPos: Vector2d) => ({ x: number } | { y: number })[];
}

const Wall = (props: WallProps): JSX.Element => {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const horizontalLineGuide = useAppSelector((state) => state.lineGuides.horizontal);
  const verticalLineGuide = useAppSelector((state) => state.lineGuides.vertical);

  const dispatch = useAppDispatch();

  const { isSelected, onSelect, onChange, wall, handleLineGuidesOnResize } = props;

  const removeLineGuides = (): void => {
    horizontalLineGuide && dispatch(setHorizontalLineGuide(null));
    verticalLineGuide && dispatch(setVerticalLineGuide(null));
  };

  useEffect(() => {
    if (isSelected && wall.draggable && transformerRef.current && shapeRef.current) {
      // We need to attach the transformer manually
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, wall.draggable]);

  return (
    <>
      <Rect
        ref={shapeRef}
        name="object"
        {...wall}
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

          removeLineGuides();
        }}
      />
      {isSelected && wall.draggable && (
        <Transformer
          id={`${wall.id}-transformer`}
          ref={transformerRef}
          ignoreStroke={true}
          rotationSnaps={[0, 90, 180, 270]}
          enabledAnchors={['middle-left', 'top-center', 'middle-right', 'bottom-center']}
          boundBoxFunc={(_oldBox, newBox) => newBox}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          anchorDragBoundFunc={(oldAbsPos: any, newAbsPos: any, _event: any) => {
            if (!transformerRef.current || transformerRef.current.getActiveAnchor() === 'rotater') {
              // No transformer or the transformer is being used for rotating the object,
              // not for resizing.
              return newAbsPos;
            }

            const node = shapeRef.current;
            if (!node) {
              throw new Error('Wall object doesn\'t have a ref to a Konva node.');
            }

            const stage = node.getStage();
            if (!stage) {
              throw new Error('Wall object is not associated with a Konva Stage.');
            }

            const result = {
              x: oldAbsPos.x,
              y: oldAbsPos.y,
            };

            const activeAchor = transformerRef.current.findOne(
              '.' + transformerRef.current.getActiveAnchor()
            );
            const anchorPos = activeAchor.getAbsolutePosition();
            if (!anchorPos) {
              return newAbsPos;
            }

            const snapPositions = handleLineGuidesOnResize(node, anchorPos);
            if (snapPositions.length === 0) {
              return newAbsPos;
            }

            snapPositions.forEach(pos => {
              if ('x' in pos) {
                result.x = pos.x;
              }
              else if ('y' in pos) {
                result.y = pos.y;
              }
            });

            // Refine the result to take the stroke width of the objects in consideration.
            // We want to snap the objects together so that the stroke of both objects is
            // on top of each other instead of having the strokes side by side.
            if (result.x !== oldAbsPos.x) {
              const x = node.getClientRect().x;
              if (result.x > x) {
                result.x += theme.strokeWidth / 2;
              }
              else if (result.x < x) {
                result.x -= theme.strokeWidth / 2;
              }
            }
            if (result.y !== oldAbsPos.y) {
              const y = node.getClientRect().y;
              if (result.y > y) {
                result.y += theme.strokeWidth / 2;
              }
              else if (result.y < y) {
                result.y -= theme.strokeWidth / 2;
              }
            }

            return result;
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
