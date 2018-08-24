import {
  getReportTrackFollowByGroupKey,
  getTransCode,
  getTrackByGroupKeyFetch
} from  '../../../../services/newHouseProDetails/detailsDeal'
import { routerRedux } from 'dva/router';
import {message} from 'antd';
import {
  creatSeconHouseSellTrackJSON,
} from '../../../../../commons/utils/backStageTrack'
import {
  renderSHSellTrackDataJSON,
} from '../../../../../commons/utils/currencyFunction'
export default {
  namespace: 'secHandRentingDeal',
  state: {
    projectId:null,
    track:'',
    modalVisible:false,
    submitLoading:false,
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
    setState(state,{payload}){
      return{...state,...payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *getInitData({payload},{call,put}){
      yield put({
        type:"saveProjectId",
        payload:{
          projectId:payload.id
        }
      })
      const {data,err}=yield call(getTransCode,{...payload});
      if(err){
        message.error(data.message)
        return
      }
      if(!!data.data.transCode){
        const resuilt=yield call(getTrackByGroupKeyFetch,{groupKey:data.data.transCode});
        if(!!resuilt.data.data){
          yield put({
            type:'setState',
            payload:{
              track:renderSHSellTrackDataJSON(resuilt.data.data.trackDetail,data.data.transCode)
            }
          })
        }
      }else{
        message.error('暂无数据,请联系管理员')
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceRentManagement/secondHandHouseRent/secHandRentingNavBar/secHandRentingDeal') {
             dispatch({
                type:"getInitData",
                payload:{
                  id:location.state.projectId
                }
             })
           }
         });
       },
  }
}
