import { routerRedux } from 'dva/router'

import {
  creatTrackJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
export default {
  namespace: 'doLookDetails',
  state: {
    trackJSON:null,
    loading:true,
    promptObj:{
      visible:false,
      description:'',
      title:'',
      okText:'确定',
      todo:'default',
    },
    groupKey:null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/tradeManagement/newHouseTrade/doLookDetails') {
          if(!!location.state && !!location.state.groupKey){
            //已经确定了项目,获取之前的数据
            dispatch({
              type:'setGroupKey',
              payload:location.state.groupKey,
            })
            dispatch({
              type:'findTrackByGroupKey',
              payload:location.state.groupKey,
            });
          }else{
            dispatch({
              type: 'notGetGroupId',
              payload:{
                visible:true,
                content:'请联系管理员',
                title:'获取groupKey失败！',
                okText:'确定',
                type:'error',
              },
            });
          }
        }
      });
    },
  },
  effects:{
    *notGetGroupId({payload},{put,call}){
      yield put({
        type:'switchPrompt',
        payload,
      })
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ doLookDetails }) => doLookDetails.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    *findTrackByGroupKey({payload},{put,call}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload});
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:JSON.stringify(creatTrackJSON(data.data)),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取交易数据失败',
            okText:'确定',
          },
        });
      }
    },
  },
  reducers: {
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setGroupKey(state,action){
      return {...state,groupKey:action.payload}
    },
    initTrackData(state,action){
      return {...state,trackJSON:action.payload,loading:false}
    },
  },
}
