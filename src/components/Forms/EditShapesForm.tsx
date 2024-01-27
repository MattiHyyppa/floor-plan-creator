import {
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import RectangleHouseForm from './RectangleHouseForm';
import LShapedHouseForm from './LShapedHouseForm';
import DoorForm from './DoorForm';
import WallForm from './WallForm';
import WindowForm from './WindowForm';
import BoxForm from './BoxForm';
import ColdApplianceForm from './ColdApplianceForm';
import TextForm from './TextForm';
import SinkForm from './SinkForm';
import StoveForm from './StoveForm';
import { useAppSelector } from '../../hooks';
import type {
  CustomShapeConfig,
  RectangleHouseConfig,
  LShapedHouseConfig,
  DoorConfig,
  WallConfig,
  WindowConfig,
  BoxConfig,
  ColdApplianceConfig,
  TextConfig,
  SinkConfig,
  StoveConfig,
} from '../../types';

const shapeToFormComponent = (shape: CustomShapeConfig) => {
  const options = {
    rectangleHouse: () => <RectangleHouseForm shape={shape as RectangleHouseConfig} />,
    lShapedHouse: () => <LShapedHouseForm shape={shape as LShapedHouseConfig} />,
    door: () => <DoorForm shape={shape as DoorConfig} />,
    wall: () => <WallForm shape={shape as WallConfig} />,
    window: () => <WindowForm shape={shape as WindowConfig} />,
    box: () => <BoxForm shape={shape as BoxConfig} />,
    coldAppliance: () => <ColdApplianceForm shape={shape as ColdApplianceConfig} />,
    text: () => <TextForm shape={shape as TextConfig} />,
    sink: () => <SinkForm shape={shape as SinkConfig} />,
    stove: () => <StoveForm shape={shape as StoveConfig} />,
  };

  return options[shape.shapeName];
};

const FormWithAlert = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <Flex h="100%" direction="column" justifyContent="space-between">
      <Box px={[2, null, 3]} pb={2}>
        {children}
      </Box>
      <Box px={[2, null, 3]} mt={4}>
        <Alert status="info" variant="subtle" rounded="md" mb={4} py={2} px={3}>
          <AlertIcon boxSize="16px" />
          <AlertDescription mt={1} fontSize="sm">{t('forms.unitInformation')}</AlertDescription>
        </Alert>
      </Box>
    </Flex>
  );
};

const EditShapesForm = () => {
  const selectedId = useAppSelector(state => state.selectedId.value);
  const allShapes = useAppSelector(state => state.canvas.shapes);
  const shapeToBeEdited = allShapes.find(shape => shape.id === selectedId);
  const { t } = useTranslation();

  if (!shapeToBeEdited) {
    return <Text px={[2, null, 3]} fontSize="sm">{t('forms.noShapeSelected')}</Text>;
  }

  const getFormComponent = shapeToFormComponent(shapeToBeEdited);
  return (
    <FormWithAlert>
      {getFormComponent()}
    </FormWithAlert>
  );
};

export default EditShapesForm;
