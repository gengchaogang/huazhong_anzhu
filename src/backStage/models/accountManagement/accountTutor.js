import {findAccountsFetch
} from '../../services/accountManagement/accountTutor';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'accountTutor',
	state: {
		dataSource:[],
		total:'',
		pageNo:0,
		status:'',
		keyword:'',
		loading:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountTutor') {
					dispatch({type:'initialFindAll'})
					// dispatch({type:'initialSuccess',payload:{loading:true}})
					// dispatch({
          //   type: 'findAccounts',
					// 	payload:{
					// 		keyword:'',
					// 		status:'',
					// 		pageNo:0,
					// 	}
          // });
				}
			});
		},
	},
	effects: {
		*initialFindAll({ payload }, { call, put }){
			yield put({type:'initialSuccess',payload:{loading:true}})
			yield put({
				type: 'findAccounts',
				payload:{
					keyword:'',
					status:'',
					pageNo:0,
				}
			});
		},
    *findAccounts({ payload }, { call, put }){
      const  {data,err}  = yield call(findAccountsFetch, parse(payload));
			if(err){
				yield put({type:'initialSuccess',payload:{loading:false}})
				return message.error('出错了,请联系管理员')
			}
			if(!!data.data){
				const dataSource=[];
				data.data.content.map((item,index)=>(
					dataSource.push({
						key:item.userId,
						number:index+1,
						userType:item.userType,
						totalCommission:item.totalCommission,
						status:item.status,
						name:item.name,
						loginName:item.loginName,
						cardNumber:item.cardNumber,
						companyName:item.companyName,
						amount:item.amount,
					})
				))
				yield put({
					type:'initialSuccess',
					payload:{
						dataSource:dataSource,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
						status:payload.status,
						keyword:payload.keyword,
						loading:false,
					}
				})
			}else{
				yield put({type:'initialSuccess',payload:{loading:false}})
				return message.error(data.message)
			}
    },
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
