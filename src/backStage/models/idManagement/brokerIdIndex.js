import {query} from '../../services/idManagement/brokerIdIndex';
import {findAllAreas,toCascaderOptions} from '../../../commons/service/findAllAreas';
import { parse } from 'qs';
import {message} from 'antd';

function toTableData(datas){
	datas = datas || [];
	return datas.map(data2Item);
}

function data2Item(data, i){
	return {
		id: data.id,
		key: i+1,
		loginName: data.loginName,
		name: data.name,
		nameCertificate: !!data.realNameCertifiedDateTime,
		warningTimes: data.warningTimes,
		rigisterDate: data.createTime,
		realNameCertifiedState: data.realNameCertifiedState,
		lastLoginTime: data.lastLoginDateTime,
		state: data.status
	};
}

export default {
	namespace: 'brokerIdIndex',
	state: {
		tableData:[],
		selectedCity:{
      datas: [],
      value: "",
			options: []
    },
		totalElements: 0,
		pageNo:1,
		pageSize:10,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/brokerIdIndex') {
          dispatch({type: 'iniaitFindAll'});
					// dispatch({type: 'findAllAreas'});
					// dispatch({type:'iniaitFindAll'})
				}
			});
		},
	},
	effects: {
		*iniaitFindAll({payload},{call,put,select}){
			yield put({type:'findAllarea'});
			yield put({type:'query',payload:{cityNames:"/河北省/保定市"}});
		},
    *query({ payload={} }, { call, put, select }){
			if(payload.pageNo > 0){
				payload.pageNo--;
			}else {
				payload.pageNo = 0;
			}
			if (!(payload.pageSize > 0)) {//小于0 或未定义时 设置默认值
				payload.pageSize = yield select(({brokerIdIndex})=>brokerIdIndex.pageSize);
			}
      const {data, err}  = yield call(query, payload);
			if(err){
				message.info('查询错误！'+err.message,6);
				console.error("query error>",err);
				return;
			}
			// console.log("query data>",data);
			if(data.status == "success"){
				yield put ({
					type: 'setState',
					payload: {
						tableData: toTableData(data.data.content),
						totalElements: data.data.totalElements,
						pageNo: payload.pageNo+1,
						pageSize: payload.pageSize,
					},
				});
			}else {
				message.info('查询错误！'+data.message,6);
			}
    },
		*findAllarea(action, {call ,put, select}){
      const response = yield call(findAllAreas);
      const selectedCity=yield select(({brokerIdIndex})=>brokerIdIndex.selectedCity);
	  console.log('findAllAreas返回的response:',response);
      if(response.data.status){
				yield put({
					type:'setState',
					payload:{
						selectedCity:{
							...selectedCity,
							datas:response.data.data || [],
							options: toCascaderOptions(response.data.data)
						}
					}
				})
			}
			(response.data.status=='error')&&message.info('查询错误！'+response.data.message,6)
    },
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
		setState(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
