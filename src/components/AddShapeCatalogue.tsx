import { Button, VStack } from '@chakra-ui/react';

import { useAppDispatch } from '../hooks';
import { addRectangleHouse } from '../redux/slices/canvasSlice';

const AddShapeCatalogue = () => {
  const dispatch = useAppDispatch();

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={() => dispatch(addRectangleHouse())}>Add rectangular house</Button>
      <Button colorScheme="blue">Add L-shaped house</Button>

      <Button colorScheme="blue">Add exterior door</Button>
      <Button colorScheme="blue">Add interior door</Button>
      <Button colorScheme="blue">Add wall</Button>
      <Button colorScheme="blue">Add window</Button>
    </VStack>
  );
};

export default AddShapeCatalogue;
