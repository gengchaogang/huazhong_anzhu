import { routerRedux } from 'dva/router'
import {
  renderSHSellTrackDataJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
const initState={
  transCode:null,
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
  namespace: 'secondHouseSellTradeInfoDetails',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails') {
          dispatch({
            type:'doInitState',
          })
          if(!!location.state && !!location.state.transCode){
            dispatch({
              type:'getTrackInfo',
              payload:location.state.transCode,
            })
          }else{
            dispatch({
              visible:true,
              description:'未获得transCode',
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
      console.log('获得track数据');
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
        console.log('获得track数据',data);
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON:renderSHSellTrackDataJSON(trackDetail,payload),
              transCode:payload,
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
      const {todo} = yield select(({ secondHouseSellTradeInfoDetails }) => secondHouseSellTradeInfoDetails.promptObj);
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
