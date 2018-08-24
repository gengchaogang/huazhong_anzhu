import {findOperator,deleteOperator,resetPasswordFetch} from '../../services/idManagement/agentIdDetail';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
	namespace: 'agentIdDetail',
	state: {
		id:'',
		address:'',
		businessLicense:'',
		businessLicenseCode:'',
		city:'',
		createTime:'',
		currentUser:'',
		freezingTime:'',
		legalPerson:'',
		loginAddress:'',
		loginDateTime:'',
		loginName:'',
		name:'',
		optReason:'',
		phoneNumber:'',
		principal:'',
		status:'',
		watchBigImgStatus:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/agentIdIndex/agentIdDetail') {
          dispatch({
            type: 'findAll',
						payload:{id:location.state.id}
          });
				}
			});
		},
	},
	effects: {
    *findAll({ payload }, { call, put }){
			const {data}=yield call(findOperator,{...payload})
			if(data.data){
				yield put({
					type:'querySuccess',
					payload:{
						id:data.data.id,
						address:data.data.address,
						businessLicense:data.data.businessLicense,
						businessLicenseCode:data.data.businessLicenseCode,
						city:data.data.city,
						createTime:data.data.createTime,
						currentUser:data.data.currentUser,
						freezingTime:data.data.freezingTime,
						legalPerson:data.data.legalPerson,
						loginAddress:data.data.loginAddress,
						loginDateTime:data.data.loginDateTime,
						loginName:data.data.loginName,
						name:data.data.name,
						optReason:data.data.optReason,
						phoneNumber:data.data.phoneNumber,
						principal:data.data.principal,
						status:data.data.status,
					}
				})
			}
		},
		*deletDetail({ payload }, { call, put }){
			const {data}=yield call(deleteOperator,{...payload})
			if(data.data){
				yield put(routerRedux.goBack());
				message.success('删除成功')
			}else{
				message.error(data.message)
			}
		},
		*resetPassword({ payload }, { call, put }){
			const {data}=yield call(resetPasswordFetch,{...payload})
			if(data.data){
				message.success('重置成功')
			}else{
				message.error(data.message)
			}
		},
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
