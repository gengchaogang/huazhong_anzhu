import {findTCOrOIncomeDetailFetch,
} from '../../services/accountManagement/agentDetailIncome';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'agentDetailIncome',
	state: {
    customer:'',
    customerPhone:'',
    house:'',
    houseCode:'',
    houseType:'',
    income:'',
    number:'',
    orderNumber:'',
    orderTime:'',
    payMoney:'',
    payStatus:'',
    payTime:'',
    payType:'',
    saleWay:'',
    scale:'',
    serialNumber:'',
    specialApplicationType:'',
    specialOffer:'',
    transType:'',
    type:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/zhangHuGuanLiAgent/agentDetailIncome') {
          dispatch({type:'findTCOrOIncomeDetail',
            payload:{
              id:location.state.id,
            }
          })
				}
			});
		},
	},
	effects: {
    *findTCOrOIncomeDetail({ payload }, { call, put ,select}){
      const {data,err} = yield call(findTCOrOIncomeDetailFetch, {...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            customer:data.data.customer,
            customerPhone:data.data.customerPhone,
            house:data.data.house,
            houseCode:data.data.houseCode,
            houseType:data.data.houseType,
            income:data.data.income,
            number:data.data.number,
            orderNumber:data.data.orderNumber,
            orderTime:data.data.orderTime,
            payMoney:data.data.payMoney,
            payStatus:data.data.payStatus,
            payTime:data.data.payTime,
            payType:data.data.payType,
            saleWay:data.data.saleWay,
            scale:data.data.scale,
            serialNumber:data.data.serialNumber,
            specialApplicationType:data.data.specialApplicationType,
            specialOffer:data.data.specialOffer,
            transType:data.data.transType,
            type:data.data.type,
          }
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
