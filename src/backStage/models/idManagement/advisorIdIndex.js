import {findAll} from '../../services/idManagement/advisorIdIndex';
import {findAllAreas,toCascaderOptions} from '../../../commons/service/findAllAreas';
import {message} from 'antd';

function toTableData(datas){
	datas = datas || [];
	return datas.map(data2Item);
}

function getPath(pathnames){
	if(!pathnames)return "";
	var paths = pathnames.split("/");
	if(!paths[0]){
		paths.shift();
	}
	return paths.join("/");
}

function data2Item(data, i){
	return {...data, key: i+1,number:i+1,area:getPath(data.fullPath)};
	// return {
	// 	id: data.id,
	// 	key: i+1,
	// 	number: i+1,
	// 	accountNumber: data.loginName,
	// 	companyName: data.companyName,
	// 	area: data.fullPath,
	// 	nameCertificate: !!data.realNameCertifiedDateTime,
	// 	rigisterDate: data.createTime,
	// 	lastLoginTime: data.lastLoginDateTime,
	// 	state: data.status
	// };
}

export default {
	namespace: 'advisorIdIndex',
	state: {
		selectedCity:{
      datas: [],
      value: "",
			options: []
    },
		loading: true,
		tableLoading:false,
		tableData:[],
		totalElements: 0,
		pageNo:1,
		// pageSize:2,

    //searchBox专用
    submitLoading:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/advisorIdIndex') {
          dispatch({
            type: 'init',
          });
				}
			});
		},
	},
	effects: {
		*init(action,{call, put, select}){
			yield put({type: "initState"});
			yield put({type: "setLoading"});
			yield put({type: 'findAllAreas'});
		},
		*search({ payload }, { call, put, select }){
			yield put({type: "setLoading"});
			yield put({type: "query", payload: payload});
		},
    *query({ payload={fullPath:'/河北省/保定市'} }, { call, put, select }){
			if(payload.pageNo > 0){
				payload.pageNo--;
			}else {
				payload.pageNo = 0;
			}
			if (!(payload.pageSize > 0)) {//小于0 或未定义时 设置默认值
				payload.pageSize = yield select(({advisorIdIndex})=>advisorIdIndex.pageSize);
			}
      const {data, err}  = yield call(findAll, payload);
			if(err){
				message.info('查询错误！'+err.message,6);
				console.error("query error>",err);
				yield put({
					type:'querySuccess',
					payload:{loading:false}
				})
				return;
			}
			console.log("query data>",data);
			if(data.status == "success"){
				yield put ({
					type: 'querySuccess',
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
			yield put({type: "unLoading"});
    },
		*findAllAreas(action, {call ,put, select}){
      const {data, err} = yield call(findAllAreas, {toCascaderOptions: true});
			if(err){
				message.info('查询地区错误！'+err.message,6);
				console.error("query error>",err);
				return;
			}
      const selectedCity=yield select(({advisorIdIndex})=>advisorIdIndex.selectedCity);
      console.log('data:',data, err);
      if(data.status == "success"){
				yield put({
					type:'querySuccess',
					payload:{
						selectedCity:{
							...selectedCity,
							datas: data.data || [],
							// options: toCascaderOptions(data.data)
							options: data.options||[],
						}
					}
				})
			}else {
				message.info('查询错误！'+data.message,6)
			}
			yield put({type: "query"});
    },
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
    initState(state){
			// return {...state,tableData:[],totalElements:0};
			state.tableData = [];
			state.totalElements = 0;
      return state;
    },
		setLoading(state){
			return {...state, loading: true, tableLoading: false};
		},
		unLoading(state){
			return {...state, loading: false, tableLoading: false};
		},
	},
}
