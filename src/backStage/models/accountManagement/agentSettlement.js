import {closeOperAccountDetails,opeartorCloseAccount
} from '../../services/accountManagement/agentSettlement';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'agentSettlement',
	state: {
    amount:'',
    canAmount:'',
    comanyName:'',
    id:'',
    loginName:'',
    payType:'',
    money:'',
    showPicList:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/zhangHuGuanLiAgent/agentSettlement') {
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
      const {data,err}=yield call(closeOperAccountDetails,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            amount:data.data.amount,
            canAmount:data.data.canAmount,
            comanyName:data.data.comanyName,
            id:data.data.id,
            loginName:data.data.loginName,
            payType:data.data.payType,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *established({ payload }, { call, put }){
      const {data,err}=yield call(opeartorCloseAccount,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        message.success('结算成功')
				// yield put({
				// 	type:'findData',payload:{...payload}
				// })
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
