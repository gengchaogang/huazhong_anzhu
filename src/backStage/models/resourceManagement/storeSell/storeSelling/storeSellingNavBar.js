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
           console.log(location,'locationlocation');
           if (location.pathname === '/resourceManagement/storeSell/storeSellingNavBar/storeSellingDetails') {
             dispatch({
               type: 'setState',
               payload:{
                 current:0,
                 projectId:location.state.projectId,
               }
             });
           }else if(location.pathname === '/resourceManagement/storeSell/storeSellingNavBar/storeSellingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/storeSell/storeSellingNavBar/storeSellingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/storeSell/storeSellingNavBar/storeSellingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/storeSell/storeSellingNavBar/storeSellingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
