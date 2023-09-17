import {
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import RectangleHouseForm from './RectangleHouseForm';
import LShapedHouseForm from './LShapedHouseForm';
import DoorForm from './DoorForm';
import WallForm from './WallForm';
import WindowForm from './WindowForm';
import { useAppSelector } from '../../hooks';
import {
  isRectangleHouse,
  isLShapedHouse,
  isDoor,
  isWall,
  isWindow,
} from '../../types';

const FormWithAlert = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <>
      <Alert status="info" rounded="md" mb={3} py={2} px={3}>
        <AlertIcon />
        <AlertDescription mt={1} fontSize="sm">{t('forms.unitInformation')}</AlertDescription>
      </Alert>
      {children}
    </>
  );
};

const EditShapesForm = () => {
  const selectedId = useAppSelector(state => state.selectedId.value);
  const allShapes = useAppSelector(state => state.shapes);
  const shapeToBeEdited = allShapes.find(shape => shape.id === selectedId);
  const { t } = useTranslation();

  if (!shapeToBeEdited) {
    return <Text fontSize="sm">{t('forms.noShapeSelected')}</Text>;
  }

  if (isRectangleHouse(shapeToBeEdited)) {
    return (
      <FormWithAlert>
        <RectangleHouseForm house={shapeToBeEdited} />
      </FormWithAlert>
    );
  }

  if (isLShapedHouse(shapeToBeEdited)) {
    return (
      <FormWithAlert>
        <LShapedHouseForm house={shapeToBeEdited} />
      </FormWithAlert>
    );
  }

  if (isDoor(shapeToBeEdited)) {
    return (
      <FormWithAlert>
        <DoorForm door={shapeToBeEdited} />
      </FormWithAlert>
    );
  }

  if (isWall(shapeToBeEdited)) {
    return (
      <FormWithAlert>
        <WallForm wall={shapeToBeEdited} />
      </FormWithAlert>
    );
  }

  if (isWindow(shapeToBeEdited)) {
    return (
      <FormWithAlert>
        <WindowForm window={shapeToBeEdited} />
      </FormWithAlert>
    );
  }

  return <></>;
};

export default EditShapesForm;
