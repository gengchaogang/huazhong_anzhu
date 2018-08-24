import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandSellingNavBar',
  state: {
    current: 0,
    projectId: null,
  },
  reducers: {
    setCurrent(state, { payload }) {
      return { ...state, ...payload }
    },

    saveProjectId(state, action) {
      return { ...state, projectId: action.payload }
    }
  },
  effects: {

  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingDetails') {
          dispatch({
            type: 'setCurrent',
            payload: {
              current: 0
            }
          });
        } else if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingVideoAndImgs') {
          dispatch({
            type: 'setCurrent',
            payload: {
              current: 1
            }
          });
        } else if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingAgentBroker') {
          dispatch({
            type: 'setCurrent',
            payload: {
              current: 2
            }
          });
        } else if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingRecord') {
          dispatch({
            type: 'setCurrent',
            payload: {
              current: 3
            }
          });
        } else if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingDeal') {
          dispatch({
            type: 'setCurrent',
            payload: {
              current: 4
            }
          });
        }
      });
    },
  }
}
