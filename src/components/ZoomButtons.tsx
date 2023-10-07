import React from 'react';
import { VStack, IconButton, IconButtonProps } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('translation', { keyPrefix: 'stage.buttons' });

  return (
    <VStack maxW="fit-content" spacing={1} bg="white">
      <ZoomButton aria-label={t('zoomIn')} title={t('zoomIn') || ''} icon={<AddIcon />} onClick={onZoomIn} />
      <ZoomButton aria-label={t('zoomOut')} title={t('zoomOut') || ''} icon={<MinusIcon />} onClick={onZoomOut} />
    </VStack>
  );
};

export default ZoomButtons;
