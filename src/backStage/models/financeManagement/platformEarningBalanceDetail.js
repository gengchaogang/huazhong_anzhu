import {platformAccountIncomeDetail} from '../../services/financeManagement/platformEarningBalanceDetail';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'platformEarningBalanceDetail',
	state: {
    amount:'',
    customer:'',
    customerPhone:'',
    earnings:'',
    house:'',
    houseCode:'',
    houseType:'',
    id:'',
    numericalOrder:'',
    orderNum:'',
    payTime:'',
    payType:'',
    saleWay:'',
    specialApplicationType:'',
    specialOffer:'',
    status:'',
    time:'',
    transType:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformEarningBalance/platformEarningBalanceDetail') {
          dispatch({type: 'init',payload:{id:location.state.id}});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
			const {data, err} = yield call(platformAccountIncomeDetail,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            amount:data.data.amount,
            customer:data.data.customer,
            customerPhone:data.data.customerPhone,
            earnings:data.data.earnings,
            house:data.data.house,
            houseCode:data.data.houseCode,
            houseType:data.data.houseType,
            id:data.data.id,
            numericalOrder:data.data.numericalOrder,
            orderNum:data.data.orderNum,
            payTime:data.data.payTime,
            payType:data.data.payType,
            saleWay:data.data.saleWay,
            specialApplicationType:data.data.specialApplicationType,
            specialOffer:data.data.specialOffer,
            status:data.data.status,
            time:data.data.time,
            transType:data.data.transType,
          }
        })
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
