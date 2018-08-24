import {platformIncomeDetail} from '../../services/financeManagement/platformFundDetail';
import { parse } from 'qs';
import {message} from 'antd';
export default {
	namespace: 'platformFundDetail',
	state: {
    aBrokerMoney:'',
    aMasterMoney:'',
    aTutorMoney:'',
    amount:'',
    areaAgentMoney:'',
    bBrokerMoney:'',
    bMasterMoney:'',
    bTutorMoney:'',
    cityAgentMoney:'',
    customer:'',
    customerPhone:'',
    house:'',
    houseCode:'',
    houseType:'',
    id:'',
    numericalOrder:'',
    orderNum:'',
    orderTime:'',
    payTime:'',
    payType:'',
    platformMoney:'',
    provinceAgentMoney:'',
    saleWay:'',
    specialApplicationType:'',
    specialOffer:'',
    status:'',
    tcAddress:'',
    tcLoginName:'',
    tcLogo:'',
    tcName:'',
    tcPath:'',
    tradingCenterMoney:'',
    transType:'',
		showAllocation:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformFund/platformFundDetail') {
          dispatch({type: 'init',payload:{id:location.state.id}});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
			const {data, err} = yield call(platformIncomeDetail,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            aBrokerMoney:data.data.aBrokerMoney,
            aMasterMoney:data.data.aMasterMoney,
            aTutorMoney:data.data.aTutorMoney,
            amount:data.data.amount,
            areaAgentMoney:data.data.areaAgentMoney,
            bBrokerMoney:data.data.bBrokerMoney,
            bMasterMoney:data.data.bMasterMoney,
            bTutorMoney:data.data.bTutorMoney,
            cityAgentMoney:data.data.cityAgentMoney,
            customer:data.data.customer,
            customerPhone:data.data.customerPhone,
            house:data.data.house,
            houseCode:data.data.houseCode,
            houseType:data.data.houseType,
            id:data.data.id,
            numericalOrder:data.data.numericalOrder,
            orderNum:data.data.orderNum,
            orderTime:data.data.orderTime,
            payTime:data.data.payTime,
            payType:data.data.payType,
            platformMoney:data.data.platformMoney,
            provinceAgentMoney:data.data.provinceAgentMoney,
            saleWay:data.data.saleWay,
            specialApplicationType:data.data.specialApplicationType,
            specialOffer:data.data.specialOffer,
            status:data.data.status,
            tcAddress:data.data.tcAddress,
            tcLoginName:data.data.tcLoginName,
            tcLogo:data.data.tcLogo,
            tcName:data.data.tcName,
            tcPath:data.data.tcPath,
            tradingCenterMoney:data.data.tradingCenterMoney,
            transType:data.data.transType,
						showAllocation:data.data.showAllocation,
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
