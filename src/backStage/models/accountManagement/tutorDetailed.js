import {findBrokerCommissionDetailFetch,findBrokerOrTutorWalletIncomeFetch,
fingBrokerOrTutorWalletExpenseFetch
} from '../../services/accountManagement/tutorDetailed';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'tutorDetailed',
	state: {
		type:'',
    area:'',
    bank:'',
    bankLogo:'',
    comment:'',
    commissionTime:'',
    commissionType:'',
    endNumber:'',
    house:'',
    houseType:'',
    knockdownTime:'',
    orderNumber:'',
    saleWay:'',
    scale:'',
    serialNumber:'',
    status:'',
    totalAmt:'',
    totalMoney:'',
    capitalType:'',
    clearingTime:'',
    houseCode:'',
    prentice:'',
    prenticeLoginName:'',
    project:'',
    addTime:'',
    finishTime:'',
    handingCharge:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountTutor/tutorDetailed') {
          if(location.state.type==='佣金记录'){
            dispatch({
              type:'findBrokerCommissionDetail',
              payload:{id:location.state.id,type:location.state.type}
            })
          }else if(location.state.type==='收入'){
            dispatch({
              type:'findBrokerOrTutorWalletIncome',
              payload:{id:location.state.id,type:location.state.type}
            })
          }else{
            dispatch({
              type:'fingBrokerOrTutorWalletExpense',
              payload:{id:location.state.id,type:location.state.type}
            })
          }
				}
			});
		},
	},
	effects: {
    *findBrokerCommissionDetail({ payload }, { call, put }){
      const {data,err}=yield call(findBrokerCommissionDetailFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
		  if(!!data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            area:data.data.area,
            bank:data.data.bank,
            bankLogo:data.data.bankLogo,
            comment:data.data.comment,
            commissionTime:data.data.commissionTime,
            broker:data.data.broker,
            commissionType:data.data.commissionType,
            endNumber:data.data.endNumber,
            house:data.data.house,
            houseType:data.data.houseType,
            knockdownTime:data.data.knockdownTime,
            orderNumber:data.data.orderNumber,
            saleWay:data.data.saleWay,
            scale:data.data.scale,
            serialNumber:data.data.serialNumber,
            status:data.data.status,
            totalAmt:data.data.totalAmt,
            totalMoney:data.data.totalMoney,
            type:payload.type,
          }
        })
      }else{
        message.error(data.message)
      }
    },
		*findBrokerOrTutorWalletIncome({ payload }, { call, put }){
      const {data,err}=yield call(findBrokerOrTutorWalletIncomeFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            area:data.data.area,
            capitalType:data.data.capitalType,
            clearingTime:data.data.clearingTime,
            house:data.data.house,
            houseCode:data.data.houseCode,
            houseType:data.data.houseType,
            knockdownTime:data.data.knockdownTime,
            orderNumber:data.data.orderNumber,
            prentice:data.data.prentice,
            prenticeLoginName:data.data.prenticeLoginName,
            project:data.data.project,
            saleWay:data.data.saleWay,
            status:data.data.status,
            totalAmt:data.data.totalAmt,
            totalMoney:data.data.totalMoney,
            type:payload.type,
          }
        })
      }else{
        message.error(data.message)
      }
    },
		*fingBrokerOrTutorWalletExpense({ payload }, { call, put }){
      const {data,err}=yield call(fingBrokerOrTutorWalletExpenseFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
        yield put({type:'initialSuccess',payload:{
          addTime:data.data.addTime,
          bank:data.data.bank,
          bankLogo:data.data.bankLogo,
          comment:data.data.comment,
          endNumber:data.data.endNumber,
          finishTime:data.data.finishTime,
          handingCharge:data.data.handingCharge,
          money:data.data.money,
          project:data.data.project,
          orderNumber:data.data.orderNumber,
          serialNumber:data.data.serialNumber,
          status:data.data.status,
          type:payload.type,
        }})
      }else{
        message.error(data.message)
      }
    }
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
