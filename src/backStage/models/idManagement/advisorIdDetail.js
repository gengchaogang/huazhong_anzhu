import {detail,tryFreeze,tryUnFreeze} from '../../services/idManagement/advisorIdIndex';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'advisorIdDetail',
	state: {
		id: 0,
		data: null,
		shawMadolStatus:false,
		zhanghaoJieDongClickStatus:false,
		dongjieReasonStatus:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/advisorIdIndex/advisorIdDetail') {
          dispatch({
						type: 'init',
						payload: {
							id: location.state.id
						}
          });
				}
			});
		},
	},
	effects: {
		*init({payload}, { call, put, select }){
			yield put({type: "initState", id: payload.id});
			yield put({type: "query"});
		},
    *query({ payload }, { call, put, select }){
			const id=yield select(({advisorIdDetail})=>advisorIdDetail.id);
      const {data, err} = yield call(detail, {id: id});
			if(err){
				message.info('查询错误！'+err.message,6);
				return;
			}
			if(data.status == "success"){
				yield put({type: 'querySuccess', payload: {data: data.data}});
      }else {
      	message.info('查询错误！'+data.message,6);
      }
			yield put({type: "unLoading"});
    },
		*tryFreeze({ payload }, { call, put, select }){
			yield put({type: "snapReason", payload: {...payload}});
			yield put({type: "setLoading"});
			const params = {reasons: payload.reason,blockDays:payload.blockDays};
			const id=yield select(({advisorIdDetail})=>advisorIdDetail.id);
			params.id = id;
			console.log("tryFreeze params>",params);
      const {data,err} = yield call(tryFreeze, params);
			if(err){
				yield put({type: "unLoading"});
				message.info('访问错误！'+err.message,6);
				return;
			}
      if(data.status == "success"){
				message.success("冻结账号成功！",6);
				yield put({type: 'dongjieReasonHandleOk'});
				yield put({type: 'query'});
			}else {
				message.info('冻结账号错误！'+data.message,6);
				yield put({type: "unLoading"});
			}
		},
		*tryUnFreeze({ payload }, { call, put, select }){
			yield put({type: "setLoading"});
			const id=yield select(({advisorIdDetail})=>advisorIdDetail.id);
      const {data,err} = yield call(tryUnFreeze, {id: id});
			if(err){
				yield put({type: "unLoading"});
				message.info('访问错误！'+err.message,6);
				return;
			}
			console.log(data);
      if(data.status == "success"){
				message.success("解冻账号成功！",6);
				yield put({type: 'zhanghaoJieDongHandleOk'});
				yield put({type: 'query'});
			}else {
				yield put({type: "unLoading"});
				message.info('解冻账号错误！'+data.message,6);
			}
		},
	},
	reducers: {
		initState(state, action){
			return {...state,  data: null, id: action.id, loading: true,freezeObj:{}};
		},
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
		advisorIdDetailShowModal(state,{payload}){
			return { ...state, shawMadolStatus:!state.shawMadolStatus};
		},
		advisorIdDetailHandleOk(state,{payload}){
			return { ...state, shawMadolStatus:!state.shawMadolStatus};
		},
		advisorIdDetailHandleCancel(state,{payload}){
			return { ...state, shawMadolStatus:!state.shawMadolStatus};
		},
		zhanghaoJieDongClick(state,{payload}){
			return { ...state, zhanghaoJieDongClickStatus:!state.zhanghaoJieDongClickStatus};
		},
		zhanghaoJieDongHandleOk(state,{payload}){
			return { ...state, zhanghaoJieDongClickStatus:!state.zhanghaoJieDongClickStatus};
		},
		zhanghaoJieDongHandleCancel(state,{payload}){
			return { ...state, zhanghaoJieDongClickStatus:!state.zhanghaoJieDongClickStatus};
		},
		dongjieReasonClick(state,{payload}){
			return { ...state, dongjieReasonStatus:!state.dongjieReasonStatus};
		},
		dongjieReasonHandleOk(state,{payload}){
			return { ...state, dongjieReasonStatus:!state.dongjieReasonStatus};
		},
		dongjieReasonHandleCancel(state,{payload}){
			return { ...state, dongjieReasonStatus:!state.dongjieReasonStatus,freezeObj:{}};
		},
		setLoading(state){
			return {...state, loading: true};
		},
		unLoading(state){
			//state.loading = false;
			return {...state, loading: false};
		},
		snapReason(state,{payload}){
			state.freezeObj = {...payload};
			return state;
		},
	},
}
