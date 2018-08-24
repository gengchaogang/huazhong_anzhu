import {findAllAreasOpen,
  platformDetails,platformIncomeList,platformExpenseList
} from '../../services/financeManagement/platformFund';
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
	namespace: 'platformFund',
	state: {
		loading:false,
    cascaderArr:[],//城市级联数组
    masterSub:'',
    nowCommission:'',
    nowFirstpayment:'',
    nowFree:'',
    nowGroup:'',
    nowIntention:'',
    nowPlatAmount:'',
    totalCommission:'',
    totalFirstpayment:'',
    totalFree:'',
    totalGroup:'',
    totalIntention:'',
    totalPlatAmount:'',
    waitCommission:'',
    isShouRu:'收入',
    zhiChuTable:[],
    shouRuTable:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformFund') {
          dispatch({type: 'init'});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
      yield put({type:'getPlatformFund'});
			yield put({type: 'getCascaderArr'});
			yield put({type: 'getShouRuTable',payload:{
        isShouRu:'收入',
        areaPath:'',
        beginTime:'',
        endTime:'',
        keyword:'',
        pageNo:0,
        type:'',
      }});
		},
    *getShouRuTable({payload},{call , put}){
      const {data, err} = yield call(platformIncomeList,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        const shouRuTable=[];
        data.data.content.map((item,index)=>(
          shouRuTable.push({
            key:item.id,
            number:index+1,
            addTime:item.addTime,
            amount:item.amount,
            houseCode:item.houseCode,
            houseType:(item.houseType=='住宅'?'二手房':item.houseType),
            numericalOrder:item.numericalOrder,
            orderNumber:item.orderNumber,
            payType:item.payType,
            saleWay:item.saleWay,
            tradingCenterName:item.tradingCenterName,
            tradingCenterPath:item.tradingCenterPath,
            type:item.type,
          })
        ))
        yield put({
          type:'setTable',
          payload:{
            shouRuTable:shouRuTable,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            isShouRu:payload.isShouRu,
            areaPath:payload.areaPath,
            beginTime:payload.beginTime,
            endTime:payload.endTime,
            keyword:payload.keyword,
            type:payload.type,
          }
        })
      }
    },
    *getZhiChuTable({payload},{call , put}){
      const {data, err} = yield call(platformExpenseList,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        const zhiChuTable=[];
        data.data.content.map((item,index)=>(
          zhiChuTable.push({
            key:item.id,
            number:index+1,
            addTime:item.addTime,
            amount:item.amount,
            areaPath:item.areaPath,
            expenseType:item.expenseType,
            numericalOrder:item.numericalOrder,
            orderNumber:item.orderNumber,
            transType:item.transType,
            userName:item.userName,
            userType:item.userType,
          })
        ))
        yield put({
          type:'setTable',
          payload:{
            zhiChuTable:zhiChuTable,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            isShouRu:payload.isShouRu,
            areaPath:payload.areaPath,
            beginTime:payload.beginTime,
            endTime:payload.endTime,
            keyword:payload.keyword,
            type:payload.type,
          }
        })
      }
    },
    *getPlatformFund({payload},{call , put}){
      const {data, err} = yield call(platformDetails);
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'initState',
          payload:{
            masterSub:data.data.masterSub,
            nowCommission:data.data.nowCommission,
            nowFirstpayment:data.data.nowFirstpayment,
            nowFree:data.data.nowFree,
            nowGroup:data.data.nowGroup,
            nowIntention:data.data.nowIntention,
            nowPlatAmount:data.data.nowPlatAmount,
            totalCommission:data.data.totalCommission,
            totalFirstpayment:data.data.totalFirstpayment,
            totalFree:data.data.totalFree,
            totalGroup:data.data.totalGroup,
            totalIntention:data.data.totalIntention,
            totalPlatAmount:data.data.totalPlatAmount,
            waitCommission:data.data.waitCommission,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *getCascaderArr({ payload }, { call, put}){
      const {data, err} = yield call(findAllAreasOpen);
			if(err){
				message.info('查询错误！'+err.message,6);
				return;
			}
			if(data.status == "success"){
        let arr=_toCascaderOptions(data.data)
				yield put({
          type:'setState',
          payload:{cascaderArr:arr}
        })
      }else {
      	message.info('查询错误！'+data.message,6);
      }
    },
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
		initState(state,{payload}){
			return { ...state, ...payload };
		},
		setTable(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
