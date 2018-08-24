import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandRentingNavBar',
  state: {
    current: 0,
    projectId:null,
  },
  reducers: {
    setCurrent(state,action){
      return{...state,current:action.payload}
    },
    setState(state,{payload}){
      return{...state,...payload}
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
           if (location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingDetails') {
             dispatch({
               type: 'setState',
               payload:{
                 current:0,
                 projectId:location.state.projectId,
               }
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
