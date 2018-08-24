import {query} from '../../services/developmentDictionary/shopsPosition';
import { parse } from 'qs';
export default {
	namespace: 'shopsPosition',
	state: {

	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/shopsManagement/shopsPosition') {
          dispatch({
            type: 'query',
          });
				}
			});
		},
	},
	effects: {
    *query({ payload }, { call, put }){
      const  data  = yield call(query, parse(payload));
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
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
