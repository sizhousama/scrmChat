import { createContext, useContext } from 'react';
import { STORE_NAVH, NavStore } from './nav';

function createStores() {
  return {
    [STORE_NAVH]: new NavStore(),
  };
}

const stores = createStores();

const StoresContext = createContext(stores);

const useStores = () => useContext(StoresContext);

function useNavStore() {
  const { navStore } = useStores();
  return navStore;
}

export {
  stores,
  useNavStore,
  StoresContext
};