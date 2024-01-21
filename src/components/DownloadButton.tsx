import { Link } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import BlackButton from './BlackButton';

export interface DownloadButtonProps extends ButtonProps {
  fileContent: string;
  filename: string;
}

const DownloadButton = ({ fileContent, filename, ...props }: DownloadButtonProps) => {
  const { t } = useTranslation();
  const file = new Blob([fileContent], { type: 'text/plain' });

  return (
    <Link
      download={filename}
      target="_blank"
      rel="noreferrer"
      href={URL.createObjectURL(file)}
      style={{ textDecoration: 'none' }}
    >
      <BlackButton w="100%" {...props}>
        {t('menu.fileTab.exportProject')}
      </BlackButton>
    </Link>
  );
};

export default DownloadButton;
