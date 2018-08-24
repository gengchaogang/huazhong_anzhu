import {
  // getInitDataFetch,
  getReportTrackFollowByGroupKey,getTransCode,getTrackByGroupKeyFetch
} from  '../../../../../services/resourceManagement/newHouseProDetails/detailsDeal'
import { routerRedux } from 'dva/router';
import {
  renderSHSellTrackDataJSON,
} from '../../../../../../commons/utils/currencyFunction'
import {message} from 'antd';
export default {
  namespace: 'secHandSellingDeal',
  state: {
    projectId:null,
    modalVisible:false,
    submitLoading:false,
    track:'',
    trackJSON:null,
    transCode:null,
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
    saveTransCode(state,action){
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
    *getTrackGruopKey({payload},{call,put}){
      yield put({type:'saveProjectId',
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
              trackJSON:renderSHSellTrackDataJSON(resuilt.data.data.trackDetail,data.data.transCode),
              transCode:data.data.transCode,
            }
          })
        }
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
     history.listen(location =>{
        if (location.pathname === '/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingDeal') {
          dispatch({
            type:'getTrackGruopKey',
            payload:{
              id:location.state.projectId,
            }
          })
        }
      });
    },
  }
}
