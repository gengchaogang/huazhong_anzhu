import {findAccountFetch,findTutorWalletBudgetFetch,findTutorCommissionBudgetFetch
} from '../../services/accountManagement/accountTutorDetail';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'accountTutorDetail',
	state: {
    amount:'',
    avatar:'',
    bank:'',
    companyName:'',
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
    walletDataSource:[],
		loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountTutor/accountTutorDetail') {
          dispatch({
            type:'findAccount',
            payload:{
              userId:location.state.id,
            }
          })
          dispatch({
            type:'findTutorWalletBudget',
            payload:{
              userId:location.state.id,
              beginTime:'',
              endTime:'',
              pageNo:0,
              type:'',
              status:'',
              rangePickerValue:[],
							isWallet:'钱包',
            }
          })
				}
			});
		},
	},
	effects: {
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
            companyName:data.data.companyName,
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
    *findTutorWalletBudget({ payload }, { call, put }){
      const {data,err}=yield call(findTutorWalletBudgetFetch,{...payload})
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
            status:item.status,
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
		*findTutorCommissionBudget({ payload }, { call, put }){
			const {data,err}=yield call(findTutorCommissionBudgetFetch,{...payload})
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
