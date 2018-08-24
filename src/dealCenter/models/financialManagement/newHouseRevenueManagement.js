import { routerRedux } from 'dva/router'
import {
  getNewHouseBudgetManageFetch,
  getNewHouseIncomeListFetch,
  getNewHouseExpenseListFetch,
} from '../../services/financialManagement/newHouseRevenueManagement';
import {
  isNull,
} from '../../../commons/utils/currencyFunction'
const initHistorRecordData=[
  {
    title:'今日新增',
    newHomeElectricitySuppliersDiscount:0,
    electricitySuppliersDiscountAmount:0,
    transactionNumber:0,
    electronicBusinessRefund:0,
    refundAmount:0,
  },
  {
    title:'本周',
    newHomeElectricitySuppliersDiscount:0,
    electricitySuppliersDiscountAmount:0,
    transactionNumber:0,
    electronicBusinessRefund:0,
    refundAmount:0,
  },
  {
    title:'本月',
    newHomeElectricitySuppliersDiscount:0,
    electricitySuppliersDiscountAmount:0,
    transactionNumber:0,
    electronicBusinessRefund:0,
    refundAmount:0,
  },
  {
    title:'季度',
    newHomeElectricitySuppliersDiscount:0,
    electricitySuppliersDiscountAmount:0,
    transactionNumber:0,
    electronicBusinessRefund:0,
    refundAmount:0,
  },
];

const initState={
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
  keyword:'',
  pageNo:1,
  total:0,
  activeTableData:[],
  tabActiveKey:'income',
  historyRecordData:JSON.stringify(initHistorRecordData),
};
export default {
  namespace:'newHouseRevenueManagement',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/financialManagement/newHouseRevenueManagement'){
        //  dispatch({type:'initComponent'})
        setTimeout(()=>dispatch({
          type:'initComponent',
        }),0);
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'})
      yield put({
        type:'getUpdateData',
        payload:{keyword:'',pageNo:1}
      })
    },
    //更新数据
    *getUpdateData({payload},{call,select,put}){
      // console.log('zhiixn',payload);
      yield put({type:'getHistoryRecordData'});
      const {tabActiveKey}=yield select(({newHouseRevenueManagement})=>newHouseRevenueManagement);
      const {data}=yield call(generateTableDataFuc(tabActiveKey),{
      pageNo:payload.pageNo-1,
      keyword:payload.keyword,
      pageSize:10});
      if(!!data){
        if(data.status==='success'){
          yield put({
            type:'updateTableData',
            payload:{
              activeTableData:creatTableData(tabActiveKey,data.data.content),
              pageNo:data.data.number+1,
              total:data.data.totalElements,
              keyword:payload.keyword,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败！',
              todo:'default',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请刷新页面',
            title:'获取交易数据失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },

    //获取历史新房数据
    *getHistoryRecordData({payload},{call,put,select}){
      const {data}=yield call(getNewHouseBudgetManageFetch);
      if(!!data){
        if(data.status==='success'){
          const historyRecordData=[
            {
              title:'今日新增',
              newHomeElectricitySuppliersDiscount:isNull(data.data.todayGroupbuy,0),
              electricitySuppliersDiscountAmount:isNull(data.data.todayGroupbuyMoney,0),
              transactionNumber:isNull(data.data.todayHouse,0),
              electronicBusinessRefund:isNull(data.data.todayRefund,0),
              refundAmount:isNull(data.data.todayRefundMoney,0),
            },
            {
              title:'本周',
              newHomeElectricitySuppliersDiscount:isNull(data.data.weekGroupbuy,0),
              electricitySuppliersDiscountAmount:isNull(data.data.weekGroupbuyMoney,0),
              transactionNumber:isNull(data.data.weekHouse,0),
              electronicBusinessRefund:isNull(data.data.weekRefund,0),
              refundAmount:isNull(data.data.weekRefundMoney,0),
            },
            {
              title:'本月',
              newHomeElectricitySuppliersDiscount:isNull(data.data.monthGroupbuy,0),
              electricitySuppliersDiscountAmount:isNull(data.data.monthGroupbuyMoney,0),
              transactionNumber:isNull(data.data.monthHouse,0),
              electronicBusinessRefund:isNull(data.data.monthRefund,0),
              refundAmount:isNull(data.data.monthRefundMoney,0),
            },
            {
              title:'季度',
              newHomeElectricitySuppliersDiscount:isNull(data.data.quarterGroupbuy,0),
              electricitySuppliersDiscountAmount:isNull(data.data.quarterGroupbuyMoney,0),
              transactionNumber:isNull(data.data.quarterHouse,0),
              electronicBusinessRefund:isNull(data.data.quarterRefund,0),
              refundAmount:isNull(data.data.quarterRefundMoney,0),
            },
          ];
          yield put({
            type:'upDateHistoryRecordData',
            payload:JSON.stringify(historyRecordData),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取新房交易历史记录失败！',
              todo:'default',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请刷新页面',
            title:'获取新房交易历史记录失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //tab切换
    *updateTabsActiveKey({payload},{put,select}){
      const{keyword}=yield select(({newHouseRevenueManagement})=>newHouseRevenueManagement);
      yield put({
        type:'doChangeTabsActiveKey',
        payload,
      })
      yield put({type:'getUpdateData',payload:{keyword:keyword,pageNo:1}})
    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({newHouseRevenueManagement})=>newHouseRevenueManagement.promptObj);
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
    doChangeTabsActiveKey(state,action){
      return {...state,tabActiveKey:action.payload}
    },
    //更新历史交易信息
    upDateHistoryRecordData(state,action){
      return {...state,historyRecordData:action.payload}
    },
    //更新激活tab下表格数据
    updateTableData(state,action){
      return {...state,...action.payload}
    },
  },
}
//根据tab key 生成对应的表格获取fetch函数
function generateTableDataFuc(key){
  if(key==='income'){
    return getNewHouseIncomeListFetch
  }else if(key==='expenditure'){
    return getNewHouseExpenseListFetch
  }
}
//根据tab key处理响应数据生成对应表格的data
function creatTableData(tabKey,records){
  if(tabKey==='income'){
    return records.map((item,index)=>({
      key:`key_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      electricitySuppliersProject:isNull(item.projectName,'-'),
      electricitySuppliersPreferential:isNull(item.specialOffer,'-'),
      orderNumber:isNull(item.orderNumber,'-'),
      paymentTransaction:isNull(item.serialNumber,'-'),
      paymentMethod:isNull(item.payType,'-'),
      payingCustomers:isNull(item.customerPhone,'-'),
      paymentTime:isNull(item.payTime,'-'),
      paymentAmount:isNull(item.payMoney,'-'),
      state:isNull(item.payStatus,'-'),
    }));
  }else if(tabKey==='expenditure'){
    return records.map((item,index)=>({
      key:`key_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      electricitySuppliersProject:isNull(item.projectName,'-'),
      expenditureType:renderExpenditureType(isNull(item.expeneType,'-')),
      orderNumber:isNull(item.orderNumber,'-'),
      paymentTransaction:isNull(item.serialNumber,'-'),
      paymentMethod:isNull(item.payType,'-'),
      applicationTime:isNull(item.applyTime,'-'),
      paymentAmount:isNull(item.totalAmt,'-'),
      state:isNull(item.status,'-'),
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
