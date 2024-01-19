import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FileUpload from './FileUpload';
import DownloadButton from './DownloadButton';
import { useAppSelector } from '../hooks';

const FileOptions = () => {
  const { t } = useTranslation();
  const allShapes = useAppSelector((state) => state.canvas.shapes);
  const fileContent = JSON.stringify(allShapes, null, '  ');
  const filename = 'floor-plan-creator.json';

  return (
    <Box>
      <FileUpload
        acceptedFileTypes="json"
        loadFile={(fileContent) => console.log(fileContent)}
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
