import {detail,resetTcPassword, remove,close,reopen} from '../../services/idManagement/dealCenterIdIndex';
// import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace: 'dealCenterIdDetail',
	state: {
		dataSource: {},
		loading: true,
		id: 0,
		deleteModalStatus:false,
		huiFuYinYeModalStatus:false,
		stopYinYeModalStatus:false,
		reasons: {}
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/dealCenterIdIndex/dealCenterIdDetail') {
					let state = location.state;
					let payload = {};
					if(state){
						payload.id = state.id;
						// console.log("detail id, ", state.id);
						dispatch({type: 'init', payload: payload});
					}else {
						//unreachable
						dispatch({type: 'query', payload: payload});
					}
				}
			});
		},
	},
	effects: {
		*init({ payload }, { call, put, select }){
			yield put({type: 'setLoading'});
			yield put({type: "querySuccess", payload: {reasons: {}}});
			yield put({type: 'setId', payload: payload});
			yield put({type: 'loadData'});
		},
		*loadData(action,{call, put, select}){
			const id = yield select(({dealCenterIdDetail})=>dealCenterIdDetail.id);
			console.log("start detail,", id);
			const {data, err}  = yield call(detail, {id: id});
			if(err){
				message.info('查询详细错误！'+err.message,6);
				return;
			}
			console.log("query detail data>",data);
			if(data && data.data){
				const dataSource = data.data;
				if(dataSource.licensePic){
					// dataSource.licensePic = dataSource.licensePic;
					dataSource.licensePicFirst = dataSource.licensePic;
				}

				yield put ({
					type: 'querySuccess',
					payload: {
						dataSource:data.data,
						loading: false,
					},
				});
			}
		},
		*tryDelete(action, {call ,put, select}){
      const activeId=yield select(({dealCenterIdDetail})=>dealCenterIdDetail.dataSource.id);
      const  {data, err} = yield call(remove, {id: activeId});
      console.log('findAllAreas返回的response:',data,err);
			if(err){
				message.info('添加错误！'+err.message,6);
				return;
			}
      if(data){
				if(data.status == "success"){
					yield put(routerRedux.goBack());
				}
			}
			(data.status=='error')&&message.info('查询错误！'+data.message,6)
    },
		*tryResetPassword({ payload }, { call, put, select }){
			const id = yield select(({dealCenterIdDetail})=>dealCenterIdDetail.dataSource.id);
			const {data, err}  = yield call(resetTcPassword, {id: id});
			if(err){
				message.info('重置密码错误！'+err.message,6);
				return;
			}
			console.log("query detail data>",data);
			if(data && (data.status == "success")){
				message.info('重置密码成功！',6);
				// yield put ({
				// 	type: 'querySuccess',
				// 	payload: {
				// 		dataSource:data.data,
				// 	},
				// });
			}else {
				message.error('重置密码失败！'+data.message,6);
			}
		},
		*tryStopBuz({ payload }, { call, put, select }){
			const id = yield select(({dealCenterIdDetail})=>dealCenterIdDetail.dataSource.id);
			payload.id = id;
			const params = {reasons: [], id: id};
			if(payload.reasons){
				for(var i=0; i<payload.reasons.length; i++){
					if(payload.reasons[i] != "其他"){
						params.reasons.push(payload.reasons[i]);
					}
				}
			}
			if(payload.comment){
					params.reasons.push(payload.comment);
			}
			yield put({type: "stopBuzLoading", payload: payload});
			params.reasons = params.reasons.join("、");
			const {data, err}  = yield call(close, params);
			if(err){
				yield put({type: "stopLoading"});
				message.error('停止营业错误！'+err.message,6);
				return;
			}
			// console.log("close data>",data);
			if(data && (data.status == "success")){
				message.info('停止营业成功！',6);
				yield put({type: 'closeInputCloseReasonDialog'});
				yield put({type: 'setLoading'});
				yield put({type: 'loadData'});
			}else {
				message.error('停止营业失败！'+data.message,6);
			}
			yield put({type: "stopLoading"});
		},
		*tryReopen({ payload }, { call, put, select }){
			const id = yield select(({dealCenterIdDetail})=>dealCenterIdDetail.dataSource.id);
			yield put({type: "setLoading"});
			const {data, err}  = yield call(reopen, {id: id});
			if(err){
				yield put({type: "stopLoading"});
				message.error('恢复营业错误！'+err.message,6);
				return;
			}
			if(data && (data.status == "success")){
				message.info('恢复营业成功！',6);

				yield put({type: 'hideReopenModel'});
				yield put({type: 'setLoading'});
				yield put({type: 'loadData'});
			}else {
				message.error('恢复营业失败！'+data.message,6);
			}
			yield put({type: "stopLoading"});
		},
    // *query({ payload }, { call, put }){
    //   const  data  = yield call(query, parse(payload));
    //   if(data){
    //     yield put ({
    //       type: 'querySuccess',
    //       payload: {
    //         zhangHao:data.zhangHao,
    //         status:data.status,
    //         reason:data.reason,
    //         kaiTongTime:data.kaiTongTime,
    //         dealCenterName:data.dealCenterName,
    //         dealCenterMainPeople:data.dealCenterMainPeople,
    //         yinYeAera:data.yinYeAera,
    //         yinYePhone:data.yinYePhone,
    //         yeWuContacts:data.yeWuContacts,
    //         contactNumber:data.contactNumber,
    //         dealServiceCharge:data.dealServiceCharge,
    //         qiYeName:data.qiYeName,
    //         qiYeLegalPerson:data.qiYeLegalPerson,
    //         qiYeYingYeZhiZhao:data.qiYeYingYeZhiZhao,
    //         uniformSocialCreditCode:data.uniformSocialCreditCode,
    //         inCity:data.inCity,
    //         address:data.address,
		// 				stopYinyeTime:data.stopYinyeTime,
		// 				stopYinyeReason:data.stopYinyeReason,
		// 				operationPerson:data.operationPerson,
    //       },
    //     });
    //   }
    // },
	},
	reducers: {
		setId(state, {payload}){
			return {...state, ...payload};
		},
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
		setLoading(state,{payload}){
			return { ...state, loading: true };
		},
		stopLoading(state){
			return { ...state, loading: false };
		},
		deleteModalClick(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus };
		},
		deleteModalonOk(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus };
		},
		deleteModalonCancel(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus };
		},
		huiFuYinYeModalClick(state,{payload}){
			return { ...state, huiFuYinYeModalStatus:!state.huiFuYinYeModalStatus };
		},
		huiFuYinYeModalonOk(state,{payload}){
			return { ...state, huiFuYinYeModalStatus:!state.huiFuYinYeModalStatus };
		},
		huiFuYinYeModalonCancel(state,{payload}){
			return { ...state, huiFuYinYeModalStatus:!state.huiFuYinYeModalStatus };
		},
		preInputCloseReason(state,action){
			return {...state,stopYinYeModalStatus: true};
		},
		closeInputCloseReasonDialog(state, action){
			return {...state,stopYinYeModalStatus: false};
		},
		showReopenModel(state){
			return {...state, huiFuYinYeModalStatus: true};
		},
		hideReopenModel(state){
			return {...state, huiFuYinYeModalStatus: false};
		},
		stopYinYeClick(state,{payload}){
			return { ...state, stopYinYeModalStatus:!state.stopYinYeModalStatus };
		},
		stopYinYeModalonOk(state,{payload}){
			return { ...state, stopYinYeModalStatus:!state.stopYinYeModalStatus };
		},
		stopYinYeModalonCancel(state,{payload}){
			return { ...state, stopYinYeModalStatus:!state.stopYinYeModalStatus };
		},
		stopBuzLoading(state, {payload}){
			return { ...state, reasons:payload, loading: true };
		},
	},
}
