import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import AddShapeCatalogue from './AddShapeCatalogue';
import EditShapesForm from './Forms/EditShapesForm';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setActiveTab } from '../redux/slices/menuSlice';

const Menu = () => {
  const activeTab = useAppSelector(state => state.menu.activeTab);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Tabs index={activeTab} onChange={(index) => dispatch(setActiveTab(index))} p={1} h="100%">
      <TabList borderColor="gray.300">
        <Tab fontSize="sm">{t('menu.add')}</Tab>
        <Tab fontSize="sm">{t('menu.edit')}</Tab>
      </TabList>
      <TabPanels h="calc(100% - 40px)">
        <TabPanel px={1} pt={4} pb={0} h="100%">
          <AddShapeCatalogue />
        </TabPanel>
        <TabPanel px={0} pt={4} pb={0} h="100%">
          <EditShapesForm />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Menu;
