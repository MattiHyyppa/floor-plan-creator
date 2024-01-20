import { Box, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FileUpload from './FileUpload';
import DownloadButton from './DownloadButton';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loadShapesFromFile } from '../utils/import';

const FileOptions = () => {
  const allShapes = useAppSelector((state) => state.canvas.shapes);
  const fileContent = JSON.stringify(allShapes, null, '  ');
  const filename = 'floor-plan-creator.json';

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const loadFile = async (fileContent: string) => {
    const result = await loadShapesFromFile(fileContent, dispatch);
    if (result.status === 'error') {
      toast({
        description: t('menu.fileTab.openingProjectFailedMessage'),
        status: 'error',
        position: 'top',
        variant: 'subtle',
        duration: 7000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <FileUpload
        acceptedFileTypes="json"
        loadFile={loadFile}
        mb={4}
      />
      <DownloadButton
        filename={filename}
        fileContent={fileContent}
        title={t('menu.fileTab.exportProjectTitle') || ''}
      />
    </Box>
  );
};

export default FileOptions;
