// import {} from '../../services//';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'newCreateMatchProjects',
	state:{

	},
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '//') {
					dispatch({
						type: '',
						payload:{

						}
					});
				}
			});
		},
	},
	effects: {

	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
	},

}
