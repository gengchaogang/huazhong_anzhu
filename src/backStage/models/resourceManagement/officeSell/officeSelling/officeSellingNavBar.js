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
           if (location.pathname === '/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingDetails') {
             dispatch({
               type: 'setState',
               payload:{
                 current:0,
                 projectId:location.state.projectId,
               }
             });
           }else if(location.pathname === '/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingVideoAndImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingAgentBroker'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingRecord'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingDeal'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }
         });
       },
  }
}
