import { createContext, useContext } from 'react';
import { STORE_NAVH, NavStore } from './nav';
import { STORE_USERINFO, UserStore } from './user';
import { STORE_FAN, FanStore } from './fan';
import { STORE_ORDER, OrderStore } from './order';
import { STORE_WSIO, WsioStore } from './socket';

function createStores() {
  return {
    [STORE_NAVH]: new NavStore(),
    [STORE_USERINFO]: new UserStore(),
    [STORE_FAN]: new FanStore(),
    [STORE_WSIO]: new WsioStore(),
    [STORE_ORDER]: new OrderStore(),
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

// 粉丝
function useFanStore() {
  const { fanStore } = useStores();
  return fanStore;
}

// socket
function useWsioStore() {
  const { wsioStore } = useStores();
  return wsioStore;
}

// socket
function useOrderStore() {
  const { orderStore } = useStores();
  return orderStore;
}

export {
  stores,
  StoresContext,
  useNavStore,
  useUserStore,
  useFanStore,
  useWsioStore,
  useOrderStore
};