import { routerRedux } from 'dva/router'
import {
  getMsgInfoFetch,
} from '../services/information';
import {
  isNull,
} from '../../commons/utils/currencyFunction'
const initState={
  title:'',
  timestamp:'',
  content:'',
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace:'informationInfo',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/information/informationInfo'){
         dispatch({
           type:'initComponent',
           payload:location.state,
         })
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'});
      if(!!payload.msgId){
        yield put({
          type:'getMsgInfo',
          payload:payload.msgId,
        });
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请重新进入消息详情页',
            title:'无效的消息id',
            todo:'getOut',
          },
        })
      }
    },
    //获取消息详情
    *getMsgInfo({payload},{call,select,put}){
      const{data}=yield call(getMsgInfoFetch,{id:payload});
      if(!!data){
        if(data.status==='success' && !!data.data){
          const result=data.data;
          const mainData={
            title:isNull(result.title,'-'),
            timestamp:isNull(result.createDateTime,'-'),
            content:isNull(result.message,'-'),
          }
          console.log('mainData',mainData);
          yield put({
            type:'updateMainData',
            payload:mainData,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取消息详情失败！',
              todo:'default',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请刷新页面',
            title:'获取消息详情失败！',
            todo:'default',
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ information }) => information.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt'});
          break;
        case 'getOut':
          yield put({type:'onlyClosePrompt'});
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({type:'onlyClosePrompt'});
          break;
      }
    },
  },
  reducers:{
    //更新提示模态框
    switchPrompt(state,action){
      return{...state,promptObj:{...state.promptObj,...action.payload}}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:{...state.promptObj,visible:false}}
    },
    //初始化state
    doInitState(state,action){
      return initState;
    },
    //更新mainData
    updateMainData(state,action){
      return {...state,...action.payload}
    },
  },
}
