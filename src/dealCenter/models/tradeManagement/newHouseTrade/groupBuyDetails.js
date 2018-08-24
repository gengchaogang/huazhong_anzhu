import {query} from '../../../services/tradeManagement/newHouseTrade/groupBuyDetails';
import {
  creatTrackJSON,
} from '../../../../commons/utils/currencyFunction'
import { routerRedux } from 'dva/router'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
const arrGroupOffersTable=[];
const groupOffersFunc=(obj)=>{
  arrGroupOffersTable.push({
    key:'001',
    pic:obj.pic,
    details:obj.details,
    number:obj.number,
    payAway:obj.payAway,
    paySerialNumber:obj.paySerialNumber,
    payCustomer:obj.payCustomer,
    customerPhone:obj.customerPhone,
    payTime:obj.payTime,
    payCash:obj.payCash,
    payStatus:obj.payStatus,
  })
  return arrGroupOffersTable
}
const initState={
  loading:true,
  trackJSON:null,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'groupBuyDetails',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/groupBuyDetails') {
          dispatch({type:'doInitState'})
          if(!!location.state && !!location.state.groupKey){
            dispatch({
              type:'findTrackByGroupKey',
              payload:location.state.groupKey,
            })
          }else{

          }
        }
      });
    },
  },
  effects:{
    //获取track数据
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
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ creatGroupBuy }) => creatGroupBuy.promptObj);
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
  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    initTrackData(state,action){
      return {...state,trackJSON:action.payload,loading:false}
    },
  },
}
