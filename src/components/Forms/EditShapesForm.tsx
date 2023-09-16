import {
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import RectangleHouseForm from './RectangleHouseForm';
import LShapedHouseForm from './LShapedHouseForm';
import DoorForm from './DoorForm';
import { useAppSelector } from '../../hooks';
import {
  isRectangleHouse,
  isLShapedHouse,
  isDoor,
} from '../../types';

const UnitAlert = (props: AlertProps) => {
  const { t } = useTranslation();

  return (
    <Alert
      status="info"
      rounded="md"
      {...props}
    >
      <AlertIcon />
      <AlertDescription mt={1} fontSize="sm">{t('forms.unitInformation')}</AlertDescription>
    </Alert>
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
      <>
        <UnitAlert mb={3} py={2} px={3} />
        <RectangleHouseForm house={shapeToBeEdited} />
      </>
    );
  }

  if (isLShapedHouse(shapeToBeEdited)) {
    return (
      <>
        <UnitAlert mb={3} py={2} px={3} />
        <LShapedHouseForm house={shapeToBeEdited} />
      </>
    );
  }

  if (isDoor(shapeToBeEdited)) {
    return (
      <>
        <UnitAlert mb={3} py={2} px={3} />
        <DoorForm door={shapeToBeEdited} />
      </>
    );
  }

  return <></>;
};

export default EditShapesForm;
