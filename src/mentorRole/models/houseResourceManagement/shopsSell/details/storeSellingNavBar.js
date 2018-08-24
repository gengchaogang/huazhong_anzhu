import { routerRedux } from 'dva/router';
export default {
  namespace: 'storeSellingNavBar',
  state: {
    current: 0,
    projectId:null,
  },
  reducers: {
    setCurrent(state,action){
      return{...state,current:action.payload}
    },

    saveProjectId(state,action){
      return{...state,projectId:action.payload}
    }
  },
  effects:{

  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
