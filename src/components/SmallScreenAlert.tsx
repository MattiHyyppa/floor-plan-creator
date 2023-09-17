import { useTranslation } from 'react-i18next';
import {
  Box,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react';

const SmallScreenAlert = () => {
  const { t } = useTranslation();

  return (
    <Box w="100%" h="100%" p={2}>
      <Alert
        status="info"
        variant="left-accent"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <AlertIcon />
        <AlertDescription mt={1}>{t('alert.screenWidthTooSmall')}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default SmallScreenAlert;
