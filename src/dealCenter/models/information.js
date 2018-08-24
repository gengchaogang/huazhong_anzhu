import { routerRedux } from 'dva/router'
import {
  getMsgListFetch,
  markMsgRead,
} from '../services/information';
import {
  isNull,
} from '../../commons/utils/currencyFunction'
const initState={
  tableLoading:true,
  pagination:{
    total:0,
    current:1,
  },
  tableData:[],
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace:'information',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/information') {
         dispatch({type:'doInitState'});
         dispatch({type:'getMsgList'})
       }
     });
   },
  },
  effects:{
    //获取消息列表
    *getMsgList({payload},{call,select,put}){
      const {tableLoading,pagination:{current}}=yield select(({information})=>information);
      if(!tableLoading){
        yield put({
          type:'changeTableLoading',
          payload:true,
        })
      }
      const {data}=yield call(getMsgListFetch,{pageNo:current-1,pageSize:10});
      if(!!data){
        if(data.status==='success' && !!data.data.content){
          const tableData=data.data.content.map((item,index)=>({
            listCode:isNull(item.id,index),
            title:isNull(item.title,'-'),
            content:isNull(item.message,'-'),
            timestamp:isNull(item.createDateTime,'-'),
            noRead:isNull(item.readCount,0)===0,
            operation:'操作',
          }));
          yield put({
            type:'updateTableData',
            payload:{
              tableLoading:false,
              tableData,
              pagination:{
                total:isNull(data.data.totalElements,0),
                current:isNull(data.data.number,0)+1,
              }
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取消息列表失败！',
              todo:'default',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请刷新',
            title:'获取消息列表失败！',
            todo:'default',
          },
        });
      }
    },
    //标记消息为已读并且路由跳转到详情页
    *markMsgRead({payload},{call,put}){
      const {noRead,listCode}=payload;
      if(!noRead){
        yield put(routerRedux.push({
          pathname:'/information/informationInfo',
          state:{
            msgId:listCode,
          }
        }))
      }else{
        const {data}=yield call(markMsgRead,{id:listCode});
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put(routerRedux.push({
              pathname:'/information/informationInfo',
              state:{
                msgId:listCode,
              }
            }))
            // yield put({
            //   type:'main/lowerNoReadCount'
            // })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'标记消息已读失败！',
                todo:'default',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请刷新',
              title:'标记消息已读失败！',
              todo:'default',
            },
          });
        }
      }
    },
    //分页变化
    *changePage({payload},{put}){
      yield put({
        type:'changePageCurrent',
        payload,
      });
      yield put({type:'getMsgList'})
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ information }) => information.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt'});
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
    //tableLoading
    changeTableLoading(state,action){
      return {...state,tableLoading:action.payload}
    },
    //更新表格数据
    updateTableData(state,action){
      return {...state,...action.payload}
    },
    //更新表格分页
    changePageCurrent(state,action){
      return {...state,pagination:{...state.pagination,current:action.payload}}
    },
  },
}
