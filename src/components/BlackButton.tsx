import { Button } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';

const BlackButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      bg="black"
      color="white"
      fontSize="0.9em"
      _hover={{ background: '#353535' }}
      _active={{ background: '#353535' }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BlackButton;
