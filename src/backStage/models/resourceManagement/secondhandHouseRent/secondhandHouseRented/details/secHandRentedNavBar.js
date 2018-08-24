import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandRentedNavBar',
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
           if (location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
