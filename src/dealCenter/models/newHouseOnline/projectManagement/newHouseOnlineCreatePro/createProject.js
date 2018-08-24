import { routerRedux } from 'dva/router';
export default {
  namespace: 'createProject',
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
           if (location.pathname === '/newHouseOnline/projectManagement/createProject/basicMessage') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/newHouseOnline/projectManagement/createProject/uploadProjectPhoto'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/newHouseOnline/projectManagement/createProject/houseTypeImgManagement'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/newHouseOnline/projectManagement/createProject/createProjectTable'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }else if(location.pathname === '/newHouseOnline/projectManagement/createProject/createProjectConcessions'){
             dispatch({
               type: 'setCurrent',
               payload:4
             });
           }else if(location.pathname === '/newHouseOnline/projectManagement/createProject/uploadAptitude'){
             dispatch({
               type: 'setCurrent',
               payload:5
             });
           };
         });
       },
  }
}
