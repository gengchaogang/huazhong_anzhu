import {
  getTransCode,getTrackByGroupKeyFetch
} from  '../../../../services/resourceManagement/newHouseProDetails/detailsDeal'
import { routerRedux } from 'dva/router';
import {
  renderSHRentTrackDataJSON,
} from '../../../../../commons/utils/currencyFunction'
import {message} from 'antd';
export default {
  namespace: 'storeRentingDeal',
  state: {
    projectId:null,
    trackJSON:null,
    transCode:null,
    modalVisible:false,
    submitLoading:false,
    track:'',
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
    saveid(state,action){
      return{...state,...action.payload}
    },
    setState(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *saveProjectId({payload},{call,put}){
      yield put({type:'saveid',
        payload:{
          projectId:payload.id
        }
      })
      const {data}=yield call(getTransCode,{...payload})
      if(data.data){
        if(data.data.transCode){
          const resuilt=yield call(getTrackByGroupKeyFetch,{groupKey:data.data.transCode});
          if(!!resuilt.data.data){
            yield put({
              type:'setState',
              payload:{
                trackJSON:renderSHRentTrackDataJSON(resuilt.data.data.trackDetail,data.data.transCode),
                transCode:data.data.transCode,
              }
            })
          }
        }
      }else{
        message.error(data.message)
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/resourceManagement/storeRent/storeRentingNavBar/storeRentingDeal') {
            //  console.log('loaction',location);
             dispatch({
               type:"saveProjectId",
               payload:{
                 id:location.state.projectId
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
