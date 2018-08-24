import {detail, tryFreeze,tryUnFreeze} from '../../services/idManagement/brokerIdIndex';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'brokerIdDetail',
	state: {
		data: {
			realNameAuthentication: {},
			professionalCertification: {},
			blockedInfo: {}
		},
		id: 0,
		loading: true,
		freezeObj: {},

    zhanghaoJieDongStatus:false,
    dongJieZhaoHaoStatus:false,
    realNameCertifiedState:'未认证',
    certificationRofessionalState:'未认证',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/brokerIdIndex/brokerIdDetail') {
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
    *query(action, { call, put, select }){
			const id=yield select(({brokerIdDetail})=>brokerIdDetail.id);
			//console.log("query id>",id);
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
			const params = {reason: payload.reason,blockDays:payload.blockDays};
			const id=yield select(({brokerIdDetail})=>brokerIdDetail.id);
			params.id = id;
			// params.blockDateTime = "2017-02-07 15:14:38";
			// console.log("tryFreeze params>",params);
      const {data,err} = yield call(tryFreeze, params);
			if(err){
				yield put({type: "unLoading"});
				message.info('访问错误！'+err.message,6);
				return;
			}
      if(data.status == "success"){
				console.log(data);
				yield put({type: 'dongJieZhaoHaoHandleOk'});
				yield put({type: 'query'});
			}else {
				message.info('冻结账号错误！'+data.message,6);
			}
			yield put({type: "unLoading"});
		},
		*tryUnFreeze({ payload }, { call, put, select }){
			yield put({type: "setLoading"});
			const id=yield select(({brokerIdDetail})=>brokerIdDetail.id);
      const {data,err} = yield call(tryUnFreeze, {id: id});
			if(err){
				yield put({type: "unLoading"});
				message.info('访问错误！'+err.message,6);
				return;
			}
			console.log(data);
      if(data.status == "success"){
				yield put({type: 'zhanghaoJieDongHandleOk'});
				yield put({type: 'query'});
			}else {
				message.info('解冻账号错误！'+data.message,6);
			}
			yield put({type: "unLoading"});
		},
	},
	reducers: {
		initState(state, action){
			return {...state,  data: null, id: action.id, loading: true,freezeObj:{}};
		},
		querySuccess(state,{payload}){
			return { ...state, ...payload};
		},
		zhanghaoJieDongClick(state,{payload}){
			return { ...state,zhanghaoJieDongStatus:!state.zhanghaoJieDongStatus };
		},
		zhanghaoJieDongHandleOk(state,{payload}){
			return { ...state,zhanghaoJieDongStatus:!state.zhanghaoJieDongStatus };
		},
		zhanghaoJieDongHandleCancel(state,{payload}){
			return { ...state,zhanghaoJieDongStatus:!state.zhanghaoJieDongStatus };
		},
		dongJieZhaoHaoClick(state,{payload}){
			return { ...state,dongJieZhaoHaoStatus:!state.dongJieZhaoHaoStatus };
		},
		dongJieZhaoHaoHandleOk(state,{payload}){
			return { ...state,dongJieZhaoHaoStatus:!state.dongJieZhaoHaoStatus,freezeObj: {} };
		},
		dongJieZhaoHaoHandleCancel(state,{payload}){
			return { ...state,dongJieZhaoHaoStatus:!state.dongJieZhaoHaoStatus,freezeObj: {} };
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
