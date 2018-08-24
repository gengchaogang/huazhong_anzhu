import {
  // getInitDataFetch,
} from  '../../../../../services/resourceManagement/newHouseProDetails/detailsDeal'
import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandSelledDeal',
  state: {
    projectId:null,
    modalVisible:false,
    submitLoaded:false,
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
  },
  reducers: {
    saveProjectId(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *getInitData({payload},{call,put}){
      // const {data}=yield call(getInitDataFetch,{...payload})
      // if(!!data&&data.status==='success'){
      //
      // }else{
      //
      // }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledDeal') {
             console.log('loaction',location);
             dispatch({
               type:"saveProjectId",
               payload:{
                 projectId:location.state.projectId
               }
             })
            //  dispatch({
            //    type:"getInitData",
            //    payload:{
            //      id:location.state.projectId
            //    }
            //  })
           }
         });
       },
  }
}
