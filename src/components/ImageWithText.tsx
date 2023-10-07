import { Image, Flex, Text, Box } from '@chakra-ui/react';
import type { ImageProps } from '@chakra-ui/react';

export type ImageWithTextProps = Omit<ImageProps, 'as'> & {
  text: string;
  addShape: () => void;
};

const ImageWithText = ({ text, addShape, ...props }: ImageWithTextProps) => {
  return (
    <Flex
      bg="white"
      w="150px"
      h="150px"
      direction="column"
      justifyContent="center"
      alignItems="center"
      rounded="md"
      cursor="pointer"
      onClick={addShape}
    >
      <Image draggable={false} {...props} />
      <Box h={2} />
      <Text fontSize="sm">{text}</Text>
    </Flex>
  );
};

export default ImageWithText;
