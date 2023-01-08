import RectangleHouseForm from './RectangleHouseForm';
import { useAppSelector } from '../../hooks';
import { isRectangleHouse } from '../../types';

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

  return <></>;
};

export default EditShapesForm;
