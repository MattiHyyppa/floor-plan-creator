import {
  Flex,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../hooks';
import {
  addRectangleHouse,
  addLShapedHouse,
  addExteriorDoor,
  addInteriorDoor,
  addWall,
  addWindow,
} from '../redux/slices/canvasSlice';
import ImageWithText from './ImageWithText';
import lShapedHouseImage from '../assets/images/l-shaped-house.png';
import rectangleHouseImage from '../assets/images/rectangle-house.png';
import exteriorDoorImage from '../assets/images/exterior-door.png';
import interiorDoorImage from '../assets/images/interior-door.png';
import wallImage from '../assets/images/wall.png';
import windowImage from '../assets/images/window.png';

const AddShapeCatalogue = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Box mb={10}>
      <Heading textAlign="center" fontSize="md" mb={4}>{t('shapes.houseShapesTitle')}</Heading>
      <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
        <ImageWithText
          text={t('shapes.rectangleHouse')}
          boxSize="80px"
          src={rectangleHouseImage}
          addShape={() => dispatch(addRectangleHouse())}
        />
        <ImageWithText
          text={t('shapes.lShapedHouse')}
          boxSize="80px"
          src={lShapedHouseImage}
          addShape={() => dispatch(addLShapedHouse())}
        />
      </Flex>

      <Heading textAlign="center" fontSize="md" my={4}>{t('shapes.otherShapesTitle')}</Heading>
      <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
        <ImageWithText
          text={t('shapes.exteriorDoor')}
          boxSize="60px"
          src={exteriorDoorImage}
          addShape={() => dispatch(addExteriorDoor())}
        />
        <ImageWithText
          text={t('shapes.interiorDoor')}
          boxSize="60px"
          src={interiorDoorImage}
          addShape={() => dispatch(addInteriorDoor())}
        />
        <ImageWithText
          text={t('shapes.wall')}
          boxSize="60px"
          src={wallImage}
          addShape={() => dispatch(addWall())}
        />
        <ImageWithText
          text={t('shapes.window')}
          boxSize="60px"
          src={windowImage}
          addShape={() => dispatch(addWindow())}
        />
      </Flex>
    </Box>
  );
};

export default AddShapeCatalogue;
