import {findAccountFetch,findTCOrOIncomeBudgetFetch,findTcOrOExpenseFetch
} from '../../services/accountManagement/accountAgentDetail';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'accountAgentDetail',
	state: {
    amount:'',
    areaPath:'',
    // codePath:data.data.codePath,
    loginName:'',
    name:'',
    totalIncome:'',
    userId:'',
    userType:'',
		dataSourceIncome:[],//收入列表信息
		total:'',
		pageNo:0,
		isIncome:'收入',
		beginTime:'',//开始时间
		endTime:'',//结束时间
		incomeLoading:true,//收入loading
		dataSourceExpenditure:[],//支出列表
		pinzhengStatus:false,
		certificate:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/zhangHuGuanLiAgent/accountAgentDetail') {
          dispatch({
            type:'findAccount',
            payload:{
              userId:location.state.id,
            }
          })
					dispatch({
						type:'findTCOrOIncomeBudget',
						payload:{
							beginTime:'',
							endTime:'',
							pageNo:0,
							userId:location.state.id,
							isIncome:'收入',
						}
					})
				}
			});
		},
	},
	effects: {
    *findAccount({ payload }, { call, put }){
      const  {data,err}  = yield call(findAccountFetch, {...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
        yield put({
          type:'initialSuccess',
          payload:{
            amount:data.data.amount,
            areaPath:data.data.areaPath,
            // codePath:data.data.codePath,
            loginName:data.data.loginName,
            name:data.data.name,
            totalIncome:data.data.totalIncome,
            userId:data.data.userId,
            userType:data.data.userType,
          }
        })
      }else{
        message.error(data.message)
      }
    },
		//收入列表
		*findTCOrOIncomeBudget({ payload }, { call, put ,select}){
			// const isIncome=yield select(({accountAgentDetail})=>accountAgentDetail.isIncome);
			const  {data,err}  = yield call(findTCOrOIncomeBudgetFetch, {...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
				const dataSourceIncome=[];
				data.data.content.map((item,index)=>(
					dataSourceIncome.push({
						key:item.id,
						number:index+1,
						addTime:item.addTime,
						houseCode:item.houseCode,
						houseType:item.houseType,
						income:item.income,
						orderNumber:item.orderNumber,
						payType:item.payType,
						saleWay:item.saleWay,
						serialNumber:item.serialNumber,
						totalAmt:item.totalAmt,
						type:item.type,
					})
				))
				yield put({
					type:'initialSuccess',
					payload:{
						dataSourceIncome:dataSourceIncome,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
						beginTime:payload.beginTime,
						endTime:payload.endTime,
						isIncome:payload.isIncome,
						incomeLoading:false,
					}
				})
			}else{
				message.error(data.message)
			}
		},
		//支出列表
		*findTcOrOExpense({ payload }, { call, put ,select}){
			const {data,err} = yield call(findTcOrOExpenseFetch, {...payload});
			if(err){
				return message.error('出错了,请联系管理员')
			}
			if(data.data){
				const dataSourceExpenditure=[];
				data.data.content.map((item,index)=>(
					dataSourceExpenditure.push({
						key:item.id,
						number:index+1,
						addTime:item.addTime,
						bank:item.bank,
						numericalOrder:item.numericalOrder,
						certificate:item.certificate,
						payMoney:item.payMoney,
						payType:item.payType,
						showCard:item.showCard,
						type:item.type,
					})
				))
				yield put({
					type:'initialSuccess',
					payload:{
						dataSourceExpenditure:dataSourceExpenditure,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
						beginTime:payload.beginTime,
						endTime:payload.endTime,
						isIncome:payload.isIncome,
						// incomeLoading:false,
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
