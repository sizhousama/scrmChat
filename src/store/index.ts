import { createContext, useContext } from 'react';
import { STORE_NAVH, NavStore } from './nav';
import { STORE_USERINFO, UserStore } from './user';

function createStores() {
  return {
    [STORE_NAVH]: new NavStore(),
    [STORE_USERINFO]: new UserStore(),
  };
}

const stores = createStores();
const StoresContext = createContext(stores);
const useStores = () => useContext(StoresContext);


// 导航高度
function useNavStore() {
  const { navStore } = useStores();
  return navStore;
}
// 用户信息
function useUserStore() {
  const { userInfoStore } = useStores();
  return userInfoStore;
}
export {
  stores,
  StoresContext,
  useNavStore,
  useUserStore,
};