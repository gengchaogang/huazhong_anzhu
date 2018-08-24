import {closePlatformAccountDetails,platformCloseAccout} from '../../services/financeManagement/platformSettlement';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'platformSettlement',
	state: {
    showPicList:[],
    amount:'',
    canAmount:'',
    comanyName:'',
    id:'',
    loginName:'',
    payType:'',
		money:'',
		organization:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformEarningBalance/platformSettlement') {
          dispatch({type: 'init'});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
			const {data, err} = yield call(closePlatformAccountDetails,{...payload});
      // console.log(data,'datadata');
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            amount:data.data.amount,
            canAmount:data.data.canAmount,
            comanyName:data.data.comanyName,
            id:data.data.id,
            loginName:data.data.loginName,
            organization:data.data.organization,
            payType:data.data.payType,
          }
        })
      }
		},
		*confirmSettlement({payload}, { call, put, select }){
			const {data, err} = yield call(platformCloseAccout,{...payload});
			if(err){
				return message.error('出错了，请联系管理员')
			}
			if(data.data){
        message.success('结算成功')
				yield put({type:'init'})
      }else{
				message.error(data.message)
			}
		},
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
