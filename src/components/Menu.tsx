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
    <Tabs p={1} h="100%">
      <TabList borderColor="gray.300">
        <Tab fontSize="sm">{t('menu.add')}</Tab>
        <Tab fontSize="sm">{t('menu.edit')}</Tab>
      </TabList>
      <TabPanels h="calc(100% - 40px)">
        <TabPanel px={1} py={2}>
          <p>one!</p>
        </TabPanel>
        <TabPanel px={0} pt={4} pb={0} h="100%">
          <EditShapesForm />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Menu;
