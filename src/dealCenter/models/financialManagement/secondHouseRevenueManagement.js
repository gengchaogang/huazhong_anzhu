import { routerRedux } from 'dva/router'
import {
  getShowTotalDataFetch,
  getSHExpendTableDataFetch,
  getSHIncomeTableDataFetch,
} from '../../services/financialManagement/secondHouseRevenueManagement';
import {
  isNull,
} from '../../../commons/utils/currencyFunction'

const initShowTotalDataJSON=JSON.stringify({
  sellData:[
    {
      title:'今日新增',
      deposit:0,
      firstPayment:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'本周',
      deposit:0,
      firstPayment:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'本月',
      deposit:0,
      firstPayment:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'季度',
      deposit:0,
      firstPayment:0,
      agencyFee:0,
      refundAmount:0,
    },
  ],
  rentData:[
    {
      title:'今日新增',
      deposit:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'本周',
      deposit:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'本月',
      deposit:0,
      agencyFee:0,
      refundAmount:0,
    },
    {
      title:'季度',
      deposit:0,
      agencyFee:0,
      refundAmount:0,
    },
  ],
})
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
  tabActiveKey:'shSellIncome',
  tableLoading:true,//表格loading
  pagination:{//分页
    total:0,
    current:1,
  },
};
export default {
  namespace:'secondHouseRevenueManagement',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/financialManagement/secondHouseRevenueManagement'){
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
      }=yield select(({secondHouseRevenueManagement})=>secondHouseRevenueManagement);
      const {fetch,agr}=getActiveTableDataFetch(tabActiveKey);
      const {data}=yield call(fetch,{
        keyword:keyWords,
        pageNo:current-1,
        pageSize:10,
        ...agr,
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
        const showTotalData={
          sellData:[
            {
              title:'今日新增',
              deposit:isNull(resultData.tsIntention,0),
              firstPayment:isNull(resultData.tsFirst,0),
              agencyFee:isNull(resultData.tsCommission,0),
              refundAmount:isNull(resultData.tsRefund,0),
            },
            {
              title:'本周',
              deposit:isNull(resultData.wsIntention,0),
              firstPayment:isNull(resultData.wsFirst,0),
              agencyFee:isNull(resultData.wsCommission,0),
              refundAmount:isNull(resultData.wsRefund,0),
            },
            {
              title:'本月',
              deposit:isNull(resultData.msIntention,0),
              firstPayment:isNull(resultData.msFirst,0),
              agencyFee:isNull(resultData.msCommission,0),
              refundAmount:isNull(resultData.msRefund,0),
            },
            {
              title:'季度',
              deposit:isNull(resultData.qsIntention,0),
              firstPayment:isNull(resultData.qsFirst,0),
              agencyFee:isNull(resultData.qsCommission,0),
              refundAmount:isNull(resultData.qsRefund,0),
            },
          ],
          rentData:[
            {
              title:'今日新增',
              deposit:isNull(resultData.trIntention,0),
              agencyFee:isNull(resultData.trCommission,0),
              refundAmount:isNull(resultData.trRefund,0),
            },
            {
              title:'本周',
              deposit:isNull(resultData.wrIntention,0),
              agencyFee:isNull(resultData.wrCommission,0),
              refundAmount:isNull(resultData.wrRefund,0),
            },
            {
              title:'本月',
              deposit:isNull(resultData.mrIntention,0),
              agencyFee:isNull(resultData.mrCommission,0),
              refundAmount:isNull(resultData.mrRefund,0),
            },
            {
              title:'季度',
              deposit:isNull(resultData.qrIntention,0),
              agencyFee:isNull(resultData.qrCommission,0),
              refundAmount:isNull(resultData.qrRefund,0),
            },
          ],
        }
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
            title:'获取二手房交易数据失败！',
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
      const{todo}=yield select(({secondHouseRevenueManagement})=>secondHouseRevenueManagement.promptObj);
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
  if(key==='shSellIncome'){
    return {
      fetch:getSHIncomeTableDataFetch,
      agr:{type:'出售'},
    }
  }
  else if(key==='shSellExpend'){
    return {
      fetch:getSHExpendTableDataFetch,
      agr:{type:'出售'}
    };
  }
  else if(key==='shRentIncome'){
    return {
      fetch:getSHIncomeTableDataFetch,
      agr:{type:'出租'}
    };
  }
  else if(key==='shRentExpend'){
    return {
      fetch:getSHExpendTableDataFetch,
      agr:{type:'出租'}
    };
  }
}
//根据tab key处理响应数据生成对应表格的data
function creatTableData(tabKey,records){
  if(tabKey==='shSellIncome'){
    return records.map((item,index)=>({
      key:`shSellIncomeKey_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      inventoryNumber:isNull(item.houseCode,'-'),
      paymentType:renderPaymentType(isNull(item.transType,'-')),
      orderNumber:isNull(item.orderNumber,'-'),
      paymentTransaction:isNull(item.serialNumber,'-'),
      paymentMethod:isNull(item.payType,'-'),
      payingCustomers:isNull(item.customerPhone,'-'),
      paymentAmount:`${isNull(item.payMoney,'-')}元`,
      paymentStatus:isNull(item.payStatus,'-'),
      paymentTime:isNull(item.payTime,'-'),
      transCode:isNull(item.trackCode,null),
    }));
  }
  else if(tabKey==='shSellExpend'){
    return records.map((item,index)=>({
      key:`shSellExpendKey_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      inventoryNumber:isNull(item.houseCode,'-'),
      expenditureType:isNull(item.expeneType,'-'),
      serialNumberExpenditure:isNull(item.serialNumber,'-'),
      expenditureOrderNumber:isNull(item.orderNumber,'-'),
      applicationTime:isNull(item.applyTime,'-'),
      paymentMethod:isNull(item.payType,'-'),
      paymentAccount:isNull(item.expenseAccount,'-'),
      expenditureAmount:`${isNull(item.expenseMoney,'-')}元`,
      state:isNull(item.status,'-'),
      spendingTime:isNull(item.expenseTime,'-'),
      transCode:isNull(item.trackCode,null),
    }));
  }
  else if(tabKey==='shRentIncome'){
    return records.map((item,index)=>({
      key:`shRentIncomeKey_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      inventoryNumber:isNull(item.houseCode,'-'),
      paymentType:renderRentPaymentType(isNull(item.transType,'-')),
      orderNumber:isNull(item.orderNumber,'-'),
      paymentTransaction:isNull(item.serialNumber,'-'),
      paymentMethod:isNull(item.payType,'-'),
      payingCustomers:isNull(item.customerPhone,'-'),
      paymentAmount:`${isNull(item.payMoney,'-')}元`,
      paymentStatus:isNull(item.payStatus,'-'),
      paymentTime:isNull(item.payTime,'-'),
      transCode:isNull(item.trackCode,null),
    }));
  }
  else if(tabKey==='shRentExpend'){
    return records.map((item,index)=>({
      key:`shSellExpendKey_${isNull(item.id,index)}`,
      number:isNull(item.id,index),
      inventoryNumber:isNull(item.houseCode,'-'),
      expenditureType:isNull(item.expeneType,'-'),
      serialNumberExpenditure:isNull(item.serialNumber,'-'),
      paymentOrderNumber:isNull(item.orderNumber,'-'),
      applicationTime:isNull(item.applyTime,'-'),
      paymentMethod:isNull(item.payType,'-'),
      expenditureAccount:isNull(item.expenseAccount,'-'),
      paymentAmount:`${isNull(item.expenseMoney,'-')}元`,
      state:isNull(item.status,'-'),
      operationTime:isNull(item.expenseTime,'-'),
      transCode:isNull(item.trackCode,null),
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
function renderPaymentType(type){
  if(type==='佣金'){
    return '房屋佣金'
  }
  else if(type==='首付款'){
    return '房屋首付'
  }
  else if(type==='意向金'){
    return '房屋定金'
  }
  else{
    return '-'
  }
}
function renderRentPaymentType(type){
  if(type==='佣金'){
    return '租赁佣金'
  }
  // else if(type==='首付款'){
  //   return '租房首付'
  // }
  else if(type==='意向金'){
    return '租赁定金'
  }
  else{
    return '-'
  }
}
