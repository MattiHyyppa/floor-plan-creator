import React from 'react';
import { HStack, IconButton, IconButtonProps } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const Button = ({ children, ...props }: IconButtonProps): JSX.Element => {
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

interface UndoRedoButtonsProps {
  onUndo: (event: React.MouseEvent) => void;
  onRedo: (event: React.MouseEvent) => void;
}

const UndoRedoButtons = ({ onUndo, onRedo }: UndoRedoButtonsProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'stage.buttons' });

  return (
    <HStack maxW="fit-content" spacing={1} bg="white">
      <Button aria-label={t('undo')} title={t('undo') || ''} icon={<ArrowBackIcon />} onClick={onUndo} />
      <Button aria-label={t('redo')} title={t('redo') || ''} icon={<ArrowForwardIcon />} onClick={onRedo} />
    </HStack>
  );
};

export default UndoRedoButtons;
