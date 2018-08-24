import {findAccountFetch,findBrokerWalletBudgetFetch,findBrokerCommissionBudgetFetch
} from '../../services/accountManagement/zhangHuDetail';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'zhangHuDetail',
	state: {
		amount:'',
		avatar:'',
		bank:'',
		endNumber:'',
		issuedCommission:'',
		loginName:'',
		logo:'',
		name:'',
		totalCommission:'',
		unIssuedCommission:'',
		userId:'',
		userType:'',
    isWallet:'钱包',
    userId:'',
    beginTime:'',
    endTime:'',
    pageNo:0,
    type:'全部',//收入或者支出的状态
    status:'',
    rangePickerValue:[],
		commissionDataSource:[],
		loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/zhangHuGuanLiBroker/zhangHuDetail') {
					dispatch({type:'initialFindAll',payload:{userId:location.state.id}})
					// dispatch({
          //   type:'findAccount',
          //   payload:{
          //     userId:location.state.id,
          //   }
          // })
          // dispatch({
          //   type:'findBrokerWalletBudget',
          //   payload:{
          //     userId:location.state.id,
          //     beginTime:'',
          //     endTime:'',
          //     pageNo:0,
          //     type:'',
          //     status:'',
					// 		isWallet:'钱包',
          //     rangePickerValue:[],
          //   }
          // })
				}
			});
		},
	},
	effects: {
		*initialFindAll({ payload }, { call, put }){
			// console.log(payload,'payload');
			yield put({
				type:'findAccount',
				payload:{
					userId:payload.userId,
				}
			});
			yield put({
				type:'findBrokerWalletBudget',
				payload:{
					userId:payload.userId,
					beginTime:'',
					endTime:'',
					pageNo:0,
					type:'',
					status:'',
					isWallet:'钱包',
					rangePickerValue:[],
				}
			})
		},
    *findAccount({ payload }, { call, put }){
      const {data,err}=yield call(findAccountFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if (!!data.data) {
        yield put({
          type:'initialSuccess',
          payload:{
            amount:data.data.amount,
            avatar:data.data.avatar,
            bank:data.data.bank,
            endNumber:data.data.endNumber,
            issuedCommission:data.data.issuedCommission,
            loginName:data.data.loginName,
            logo:data.data.logo,
            name:data.data.name,
            totalCommission:data.data.totalCommission,
            unIssuedCommission:data.data.unIssuedCommission,
            userId:data.data.userId,
            userType:data.data.userType,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *findBrokerWalletBudget({ payload }, { call, put }){
      const {data,err}=yield call(findBrokerWalletBudgetFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        const walletDataSource=[];
        data.data.content.map((item,index)=>(
          walletDataSource.push({
            addTime:item.addTime,
            capitalType:item.capitalType,
            key:item.id,
            status:(!!item.status==''?'成功':item.status),
            totalAmt:item.totalAmt,
            type:item.type,
          })
        ))
        yield put({
          type:'initialSuccess',
          payload:{
            walletDataSource:walletDataSource,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            type:(payload.type==''?'全部':payload.type),
            beginTime:payload.beginTime,
            endTime:payload.endTime,
            status:payload.status,
            rangePickerValue:payload.rangePickerValue,
						isWallet:payload.isWallet,
						loading:false,
          }
        })
      }else{
        message.error(data.message)
      }
    },
		*findBrokerCommissionBudget({ payload }, { call, put }){
			const {data,err}=yield call(findBrokerCommissionBudgetFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        const commissionDataSource=[];
        data.data.content.map((item,index)=>(
          commissionDataSource.push({
            addTime:item.addTime,
            capitalType:item.capitalType,
            commissionType:item.commissionType,
            key:item.id,
            house:item.house,
            orderNumber:item.orderNumber,
            totalAmt:item.totalAmt,
            status:item.status,
            type:item.type,
          })
        ))
        yield put({
          type:'initialSuccess',
          payload:{
            commissionDataSource:commissionDataSource,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            type:(payload.type==''?'全部':payload.type),
            beginTime:payload.beginTime,
            endTime:payload.endTime,
            status:payload.status,
            rangePickerValue:payload.rangePickerValue,
						isWallet:payload.isWallet,
						loading:false,
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
