import {
  Flex,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { useAppDispatch } from '../hooks';
import type { AppDispatch } from '../redux';
import {
  addRectangleHouse,
  addLShapedHouse,
  addExteriorDoor,
  addInteriorDoor,
  addWall,
  addWindow,
  addBox,
  addColdAppliance,
  addText,
} from '../redux/slices/canvasSlice';
import ImageWithText from './ImageWithText';
import type { ImageWithTextProps } from './ImageWithText';

import lShapedHouseImage from '../assets/images/l-shaped-house.png';
import rectangleHouseImage from '../assets/images/rectangle-house.png';
import exteriorDoorImage from '../assets/images/exterior-door.png';
import interiorDoorImage from '../assets/images/interior-door.png';
import wallImage from '../assets/images/wall.png';
import windowImage from '../assets/images/window.png';
import boxImage from '../assets/images/box.png';
import coldApplianceImage from '../assets/images/cold-appliance.png';
import textImage from '../assets/images/text.png';

const getHouseShapes = (dispatch: AppDispatch, t: TFunction): ImageWithTextProps[] => {
  return [
    {
      text: t('shapes.rectangleHouse'),
      width: '80px',
      src: rectangleHouseImage,
      addShape: () => dispatch(addRectangleHouse()),
    },
    {
      text: t('shapes.lShapedHouse'),
      width: '80px',
      src: lShapedHouseImage,
      addShape: () => dispatch(addLShapedHouse()),
    },
  ];
};

const getOtherShapes = (dispatch: AppDispatch, t: TFunction): ImageWithTextProps[] => {
  return [
    {
      text: t('shapes.exteriorDoor'),
      width: '60px',
      src: exteriorDoorImage,
      addShape: () => dispatch(addExteriorDoor()),
    },
    {
      text: t('shapes.interiorDoor'),
      width: '60px',
      src: interiorDoorImage,
      addShape: () => dispatch(addInteriorDoor()),
    },
    {
      text: t('shapes.wall'),
      width: '60px',
      src: wallImage,
      addShape: () => dispatch(addWall()),
    },
    {
      text: t('shapes.window'),
      width: '60px',
      src: windowImage,
      addShape: () => dispatch(addWindow()),
    },
    {
      text: t('shapes.box'),
      width: '60px',
      src: boxImage,
      addShape: () => dispatch(addBox()),
    },
    {
      text: t('shapes.coldAppliance'),
      width: '60px',
      src: coldApplianceImage,
      addShape: () => dispatch(addColdAppliance()),
    },
    {
      text: t('shapes.text'),
      width: '70px',
      src: textImage,
      addShape: () => dispatch(addText()),
      mb: 3,
    },
  ];
};

const AddShapeCatalogue = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const houseShapes = getHouseShapes(dispatch, t);
  const otherShapes = getOtherShapes(dispatch, t);

  return (
    <Box mb={10}>
      <Heading textAlign="center" fontSize="md" mb={4}>{t('shapes.houseShapesTitle')}</Heading>
      <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
        {houseShapes.map((props, index) => (
          <ImageWithText key={index} {...props} />
        ))}
      </Flex>

      <Heading textAlign="center" fontSize="md" my={4}>{t('shapes.otherShapesTitle')}</Heading>
      <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
        {otherShapes.map((props, index) => (
          <ImageWithText key={index} {...props} />
        ))}
      </Flex>
    </Box>
  );
};

export default AddShapeCatalogue;
