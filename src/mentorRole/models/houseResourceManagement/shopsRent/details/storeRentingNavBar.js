import { routerRedux } from 'dva/router';
export default {
  namespace: 'storeRentingNavBar',
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
           if (location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
