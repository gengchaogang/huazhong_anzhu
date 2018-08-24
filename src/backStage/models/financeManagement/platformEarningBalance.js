import {findAllAreasOpen,
  platformAccountStatistics,platformAccountIncomeList,
  platformAccountExpenseList,
} from '../../services/financeManagement/platformEarningBalance';
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
	namespace: 'platformEarningBalance',
	state: {
		loading:false,
    cascaderArr:[],//城市级联数组
    accountBalance:'',
    totalExpense:'',
    totalFund:'',
    areaPath:'',
    beginTime:'',
    endTime:'',
    keyword:'',
    pageNo:'',
    type:'',
    isShouru:'收入',
    shouruTable:[],
    zhichuTable:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financeManagement/platformEarningBalance') {
          dispatch({type: 'init'});
				}
			});
		},
	},
	effects: {
    *init({payload}, { call, put, select }){
			yield put({type: 'getCascaderArr'});
      yield put({type:'getZhanghu'});
      yield put({
        type:'getShouruTable',
        payload:{
          areaPath:'',
          beginTime:'',
          endTime:'',
          keyword:'',
          pageNo:'',
          type:'',
          isShouru:'收入',
        }
      })
		},
    *getZhanghu({ payload }, { call, put}){
      const {data, err} = yield call(platformAccountStatistics);
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'setZhanghu',
          payload:{
            accountBalance:data.data.accountBalance,
            totalExpense:data.data.totalExpense,
            totalFund:data.data.totalFund,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    //收入列表
    *getShouruTable({ payload }, { call, put}){
      const {data, err} = yield call(platformAccountIncomeList,{...payload});
      if(err){
				message.info('查询错误！'+err.message);
				return;
			}
			if(data.data){
        const shouruTable=[];
        data.data.content.map((item,index)=>(
          shouruTable.push({
            number:index+1,
            key:item.id,
            amount:item.amount,
            houseCode:item.houseCode,
            houseType:item.houseType,
            orderNum:item.orderNum,
            payType:item.payType,
            saleWay:item.saleWay,
            time:item.time,
            tradingCenterName:item.tradingCenterName,
            tradingCenterPath:item.tradingCenterPath,
            transType:item.transType,
          })
        ))
        yield put({
          type:'setShouru',
          payload:{
            shouruTable:shouruTable,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            areaPath:payload.areaPath,
            beginTime:payload.beginTime,
            endTime:payload.endTime,
            keyword:payload.keyword,
            type:payload.type,
            isShouru:payload.isShouru,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *getZhichuTable({ payload }, { call, put}){
      const {data, err} = yield call(platformAccountExpenseList,{...payload});
      if(err){
        message.info('查询错误！'+err.message);
        return;
      }
      if(data.data){
        const zhichuTable=[];
        data.data.content.map((item,index)=>(
          zhichuTable.push({
            number:index+1,
            key:item.id,
            amount:item.amount,
            bank:item.bank,
            payItemIdx:item.payItemIdx,
            payType:item.payType,
            showCode:item.showCode,
            time:item.time,
            type:item.type,
          })
        ))
        yield put({
          type:'setShouru',
          payload:{
            zhichuTable:zhichuTable,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            isShouru:payload.isShouru,
          }
        })
      }else{
        message.error(data.message);
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
		setZhanghu(state,{payload}){
			return { ...state, ...payload };
		},
		setShouru(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
