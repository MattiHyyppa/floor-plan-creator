import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import { updateShape } from '../redux/slices/canvasSlice';
import type { RootState, AppDispatch } from '../redux';

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = () => {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

export const useArrowKeyEvents = () => {
  const selectedId = useAppSelector(state => state.selectedId.value);
  const allShapes = useAppSelector(state => state.canvas.shapes);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (!selectedId) {
        return;
      }

      const selectedShape = allShapes.find(shape => shape.id === selectedId);
      if (!selectedShape) {
        return;
      }

      let xNew = selectedShape.x;
      let yNew = selectedShape.y;
      const DELTA = 1;

      switch(event.key) {
      case 'ArrowUp':
        yNew -= DELTA;
        event.preventDefault();
        break;
      case 'ArrowDown':
        yNew += DELTA;
        event.preventDefault();
        break;
      case 'ArrowLeft':
        xNew -= DELTA;
        event.preventDefault();
        break;
      case 'ArrowRight':
        xNew += DELTA;
        event.preventDefault();
        break;
      }

      dispatch(updateShape({
        id: selectedId,
        newAttrs: { x: xNew, y: yNew, },
      }));
    };

    window.addEventListener('keydown', handleArrowKeys);

    return () => window.removeEventListener('keydown', handleArrowKeys);
  }, [allShapes, selectedId, dispatch]);
};
