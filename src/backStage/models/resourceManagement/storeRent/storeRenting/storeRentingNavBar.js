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
           if (location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingDetails') {
             dispatch({
               type: 'setState',
               payload:{
                 current:0,
                 projectId:location.state.projectId,
               }
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
