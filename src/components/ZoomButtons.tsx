import React from 'react';
import { VStack, IconButton, IconButtonProps } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

const ZoomButton = ({ children, ...props }: IconButtonProps): JSX.Element => {
  return (
    <IconButton
      size="sm"
      colorScheme="gray"
      {...props}
    >
      {children}
    </IconButton>
  );
};

interface ZoomButtonsProps {
  onZoomIn: (event: React.MouseEvent) => void;
  onZoomOut: (event: React.MouseEvent) => void;
}

const ZoomButtons = ({ onZoomIn, onZoomOut }: ZoomButtonsProps): JSX.Element => {
  return (
    <VStack maxW="fit-content" spacing={1} bg="white">
      <ZoomButton aria-label="Zoom in" icon={<AddIcon />} onClick={onZoomIn} />
      <ZoomButton aria-label="Zoom out" icon={<MinusIcon />} onClick={onZoomOut} />
    </VStack>
  );
};

export default ZoomButtons;
