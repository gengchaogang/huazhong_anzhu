import {query} from '../../../services/tradeManagement/newHouseTrade/uploadData';
import {parse} from 'qs';
export default {
  namespace: 'uploadData',
  state: {
    groupKeyData:{},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/uploadData') {
          if(1==1){
           //已经确定了项目,获取之前的数据
            dispatch({
              type:'query',
              payload:'iD1',
            });
          }else{
            alert('未获取到之前的数据')
          }
        }
      });
    },
  },
  effects:{
    *query({ payload }, { call, put }){
      const  data  = yield call(query, parse(payload));
      // console.log(data,'data111');
      if(data){
        yield put ({
          type: 'querySuccess',
          payload: {

          },
        });
      }
    },
  },
  reducers: {
    querySuccess(state,action){
      return { ...state, ...action.payload };
    },
  },
}
