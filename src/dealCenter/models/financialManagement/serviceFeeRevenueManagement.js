import { routerRedux } from 'dva/router'
import {
  getShowTotalDataFetch,
  serviceChargeExpendTableDataFetch,
  serviceChargeIncomeTableDataFetch,
} from '../../services/financialManagement/serviceFeeRevenueManagement';
import {
  isNull,
} from '../../../commons/utils/currencyFunction'

const initShowTotalDataJSON=JSON.stringify([
    {
      title:'今日新增',
      newHouseCommissionIncome:0,
      secondHandHouseSalesRevenue:0,
      secondHandHouseRentalIncome:0,
    },
    {
      title:'本周',
      newHouseCommissionIncome:0,
      secondHandHouseSalesRevenue:0,
      secondHandHouseRentalIncome:0,
    },
    {
      title:'本月',
      newHouseCommissionIncome:0,
      secondHandHouseSalesRevenue:0,
      secondHandHouseRentalIncome:0,
    },
    {
      title:'季度',
      newHouseCommissionIncome:0,
      secondHandHouseSalesRevenue:0,
      secondHandHouseRentalIncome:0,
    },
  ])
const initState={
  promptObj:{
    visible:false,
    title:'提示',
    description:'',
    todo:'default',
  },
  showTotalDataJSON:initShowTotalDataJSON,
  keyWords:'',
  activeTableData:[],
  tabActiveKey:'serviceChargeIncome',
  tableLoading:true,//表格loading
  pagination:{//分页
    total:0,
    current:1,
  },
};
export default {
  namespace:'serviceFeeRevenueManagement',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/financialManagement/ServiceFeeRevenueManagement'){
         dispatch({type:'initComponent'})
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'})
      yield put({
        type:'getShowTotalData',
      })
      yield put({
        type:'getActiveTableData'
      })
    },
    //获取激活表格数据
    *getActiveTableData({payload},{call,select,put}){
      yield put({
        type:'changeTableLoading',
        payload:true,
      })
      const {
        tabActiveKey,
        pagination:{
          total,
          current,
        },
        keyWords,
      }=yield select(({serviceFeeRevenueManagement})=>serviceFeeRevenueManagement);
      const {data}=yield call(getActiveTableDataFetch(tabActiveKey),{
        keyword:keyWords,
        pageNo:current-1,
        pageSize:10,
      });
      if(!!data && !!data.data){
        const tableData=creatTableData(tabActiveKey,data.data.content);
        yield put({
          type:'updateActiveTableData',
          payload:{
            activeTableData:tableData,
            pagination:{
              total:isNull(data.data.totalElements,0),
              current:isNull(data.data.number,0)+1,
            },
          }
        })
      }else{
        yield put({
          type:'changeTableLoading',
          payload:false,
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败，请刷新页面'),
            title:'获取表格数据数据失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //获取表格上方展示数据
    *getShowTotalData({payload},{call,put}){
      const {data}=yield call(getShowTotalDataFetch);
      if(!!data && !!data.data){
        const resultData=data.data;
        const showTotalData=[
          {
            title:'今日新增',
            newHouseCommissionIncome:isNull(resultData.tNewHouseCommission,0),
            secondHandHouseSalesRevenue:isNull(resultData.tSecondHouseSaleMoney,0),
            secondHandHouseRentalIncome:isNull(resultData.tSecondHouseRentMoney,0),
          },
          {
            title:'本周',
            newHouseCommissionIncome:isNull(resultData.wNewHouseCommission,0),
            secondHandHouseSalesRevenue:isNull(resultData.wSecondHouseSaleMoney,0),
            secondHandHouseRentalIncome:isNull(resultData.wSecondHouseRentMoney,0),
          },
          {
            title:'本月',
            newHouseCommissionIncome:isNull(resultData.mNewHouseCommission,0),
            secondHandHouseSalesRevenue:isNull(resultData.mSecondHouseSaleMoney,0),
            secondHandHouseRentalIncome:isNull(resultData.mSecondHouseRentMoney,0),
          },
          {
            title:'季度',
            newHouseCommissionIncome:isNull(resultData.qNewHouseCommission,0),
            secondHandHouseSalesRevenue:isNull(resultData.qSecondHouseSaleMoney,0),
            secondHandHouseRentalIncome:isNull(resultData.qSecondHouseRentMoney,0),
          },
        ];
        yield put({
          type:'updateShowTotalData',
          payload:JSON.stringify(showTotalData),
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败，请刷新页面'),
            title:'获取服务费数据失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //分页变化
    *changePage({payload},{put}){
      yield put({
        type:'updatePageNo',
        payload,
      })
      yield put({
        type:'getActiveTableData'
      })
    },
    //关键词切换
    *changeKeyWords({payload},{put}){
      yield put({
        type:'updateKeyWord',
        payload,
      })
      yield put({
        type:'getActiveTableData'
      })
    },
    //tab切换
    *changeTab({payload},{put}){
      yield put({
        type:'updateTabsActiveKey',
        payload,
      })
      yield put({type:'getActiveTableData'})
    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({serviceFeeRevenueManagement})=>serviceFeeRevenueManagement.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'goOut':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
  },
  reducers:{
    doInitState(state,action){
      return initState;
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //更新tab_key
    updateTabsActiveKey(state,action){
      return {...state,tabActiveKey:action.payload,pagination:initState.pagination}
    },
    //更新激活tab下表格数据
    updateActiveTableData(state,action){
      return {...state,...action.payload,tableLoading:false}
    },
    //更新表格上方显示数据
    updateShowTotalData(state,action){
      return {...state,showTotalDataJSON:action.payload}
    },
    //切换表格loading
    changeTableLoading(state,action){
      return {...state,tableLoading:action.payload}
    },
    //分页
    updatePageNo(state,action){
      return {...state,pagination:{...state.pagination,current:action.payload}}
    },
    //搜索
    updateKeyWord(state,action){
      return {...state,keyWords:action.payload,pagination:initState.pagination}
    },
  },
}
//根据tab key 生成对应的表格获取fetch函数
function getActiveTableDataFetch(key){
  if(key==='serviceChargeIncome'){
    return serviceChargeIncomeTableDataFetch
  }
  else if(key==='serviceChargeExpend'){
    return serviceChargeExpendTableDataFetch
  }
}
//根据tab key处理响应数据生成对应表格的data
function creatTableData(tabKey,records){
  if(tabKey==='serviceChargeIncome'){
    return records.map((item,index)=>({
      key: `serviceChargeIncomeKey_${isNull(item.id,index)}`,
      number: isNull(item.id,index),
      incomeType:isNull(item.incomeType,'-'),
      tradingHouses:isNull(item.house,'-'),
      commission:`${isNull(item.transCommission,'-')}元`,
      transactionChargeRatio:`${isNull(item.scale,'-')}%`,
      returnFlow:isNull(item.incomeSerialNum,'-'),
      incomeApproach:isNull(item.incomeWay,'-'),
      incomeCommission:`${isNull(item.incomeCommission,'-')}元`,
      incomeTime:isNull(item.incomeTime,'-'),
    }));
  }
  else if(tabKey==='serviceChargeExpend'){
    return records.map((item,index)=>({
      key: `serviceChargeExpendKey_${isNull(item.id,index)}`,
      number: isNull(item.id,index),
      expenditureType:isNull(item.expenseType,'-'),
      serialNumberExpenditure:isNull(item.expenseSerialNum,'-'),
      expenditurePattern:isNull(item.expenseWay,'-'),
      expenditureAccount:isNull(item.expenseAccount,'-'),
      expenditureAmount:`${item.amount,'-'}元`,
      spendingTime:isNull(item.expenseTime,'-'),
    }));
  }
}
function renderExpenditureType(type){
  if(type==='退款'){
    return '申请退款'
  }
  else if(type==='最终分佣'){
    return '佣金分配'
  }
  else{
    return '-'
  }
}
