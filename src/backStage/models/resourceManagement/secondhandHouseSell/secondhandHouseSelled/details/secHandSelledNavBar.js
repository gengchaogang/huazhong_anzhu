import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandSelledNavBar',
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
           if (location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledDetails') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
