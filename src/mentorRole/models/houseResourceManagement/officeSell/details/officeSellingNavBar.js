import { routerRedux } from 'dva/router';
export default {
  namespace: 'officeSellingNavBar',
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
           if (location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
