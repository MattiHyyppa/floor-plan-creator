import RectangleHouseForm from './RectangleHouseForm';
import LShapedHouseForm from './LShapedHouseForm';
import { useAppSelector } from '../../hooks';
import { isRectangleHouse, isLShapedHouse } from '../../types';

const EditShapesForm = () => {
  const selectedId = useAppSelector(state => state.selectedId.value);
  const allShapes = useAppSelector(state => state.shapes);
  const shapeToBeEdited = allShapes.find(shape => shape.id === selectedId);

  if (!shapeToBeEdited) {
    return <></>;
  }

  if (isRectangleHouse(shapeToBeEdited)) {
    return <RectangleHouseForm house={shapeToBeEdited} />;
  }

  if (isLShapedHouse(shapeToBeEdited)) {
    return <LShapedHouseForm house={shapeToBeEdited} />;
  }

  return <></>;
};

export default EditShapesForm;
