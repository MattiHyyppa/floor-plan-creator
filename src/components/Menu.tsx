import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import EditShapesForm from './Forms/EditShapesForm';

const Menu = () => {
  const { t } = useTranslation();

  return (
    <Tabs p={1}>
      <TabList borderColor="gray.300">
        <Tab fontSize="sm">{t('menu.add')}</Tab>
        <Tab fontSize="sm">{t('menu.edit')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={1} py={2}>
          <p>one!</p>
        </TabPanel>
        <TabPanel px={[2, null, 3]} py={4}>
          <EditShapesForm />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Menu;
