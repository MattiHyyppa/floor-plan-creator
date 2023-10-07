import { Button, VStack } from '@chakra-ui/react';

import { useAppDispatch } from '../hooks';
import {
  addRectangleHouse,
  addLShapedHouse,
  addExteriorDoor,
  addInteriorDoor,
  addWall,
  addWindow,
} from '../redux/slices/canvasSlice';

const AddShapeCatalogue = () => {
  const dispatch = useAppDispatch();

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={() => dispatch(addRectangleHouse())}>Add rectangular house</Button>
      <Button colorScheme="blue" onClick={() => dispatch(addLShapedHouse())}>Add L-shaped house</Button>

      <Button colorScheme="blue" onClick={() => dispatch(addExteriorDoor())}>Add exterior door</Button>
      <Button colorScheme="blue" onClick={() => dispatch(addInteriorDoor())}>Add interior door</Button>
      <Button colorScheme="blue" onClick={() => dispatch(addWall())}>Add wall</Button>
      <Button colorScheme="blue" onClick={() => dispatch(addWindow())}>Add window</Button>
    </VStack>
  );
};

export default AddShapeCatalogue;
