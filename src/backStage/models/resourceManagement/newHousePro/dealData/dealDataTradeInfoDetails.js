import { routerRedux } from 'dva/router'
import {
  creatTrackJSON,renderNHTrackDataJSON
} from '../../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../../services/resourceManagement/newHousePro/dealDataTradeInfoDetails'
const initState={
  groupKey:null,
  trackJSON:null,
  loading:true,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'dealDataTradeInfoDetails',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/resourceManagement/newHousePro/dealData/dealDataTradeInfoDetails') {
          dispatch({
            type:'doInitState',
          })
          if(!!location.state.groupKey){
            dispatch({
              type:'getTrackInfo',
              payload:location.state.groupKey,
            })
          }else{
            dispatch({
              visible:true,
              description:'未获得groupKey',
              title:'获取交易数据失败',
              okText:'确定',
              todo:'getOut',
            })
          }
        }
      });
    },
  },
  effects:{
    //获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON:renderNHTrackDataJSON(data.data),
              groupKey:payload,
            },
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
            description:'请求失败，请联系管理员',
            title:'获取交易数据失败！',
            okText:'确定',
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ dealDataTradeInfoDetails }) => dealDataTradeInfoDetails.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },

  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    initTrackData(state,action){
      return {...state,...action.payload,loading:false}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return{...state,promptObj:initState.promptObj}
    },
  },
}
