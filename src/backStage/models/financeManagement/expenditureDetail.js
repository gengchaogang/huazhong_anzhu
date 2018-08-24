import {platformExpenseDetail} from '../../services/financeManagement/expenditureDetail';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'expenditureDetail',
	state: {
		accid:'',
		accountLoginName:'',
		accountLogo:'',
		accountName:'',
		accountPath:'',
		amount:'',
		bank:'',
		bankAccountName:'',
		bankLogo:'',
		clearingAgencise:'',
		clearingType:'',
		endNumber:'',
		expenseNumericalOrders:'',
		expenseStatus:'',
		expenseTime:'',
		expenseType:'',
		id:'',
		optUserLoginName:'',
		optUserName:'',
		optUserType:'',
		serviceFee:'',
		serviceScale:'',
		showFinishTime:false,//是否展示结算时间
		finishTime:'',//结算时间
		showBank:false,//是否展示银行卡信息
		city:'',// 开户行所在城市
		branchName:'',// 开户支行或分行全称
		showOpt:false,//是否展示操作人员
		showAccount:false,//是否展示账户信息
		showPayInfo:false,//是否显示支付信息
		customer:'',//支付人姓名
		customerPhone:'',//联系电话
		numericalOrder:'',//支付流水号
		credentialsPath:'',//结算凭证
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformFund/expenditureDetail') {
          dispatch({type: 'init',payload:{id:location.state.id}});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
			const {data, err} = yield call(platformExpenseDetail,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
					type:'setState',
					payload:{
						accid:data.data.accid,
						accountLoginName:data.data.accountLoginName,
						accountLogo:data.data.accountLogo,
						accountName:data.data.accountName,
						accountPath:data.data.accountPath,
						amount:data.data.amount,
						bank:data.data.bank,
						bankAccountName:data.data.bankAccountName,
						bankLogo:data.data.bankLogo,
						clearingAgencise:data.data.clearingAgencise,
						clearingType:data.data.clearingType,
						endNumber:data.data.endNumber,
						expenseNumericalOrders:data.data.expenseNumericalOrders,
						expenseStatus:data.data.expenseStatus,
						expenseTime:data.data.expenseTime,
						expenseType:data.data.expenseType,
						id:data.data.id,
						optUserLoginName:data.data.optUserLoginName,
						optUserName:data.data.optUserName,
						optUserType:data.data.optUserType,
						serviceFee:data.data.serviceFee,
						serviceScale:data.data.serviceScale,
						showFinishTime:data.data.showFinishTime,//是否展示结算时间
						finishTime:data.data.finishTime,//结算时间
						showBank:data.data.showBank,//是否展示银行卡信息
						city:data.data.city,// 开户行所在城市
						branchName:data.data.branchName,// 开户支行或分行全称
						showOpt:data.data.showOpt,//是否展示操作人员
						showAccount:data.data.showAccount,//是否展示账户信息
						showPayInfo:data.data.showPayInfo,//是否显示支付信息
						customer:data.data.customer,//支付人姓名
						customerPhone:data.data.customerPhone,//联系电话
						numericalOrder:data.data.numericalOrder,//支付流水号
						credentialsPath:data.data.credentialsPath,//结算凭证
					}
				})
      }
		},
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
