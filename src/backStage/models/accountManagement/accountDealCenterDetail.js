import {findAccountFetch,findTCOrOIncomeBudgetFetch,findGroup,findAllCities,
  findTcOrOExpenseFetch,tcChangeCard
} from '../../services/accountManagement/accountDealCenterDetail';
import { parse } from 'qs';
import {message} from 'antd';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: lable, label:lable}, children;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
export default {
	namespace: 'accountDealCenterDetail',
	state: {
    amount:'',
    areaPath:'',
    codePath:'',
    avatar:'',
    bank:'',
    endNumber:'',
    logo:'',
    loginName:'',
    name:'',
    totalIncome:'',
    userId:'',
    userType:'',
    isIncome:'收入',
    dataSourceIncome:[],
    total:'',
    pageNo:0,
    beginTime:'',
    endTime:'',
    incomeLoading:true,
		changeBankStatus:false,
		bankArr:[],
		optionsArr:[],
    dataSourceExpenditure:[],//支出列表
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountDealCenter/accountDealCenterDetail') {
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
            codePath:data.data.codePath,
            avatar:data.data.avatar,
            bank:data.data.bank,
            endNumber:data.data.endNumber,
            logo:data.data.logo,
            loginName:data.data.loginName,
            name:data.data.name,
            totalIncome:data.data.totalIncome,
            userId:data.data.userId,
            userType:data.data.userType,
            changeBankStatus:false,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *getBank({ payload }, { call, put }){
      const {data,err}  = yield call(findGroup, {...payload});
      if(err){
				return message.error('获取银行卡列表失败，请联系管理员')
			}
			if(data.data){
				yield put({
					type:'setBank',
					payload:{bankArr:data.data[0].nameAndValues}
				})
			}else{
				message.error(data.message)
			}
    },
    *getCity({ payload }, { call, put }){
      const {data,err}  = yield call(findAllCities, {...payload});
      if(err){
				return message.error('获取城市列表失败，请联系管理员')
			}
			if(data.data){
				let arr=_toCascaderOptions(data.data)
				yield put({
					type:'setCity',
					payload:{optionsArr:arr}
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
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        const dataSourceExpenditure=[];
				data.data.content.map((item,index)=>(
					dataSourceExpenditure.push({
						key:item.id,
						number:index+1,
						addTime:item.addTime,
						bank:item.bank,
            status:item.status,
						numericalOrder:item.numericalOrder,
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
						incomeLoading:false,
					}
				})
      }
    },
    *changeBankok({ payload }, { call, put ,select}){
      const {data,err}=yield call(tcChangeCard,{...payload});
      if(err){
        return message.error('出错了,请联系管理员')
      }
      if(data.data){
        message.success('变更成功');
        yield put({type:'findAccount',payload:{userId:payload.id}})
      }else{
        message.error(data.message)
      }
    },
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
		setBank(state,{payload}){
			return { ...state, ...payload };
		},
		setCity(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
