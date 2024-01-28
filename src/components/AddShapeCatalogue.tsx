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
  addElectricAppliance,
  addText,
  addSink,
  addStove,
  addToilet,
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
import electricApplianceImage from '../assets/images/electric-appliance.png';
import textImage from '../assets/images/text.png';
import sinkImage from '../assets/images/sink.png';
import stoveImage from '../assets/images/stove.png';
import toiletImage from '../assets/images/toilet.png';

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
      width: '52px',
      src: exteriorDoorImage,
      addShape: () => dispatch(addExteriorDoor()),
    },
    {
      text: t('shapes.interiorDoor'),
      width: '52px',
      src: interiorDoorImage,
      addShape: () => dispatch(addInteriorDoor()),
    },
    {
      text: t('shapes.wall'),
      width: '70px',
      src: wallImage,
      addShape: () => dispatch(addWall()),
    },
    {
      text: t('shapes.window'),
      width: '70px',
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
      text: t('shapes.electricAppliance'),
      width: '40px',
      src: electricApplianceImage,
      addShape: () => dispatch(addElectricAppliance()),
    },
    {
      text: t('shapes.text'),
      width: '70px',
      src: textImage,
      addShape: () => dispatch(addText()),
      mb: 3,
    },
    {
      text: t('shapes.sink'),
      width: '36px',
      src: sinkImage,
      addShape: () => dispatch(addSink()),
      mb: 1,
    },
    {
      text: t('shapes.stove'),
      width: '40px',
      src: stoveImage,
      addShape: () => dispatch(addStove()),
      mb: 1,
    },
    {
      text: t('shapes.toilet'),
      width: '28px',
      src: toiletImage,
      addShape: () => dispatch(addToilet()),
      mb: 1,
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
