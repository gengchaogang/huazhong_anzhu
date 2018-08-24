import {query,remove,resetPassword,resetTcPassword} from '../../services/idManagement/dealCenterIdIndex';
import {findAllAreas,toCascaderOptions,} from '../../../commons/service/findAllAreas';
import { parse } from 'qs';
import {message} from 'antd';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(item=>{
    const {code,pCode,lable} = item;
    var option = {value: lable, label: lable}, children;
    item.label = lable;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
export default {
	namespace: 'dealCenterIdIndex',
	state: {
		dataSource:[],
		activeId: null,
		selectedCity:{
      datas: [],
      value: "",
			options: []
    },
		cityOptions:[],
		pageSize:10,
		pageNo:0,
		totalElements:0,
		deleteModalStatus:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/dealCenterIdIndex') {
          dispatch({type: 'init'});
				}
			});
		},
	},
	effects: {
		*init(action, {put}){
			yield put({type: 'query',  payload: {
        businessPath:'/河北省/保定市'
        }});
			yield put({type: 'findAllAreas'});
		},
    *query({ payload }, { select,call, put }){
			yield put({type: 'startLoading'});
      const  {data, err}  = yield call(query, parse(payload));
			if(err){
				message.info('查询错误！'+err.message,6);
				yield put({type: 'stopLoading'});
				return;
			}
      if(data.status == "success"){
				const dataSources=[];
				data.data.content.forEach((item,index)=>(
					dataSources.push({
						key:item.id,
						number:index+1,
						accountNumber:item.loginName,
						dealCenter:item.name,
						area:item.businessPath,
						transactionServiceFee:item.tradingServiceCharges,
						creatTime:item.createDate,
						status:item.status,
						id: item.id
					})
				))
        yield put ({
          type: 'querySuccess',
          payload: {
            dataSource:dataSources,
						totalElements:data.data.totalElements,
						pageNo:data.data.number+1,
          },
        });
      }else {
      	message.info('查询错误！'+data.message,6);
      }
			yield put({type: 'stopLoading'});
    },
		*findAllAreas(action, {call ,put, select}){
      const response = yield call(findAllAreas);
      const selectedCity=yield select(({dealCenterIdIndex})=>dealCenterIdIndex.selectedCity);
      if(response.data.status){
				yield put({
					type:'setState',
					payload:{
						selectedCity:{
							...selectedCity,
							datas:response.data.data || [],
							options: _toCascaderOptions(response.data.data)
						}
					}
				})
			}
			(response.data.status=='error')&&message.info('查询错误！'+response.data.message,6)
    },

		*resetPsd({ payload }, { call, put,select }){
			const {data}=yield call(resetTcPassword,{...payload});
			if(data.data){
				yield put({type:'query'});
				message.success('重置密码成功')
			}else{
				message.error(data.message)
			}
		},
		*tryDelete(action, {call ,put, select}){
      const activeId=yield select(({dealCenterIdIndex})=>dealCenterIdIndex.activeId);
      const response = yield call(remove, {id: activeId});
      if(response.data.status){
				yield put({type:'deleteModalonCancel'});
				yield put({type:'query'});
			}
			(response.data.status=='error')&&message.info('查询错误！'+response.data.message,6)
    },
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
		deleteModalClick(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus, ...payload};
		},
		deleteModalonOk(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus };
		},
		deleteModalonCancel(state,{payload}){
			return { ...state, deleteModalStatus:!state.deleteModalStatus };
		},

		editModalClick(state,{payload}){
			return { ...state, editModalStatus:!state.editModalStatus, ...payload};
		},
		editModalOk(state,{payload}){
			return { ...state, editModalStatus:!state.editModalStatus };
		},
		editModalCancel(state,{payload}){
			return { ...state, editModalStatus:!state.editModalStatus };
		},
		setState(state,{payload}){
			return { ...state, ...payload };
		},
		startLoading(state){
			return {...state,loading: true};
		},
		stopLoading(state){
			return {...state,loading: false};
		},
	},
}
