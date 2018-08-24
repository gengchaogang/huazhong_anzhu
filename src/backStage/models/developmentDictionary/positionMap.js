import {query} from '../../services/developmentDictionary/positionMap';
import { parse } from 'qs';
export default {
	namespace: 'positionMap',
	state: {

	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea/positionMap') {
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
