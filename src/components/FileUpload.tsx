import { Box, type BoxProps } from '@chakra-ui/react';
import { useRef, type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import BlackButton from './BlackButton';

export interface FileUploadProps extends BoxProps {
  acceptedFileTypes?: string;

  loadFile: (fileContent: string) => void;
}

const FileUpload = ({ acceptedFileTypes, loadFile, ...props }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onloadend = (event) => {
      const fileContent = event.target?.result;
      if (!fileContent || !(typeof fileContent === 'string')) {
        return;
      }
      loadFile(fileContent);
    };

    reader.readAsText(file);
  };

  return (
    <Box {...props}>
      <BlackButton width="100%" title={t('menu.fileTab.openProjectTitle') || ''} onClick={() => inputRef.current?.click()}>
        Open project
        <input
          ref={inputRef}
          type="file"
          onChange={onChange}
          accept={acceptedFileTypes}
          hidden
        />
      </BlackButton>
    </Box>
  );
};

export default FileUpload;
