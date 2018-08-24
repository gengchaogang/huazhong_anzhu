import {closeTCAccountDetails,closeAccount
} from '../../services/accountManagement/dealCenterSettlement';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'dealCenterSettlement',
	state: {
    bank:'',
    canMoney:'',
    card:'',
    id:'',
    loginName:'',
    logo:'',
    name:'',
    tcAddress:'',
    tcName:'',
    totalMoney:'',
    organization:'',
    payType:'',
    money:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountDealCenter/dealCenterSettlement') {
          dispatch({
            type:'findData',
            payload:{id:location.state.id}
          })
				}
			});
		},
	},
	effects: {
    *findData({ payload }, { call, put }){
      const {data,err}=yield call(closeTCAccountDetails,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            bank:data.data.bank,
            canMoney:data.data.canMoney,
            card:data.data.card,
            id:data.data.id,
            loginName:data.data.loginName,
            logo:data.data.logo,
            name:data.data.name,
            tcAddress:data.data.tcAddress,
            tcName:data.data.tcName,
            totalMoney:data.data.totalMoney,
            organization:data.data.organization,
            payType:data.data.payType,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *established({ payload }, { call, put }){
      const {data,err}=yield call(closeAccount,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        message.success('结算成功')
				yield put({
					type:'findData',payload:{...payload}
				})
      }else{
        message.error(data.message)
      }
    },
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
