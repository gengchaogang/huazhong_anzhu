// import {findAllAreasFetch,
// } from '../../services/contentCheck/brokerNameCertificate';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace: 'authenticationDetail',
	state: {

	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/authenticationDetail') {

				}
			});
		},
	},
	effects: {
    *findAllAreas({ payload }, { call, put }){

    },
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
