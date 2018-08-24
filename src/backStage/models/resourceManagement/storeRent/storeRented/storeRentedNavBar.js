import { routerRedux } from 'dva/router';
export default {
  namespace: 'storeRentedNavBar',
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
           if (location.pathname === '/resourceManagement/storeRent/storeRentedNavBar/storeRentedDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentedNavBar/storeRentedVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentedNavBar/storeRentedAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentedNavBar/storeRentedRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentedNavBar/storeRentedDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
