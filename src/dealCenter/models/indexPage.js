import {
  getTradeCenterTradeInfo,
} from '../services/indexPage';
import {
  isNull,
  judgeJurisdiction,
  renderTradeCenterIndexPageEntranceRouter,
  getArrayObjectValue,
} from '../../commons/utils/currencyFunction'
import {parse} from 'qs';
/*勿删！入口Map数据
const initialEntranceMap=new Map();
initialEntranceMap.set('reported',{
  path:'tradeManagement/newHouseTrade',
  title:'待处理报备',
  number:0,
  className:'badge_reporting',
  bgcolor:'#F6867A',
});
initialEntranceMap.set('secondHandTransactions',{
  path:'tradeManagement/secondHouseSellTrade',
  title:'二手房报成交',
  number:0,
  className:'badge_complete_transaction',
  bgcolor:'#9ABFBB',
});
initialEntranceMap.set('businessManagement',{
  path:'businessManagement/organizeStructureManagement',
  title:'员工管理',
  number:0,
  className:'badge_management',
  bgcolor:'#85C1DA',
});
initialEntranceMap.set('secondHandRent',{
  path:'tradeManagement/secondHouseRentTrade',
  title:'二手房报出租',
  number:0,
  className:'badge_rent',
  bgcolor:'#BAD77B',
});
initialEntranceMap.set('loanManagement',{
  path:'loanManagement/secondHandHouseMortgageDeal',
  title:'待处理贷款',
  number:0,
  className:'badge_loan',
  bgcolor:'#8399BB',
});
initialEntranceMap.set('transferManagement',{
  path:'transferManagement/secondHandHouseTransfer',
  title:'待处理过户',
  number:0,
  className:'badge_transfer',
  bgcolor:'#85DA9F',
});
initialEntranceMap.set('contractReview',{
  path:'contractReview/newhousetransactionContractReview',
  title:'合同审批',
  number:0,
  className:'badge_contract',
  bgcolor:'#F7C896',
});
initialEntranceMap.set('financialManagement',{
  path:'financialManagement/newHouseElectricityExamination',
  title:'财务审批',
  number:0,
  className:'badge_finance',
  bgcolor:'#F99E86',
});
*/
/*勿删！入口Map数据*/
//四个图标初始值
const echartsRecordListData={
  secVolumeProps:{
    xData: [],
    mainTitleLegend:['二手房成交量'],
    boundaryGap:true,
    yData: {
      name:'二手房成交量',
      type:'bar',
      data:[]
    },
  },
  secRentProps:{
    xData: [],
    mainTitleLegend:['二手房出租数量'],
    boundaryGap:true,
    yData: {
      name:'二手房出租数量',
      type:'bar',
      data:[]
    },
  },
  newECommerceProps:{
    xData: [],
    mainTitleLegend:['新房电商优惠成交'],
    boundaryGap:true,
    yData: {
      name:'新房电商优惠成交',
      type:'bar',
      data:[]
    },
  },
  newDealProps:{
    xData: [],
    mainTitleLegend:['新房成交'],
    boundaryGap:true,
    yData: {
      name:'新房成交',
      type:'bar',
      data:[],
    },
  },
}
export default {
  namespace:'indexPage',
  state:{
    isDrowChart:{
      isDrow:false,
      xData:[],
      yData:[],
      mainTitleLegend:'',
    },
    entranceState:{
      loading:true,
      entranceData:[],
    },
    echartsRecordListProps:JSON.stringify(echartsRecordListData),
    globalData:{
      newHouseViewed:0,
      groupBuying:0,
      newHouseTransaction:0,
      newHouseTransactionCommission:0,
      secondHandHouseReportTransaction:0,
      secondHandHouseTransaction:0,
      secondHandHouseLoan:0,
      secondHandHouseTransactionCommission:0,
      secondHandHouseReportRent:0,
      secondHandHouseRent:0,
      secondHandHouseRentStage:0,
      secondHandHouseRentCommission:0,
    },
    promptObj:{
      visible:false,
      description:'',
      title:'',
      okText:'确定',
      todo:'default',
    },
  },
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/indexPage' && !!sessionStorage.getItem('anzhu_login')) {
        //  dispatch({
        //    type:'doInitIndexPage'
        //  })
         dispatch({
           type:'initComponent'
         })
        // setTimeout(()=>dispatch({
        //   type:'doInitIndexPage',
        // }),0);
       }
     });
   },
  },
  effects:{
    //初始化组件state
    *initComponent({payload},{put}){
      yield put({
        type:'getTradeRecordInfo'
      })
    },
    //快捷入口权限
    // *getEntrance({ payload }, { call, put }){
    //   const entranceData=[];
    //   //权限判断注入哪些入口（个别跳转依据权限动态配置路由）
    //   if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_DEAL')){
    //     entranceData.push(initialEntranceMap.get('reported'));
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE')){
    //     entranceData.push(initialEntranceMap.get('secondHandTransactions'));
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT')){
    //     entranceData.push(initialEntranceMap.get('secondHandRent'));
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_LOAN_REVENUE_MANAGEMENT')){
    //     const entItem = initialEntranceMap.get('loanManagement');
    //     entItem.path = renderTradeCenterIndexPageEntranceRouter('贷款')
    //     entranceData.push(entItem);
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_FINANCIAL_MANAGEMENT')){
    //     const entItem = initialEntranceMap.get('financialManagement');
    //     entItem.path = renderTradeCenterIndexPageEntranceRouter('财务')
    //     entranceData.push(entItem);
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_CHANGENAME_MANAGEMENT')){
    //     entranceData.push(initialEntranceMap.get('transferManagement'));
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_DEALORCONTRACT_AUDIT')){
    //     const entItem = initialEntranceMap.get('contractReview');
    //     entItem.path = renderTradeCenterIndexPageEntranceRouter('合同')
    //     entranceData.push(entItem);
    //   }
    //   if(judgeJurisdiction('TRADINGCENTER_ENTERPRISE_MANAGEMENT')){
    //     entranceData.push(initialEntranceMap.get('businessManagement'));
    //   }
    //   yield put({
    //     type:'initEntranceState',
    //     payload:{
    //       loading:false,
    //       entranceData,
    //     }
    //   });
    //   // yield put({type:'getTradeRecordInfo'})
    // },
    //初始化首页，获取对应数据及入口
    // *doInitIndexPage({payload},{put,takeLatest,select}){
    //   const {
    //     userInfo,
    //   }=yield select(({main})=>main);
    //   function *getEntranceFun(){
    //     const {
    //       userInfo,
    //     }=yield select(({main})=>main);
    //     yield put({
    //       type:'getEntrance',
    //       payload:userInfo,
    //     })
    //   }
    //   if(!!userInfo){
    //     yield put({
    //       type:'getEntrance',
    //       payload:userInfo,
    //     })
    //   }else{
    //     yield takeLatest('main/initUserInfo',getEntranceFun)
    //   }
    // },
    //获取交易中心交易记录统计信息
    *getTradeRecordInfo({payload},{select,call,put}){
      const {entranceData}=yield select(({indexPage})=>indexPage.entranceState);
      console.log('entranceData',entranceData);
      const {data}=yield call(getTradeCenterTradeInfo);
      if(!!data){
        if(data.status==='success'){
          const {
            newHouseData,
            centerTopStatisticData,
            newHouseDealList,
            newHouseGroupBuyList,
            secHouseRentData,
            secHouseRentDealList,
            secHouseSellData,
            secHouseSellDealList,
          }=data.data;
          // const neweNtranceData=[];
          // entranceData.map(item=>{
          //   if(item.className==='badge_reporting'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.newHouseReportTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_complete_transaction'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.secReportTransactionTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_management'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.staffTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_rent'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.secReportRentTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_loan'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.handLoanTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_transfer'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.handTransferTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_contract'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.contractTotal,0),
          //     })
          //   }
          //   else if(item.className==='badge_finance'){
          //     neweNtranceData.push({
          //       ...item,
          //       number:isNull(centerTopStatisticData.financeTotal,0),
          //     })
          //   }
          // })
          const globalData={
            newHouseViewed:isNull(newHouseData.viewTotal,0),
            groupBuying:isNull(newHouseData.groupBuyTotal,0),
            newHouseTransaction:isNull(newHouseData.dealTotal,0),
            newHouseTransactionCommission:isNull(newHouseData.commisionSum,0),
            secondHandHouseReportTransaction:isNull(secHouseSellData.reportTotal,0),
            secondHandHouseTransaction:isNull(secHouseSellData.transactionTotal,0),
            secondHandHouseLoan:isNull(secHouseSellData.loanTotal,0),
            secondHandHouseTransactionCommission:isNull(secHouseSellData.commisionTotal,0),
            secondHandHouseReportRent:isNull(secHouseRentData.reportTotal,0),
            secondHandHouseRent:isNull(secHouseRentData.transactionTotal,0),
            secondHandHouseRentStage:isNull(secHouseRentData.loanTotal,0),
            secondHandHouseRentCommission:isNull(secHouseRentData.commisionTotal,0),
          }
          const echartsRecordListData={
            secVolumeProps:{
              xData:getArrayObjectValue(secHouseSellDealList,'name'),
              mainTitleLegend:['二手房成交量'],
              boundaryGap:true,
              yData: {
                name:'二手房成交量',
                type:'bar',
                data:getArrayObjectValue(secHouseSellDealList,'number'),
              },
            },
            secRentProps:{
              xData: getArrayObjectValue(secHouseRentDealList,'name'),
              mainTitleLegend:['二手房出租数量'],
              boundaryGap:true,
              yData: {
                name:'二手房出租数量',
                type:'bar',
                data:getArrayObjectValue(secHouseRentDealList,'number'),
              },
            },
            newECommerceProps:{
              xData: getArrayObjectValue(newHouseGroupBuyList,'name'),
              mainTitleLegend:['新房电商优惠成交'],
              boundaryGap:true,
              yData: {
                name:'新房电商优惠成交',
                type:'bar',
                data:getArrayObjectValue(newHouseGroupBuyList,'number'),
              },
            },
            newDealProps:{
              xData: getArrayObjectValue(newHouseDealList,'name'),
              mainTitleLegend:['新房成交'],
              boundaryGap:true,
              yData: {
                name:'新房成交',
                type:'bar',
                data:getArrayObjectValue(newHouseDealList,'number'),
              },
            },
          }
          // console.log('echartsRecordListData',echartsRecordListData);
          yield put({
            type:'updataTradeDataInfo',
            payload:{
              globalData,
              echartsRecordListProps:JSON.stringify(echartsRecordListData),
              entranceState:{
                loading:true,
                entranceData:[],
              },
            }
          })
          yield put({
            type:'getUserInfo',
            payload:centerTopStatisticData,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易中心交易统计信息失败！',
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
            title:'获取交易中心交易统计信息失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //获取userInfo
    *getUserInfo({payload},{put,select,takeLatest}){
      //获取权限
      const {
        userInfo,
      }=yield select(({main})=>main);
      function *getEntranceFun(){
        const {
          userInfo,
        }=yield select(({main})=>main);
        yield put({
          type:'renderEntranceData',
          payload,
        })
      }
      if(!!userInfo){
        yield put({
          type:'renderEntranceData',
          payload,
        })
      }else{
        yield takeLatest('main/initUserInfo',getEntranceFun)
      }
    },
    //依据后端数据+权限 渲染快捷入口
    *renderEntranceData({payload},{put}){
      console.log('payload',payload);
      //调用方法 生成entranceData
      const entranceData = getEntranceData(payload);
      console.log('entranceData',entranceData);
      yield put({
        type:'updateEntranceData',
        payload:{
          loading:false,
          entranceData,
        }
      })
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ main }) => main.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt'});
          break;
        default:
          yield put({type:'onlyClosePrompt'});
          break;
      }
    },
  },
  reducers:{
    //更新提示模态框
    switchPrompt(state,action){
      return{...state,promptObj:{...state.promptObj,...action.payload}}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:{...state.promptObj,visible:false}}
    },
    updataTradeDataInfo(state,action){
      return {...state,...action.payload}
    },
    initEntranceState(state,action){
      return {
        ...state,
        entranceState:{
          ...state.entranceState,
          ...action.payload,
        },
      };
    },
    initGlobalData(state,action){
      return { ...state, ...action.payload};
    },
    updateEntranceData(state,action){
      return {...state,entranceState:action.payload}
    },
  },
}
//生成 交易中心首页 快捷入口数据
function getEntranceData(tradeData){
  const entranceData = [];
  //待处理报备
  if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_DEAL')){
    entranceData.push({
      path:'tradeManagement/newHouseTrade',
      title:'待处理报备',
      number:isNull(tradeData.newHouseReportTotal,0),
      className:'badge_reporting',
      bgcolor:'#F6867A',
      tabKey:{
        name:'nh_trade_tab',
        value:'hasReported',
      }
    });
  }
  //二手房报成交
  if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE')){
    entranceData.push({
      path:'tradeManagement/secondHouseSellTrade',
      title:'二手房报成交',
      number:isNull(tradeData.secReportTransactionTotal,0),
      className:'badge_complete_transaction',
      bgcolor:'#9ABFBB',
      tabKey:{
        name:'sh_sell_trade_tab',
        value:'handle',
      }
    });
  }
  //二手房报出租
  if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE')){
    entranceData.push({
      path:'tradeManagement/secondHouseRentTrade',
      title:'二手房报出租',
      number:isNull(tradeData.secReportRentTotal,0),
      className:'badge_rent',
      bgcolor:'#BAD77B',
      tabKey:{
        name:'sh_rent_trade_tab',
        value:'handle',
      }
    });
  }
  //待处理贷款
  const loanJur = {
    hasReleveLoan:judgeJurisdiction('TRADINGCENTER_SECONDHAND_SIGN_LOAN'),
    hasSaleLoan:judgeJurisdiction('TRADINGCENTER_SECONDHAND_LOAN'),
    hasRentLoan:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_INSTALLMENT_MANAGEMENT'),
  }
  if(loanJur.hasReleveLoan || loanJur.hasSaleLoan || loanJur.hasRentLoan){
    const loanEntr = {
      path:null,
      title:'待处理贷款',
      number:0,
      className:'badge_loan',
      bgcolor:'#8399BB',
      tabKey:null,
    }
    const stackArr = [];
    //解押
    if(loanJur.hasReleveLoan){
      if(isNull(tradeData.loanTotalModel.jy,0) === 0){
        stackArr.push({
          path:'loanManagement/secondHandHouseSolution'
        })
      }else{
        loanEntr.number += isNull(tradeData.loanTotalModel.jy,0);
        if(loanEntr.path === null){
          loanEntr.path = 'loanManagement/secondHandHouseSolution'
        }
      }
    }
    // 贷款
    if(loanJur.hasSaleLoan){
      if(isNull(tradeData.loanTotalModel.dk,0) === 0){
        stackArr.push({
          path:'loanManagement/secondHandHouseMortgageDeal'
        })
      }else{
        loanEntr.number += isNull(tradeData.loanTotalModel.dk,0);
        if(loanEntr.path === null){
          loanEntr.path = 'loanManagement/secondHandHouseMortgageDeal'
        }
      }
    }
    // 分期
    if(loanJur.hasRentLoan){
      if(isNull(tradeData.loanTotalModel.fq,0) === 0){
        stackArr.push({
          path:'loanManagement/secondHandHouseRentalLoans'
        })
      }else{
        loanEntr.number += isNull(tradeData.loanTotalModel.fq,0);
        if(loanEntr.path === null){
          loanEntr.path = 'loanManagement/secondHandHouseRentalLoans'
        }
      }
    }
    if(loanEntr.path === null){
      loanEntr.path = stackArr[0].path;
    }
    entranceData.push(loanEntr)
  }
  //财务审批
  const financialJur = {
    hasNhCommit:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_DEAL_FINANCIAL_AUDIT'),
    hasNhRefund:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_REFUND_FINANCIAL_AUDIT'),
    hasShSellCommit:judgeJurisdiction('TRADINGCENTER_SECONDHAND_DEAL_FINANCIAL_AUDIT'),
    hasShSellRefund:judgeJurisdiction('TRADINGCENTER_SECONDHAND_REFUND_FINANCIAL_AUDIT'),
    hasShRentCommit:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_FINANCIAL_AUDIT'),
    hasShRentRefund:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_REFUND_FINANCIAL_AUDIT'),
  }
  if(financialJur.hasNhCommit || financialJur.hasNhRefund || financialJur.hasShSellCommit || financialJur.hasShSellRefund || financialJur.hasShRentCommit || financialJur.hasShRentRefund){
    const financialEntr = {
      path:null,
      title:'财务审批',
      number:0,
      className:'badge_finance',
      bgcolor:'#F99E86',
      tabKey:null,
    }
    const stackArr = [];
    //新房成交
    if(financialJur.hasNhCommit){
      if(isNull(tradeData.financeTotalXx.newHouseCj,0) === 0){
        stackArr.push({
          path:'financialManagement/newHouseElectricityExamination',
          tabKey:{
            name:'financialManagement_nh',
            value:'commit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.newHouseCj,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/newHouseElectricityExamination';
          financialEntr.tabKey = {
            name:'financialManagement_nh',
            value:'dealAudit',
          }
        }
      }
    }
    //新房退款
    if(financialJur.hasNhRefund){
      if(isNull(tradeData.financeTotalXx.newHouseTg,0) === 0){
        stackArr.push({
          path:'financialManagement/newHouseElectricityExamination',
          tabKey:{
            name:'financialManagement_nh',
            value:'refundAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.newHouseTg,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/newHouseElectricityExamination';
          financialEntr.tabKey = {
            name:'financialManagement_nh',
            value:'refundAudit',
          }
        }
      }
    }
    //二手房出售 成交
    if(financialJur.hasShSellCommit){
      if(isNull(tradeData.financeTotalXx.secHouseSellCj,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseSellExamine',
          tabKey:{
            name:'financialManagement_sh_sell',
            value:'dealAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseSellCj,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseSellExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_sell',
            value:'dealAudit',
          }
        }
      }
    }
    //二手房出售 意向金退款
    if(financialJur.hasShSellRefund){
      if(isNull(tradeData.financeTotalXx.secHouseSellYxj,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseSellExamine',
          tabKey:{
            name:'financialManagement_sh_sell',
            value:'intentMoneyAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseSellYxj,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseSellExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_sell',
            value:'intentMoneyAudit',
          }
        }
      }
    }
    //二手房出售 首付款退款 （暂屏蔽）
    // if(financialJur.hasShSellRefund){
    //   if(isNull(tradeData.financeTotalXx.secHouseSellSfktk,0) === 0){
    //     stackArr.push({
    //       path:'financialManagement/secondHouseSellExamine',
    //       tabKey:{
    //         name:'financialManagement_sh_sell',
    //         value:'downPaymentAudit',
    //       }
    //     })
    //   }else{
    //     financialEntr.number += isNull(tradeData.financeTotalXx.secHouseSellSfktk,0);
    //     if(financialEntr.path === null){
    //       financialEntr.path = 'financialManagement/secondHouseSellExamine';
    //       financialEntr.tabKey = {
    //         name:'financialManagement_sh_sell',
    //         value:'downPaymentAudit',
    //       }
    //     }
    //   }
    // }

    //二手房出售 佣金退款
    if(financialJur.hasShSellRefund){
      if(isNull(tradeData.financeTotalXx.secHouseSellYjtk,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseSellExamine',
          tabKey:{
            name:'financialManagement_sh_sell',
            value:'commissionAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseSellYjtk,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseSellExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_sell',
            value:'commissionAudit',
          }
        }
      }
    }
    //二手房出租 成交申请
    if(financialJur.hasShRentCommit){
      if(isNull(tradeData.financeTotalXx.secHouseRentCj,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseLeaseExamine',
          tabKey:{
            name:'financialManagement_sh_rent',
            value:'dealAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseRentCj,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseLeaseExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_rent',
            value:'dealAudit',
          }
        }
      }
    }
    //二手房出租 意向金退款
    if(financialJur.hasShRentRefund){
      if(isNull(tradeData.financeTotalXx.secHouseRentYxjtk,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseLeaseExamine',
          tabKey:{
            name:'financialManagement_sh_rent',
            value:'intentMoneyAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseRentYxjtk,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseLeaseExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_rent',
            value:'intentMoneyAudit',
          }
        }
      }
    }
    //二手房出租 佣金退款
    if(financialJur.hasShRentRefund){
      if(isNull(tradeData.financeTotalXx.secHouseRentyjtk,0) === 0){
        stackArr.push({
          path:'financialManagement/secondHouseLeaseExamine',
          tabKey:{
            name:'financialManagement_sh_rent',
            value:'commissionAudit',
          }
        })
      }else{
        financialEntr.number += isNull(tradeData.financeTotalXx.secHouseRentyjtk,0);
        if(financialEntr.path === null){
          financialEntr.path = 'financialManagement/secondHouseLeaseExamine';
          financialEntr.tabKey = {
            name:'financialManagement_sh_rent',
            value:'commissionAudit',
          }
        }
      }
    }
    //均为零 判断
    if(financialEntr.path === null){
      financialEntr.path = stackArr[0].path;
      financialEntr.tabKey = stackArr[0].tabKey;
    }
    entranceData.push(financialEntr)
  }
  //待处理过户
  if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_CHANGENAME')){
    entranceData.push({
      path:'transferManagement/secondHandHouseTransfer',
      title:'待处理过户',
      number:isNull(tradeData.handTransferTotal,0),
      className:'badge_transfer',
      bgcolor:'#85DA9F',
    })
  }
  //合同审批
  const contractJur = {
    hasProUp:judgeJurisdiction('TRADINGCENTER_PROJECT_ISSUED_AUDIT'),
    hasProDown:judgeJurisdiction('TRADINGCENTER_PROJECT_SHELVES_AUDIT'),
    hasNhCommit:judgeJurisdiction('TRADINGCENTER_CLINCHADEAL_AUDIT'),
    hasNhRefund:judgeJurisdiction('TRADINGCENTER_REFUND_AUDIT'),
    hasShSellCommit:judgeJurisdiction('TRADINGCENTER_SECONDHAND_DEAL_CONTRACT_AUDIT'),
    hasShSellRefund:judgeJurisdiction('TRADINGCENTER_SECONDHAND_REFUND_CONTRACT_AUDIT'),
    hasShRentCommit:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_CONTRACT_AUDIT'),
    hasShRentRefund:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_REFUND_CONTRACT_AUDIT'),
  }
  if(contractJur.hasProUp || contractJur.hasProDown || contractJur.hasNhCommit || contractJur.hasNhRefund || contractJur.hasShSellCommit || contractJur.hasShSellRefund || contractJur.hasShRentCommit || contractJur.hasShRentRefund){
    const contractEntr = {
      path:null,
      title:'合同审批',
      number:0,
      className:'badge_contract',
      bgcolor:'#F7C896',
      tabKey:null,
    }
    const stackArr = [];
    //新房项目上线
    if(contractJur.hasProUp){
      if(isNull(tradeData.contractTotalXx.newHouseSx,0) === 0){
        stackArr.push({
          path:'contractReview/newHouseContractReview',
          tabKey:{
            name:'contractReview_nh_project',
            value:'publish',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.newHouseSx,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/newHouseContractReview';
          contractEntr.tabKey = {
            name:'contractReview_nh_project',
            value:'publish',
          }
        }
      }
    }
    //新房项目下架
    if(contractJur.hasProDown){
      if(isNull(tradeData.contractTotalXx.newHouseXj,0) === 0){
        stackArr.push({
          path:'contractReview/newHouseContractReview',
          tabKey:{
            name:'contractReview_nh_project',
            value:'downShelves',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.newHouseXj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/newHouseContractReview';
          contractEntr.tabKey = {
            name:'contractReview_nh_project',
            value:'downShelves',
          }
        }
      }
    }

    //新房成交
    if(contractJur.hasNhCommit){
      if(isNull(tradeData.contractTotalXx.newHouseCj,0) === 0){
        stackArr.push({
          path:'contractReview/newhousetransactionContractReview',
          tabKey:{
            name:'contractReview_nh_trade',
            value:'dealAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.newHouseCj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/newhousetransactionContractReview';
          contractEntr.tabKey = {
            name:'contractReview_nh_trade',
            value:'dealAudit',
          }
        }
      }
    }
    //新房电商退款
    if(contractJur.hasNhRefund){
      if(isNull(tradeData.contractTotalXx.newHouseTg,0) === 0){
        stackArr.push({
          path:'contractReview/newhousetransactionContractReview',
          tabKey:{
            name:'contractReview_nh_trade',
            value:'refundAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.newHouseTg,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/newhousetransactionContractReview';
          contractEntr.tabKey = {
            name:'contractReview_nh_trade',
            value:'refundAudit',
          }
        }
      }
    }

    //二手房出售 成交
    if(contractJur.hasShSellCommit){
      if(isNull(tradeData.contractTotalXx.secHouseSellCj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseSalesAudit',
          tabKey:{
            name:'contractReview_sh_sell',
            value:'dealAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseSellCj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseSalesAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_sell',
            value:'dealAudit',
          }
        }
      }
    }
    //二手房出售 意向金退款
    if(contractJur.hasShSellRefund){
      if(isNull(tradeData.contractTotalXx.secHouseSellYxj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseSalesAudit',
          tabKey:{
            name:'contractReview_sh_sell',
            value:'intentMoneyAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseSellYxj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseSalesAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_sell',
            value:'intentMoneyAudit',
          }
        }
      }
    }
    //二手房出售 意向金退款 （暂屏蔽）
    // if(contractJur.hasShSellRefund){
    //   if(isNull(tradeData.contractTotalXx.secHouseSellSfk,0) === 0){
    //     stackArr.push({
    //       path:'contractReview/secondHandHouseSalesAudit',
    //       tabKey:{
    //         name:'contractReview_sh_sell',
    //         value:'downPaymentAudit',
    //       }
    //     })
    //   }else{
    //     contractEntr.number += isNull(tradeData.contractTotalXx.secHouseSellSfk,0);
    //     if(contractEntr.path === null){
    //       contractEntr.path = 'contractReview/secondHandHouseSalesAudit';
    //       contractEntr.tabKey = {
    //         name:'contractReview_sh_sell',
    //         value:'downPaymentAudit',
    //       }
    //     }
    //   }
    // }

    //二手房出售 佣金退款
    if(contractJur.hasShSellRefund){
      if(isNull(tradeData.contractTotalXx.secHouseSellYj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseSalesAudit',
          tabKey:{
            name:'contractReview_sh_sell',
            value:'commissionAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseSellYj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseSalesAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_sell',
            value:'commissionAudit',
          }
        }
      }
    }


    //二手房出租 成交
    if(contractJur.hasShRentCommit){
      if(isNull(tradeData.contractTotalXx.secHouseRentCj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseRentalAudit',
          tabKey:{
            name:'contractReview_sh_rent',
            value:'dealAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseRentCj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseRentalAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_rent',
            value:'dealAudit',
          }
        }
      }
    }
    //二手房出租 意向金退款
    if(contractJur.hasShRentRefund){
      if(isNull(tradeData.contractTotalXx.secHouseRentYxj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseRentalAudit',
          tabKey:{
            name:'contractReview_sh_rent',
            value:'intentMoneyAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseRentYxj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseRentalAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_rent',
            value:'intentMoneyAudit',
          }
        }
      }
    }
    //二手房出租 佣金退款
    if(contractJur.hasShRentRefund){
      if(isNull(tradeData.contractTotalXx.secHouseRentYj,0) === 0){
        stackArr.push({
          path:'contractReview/secondHandHouseRentalAudit',
          tabKey:{
            name:'contractReview_sh_rent',
            value:'commissionAudit',
          }
        })
      }else{
        contractEntr.number += isNull(tradeData.contractTotalXx.secHouseRentYj,0);
        if(contractEntr.path === null){
          contractEntr.path = 'contractReview/secondHandHouseRentalAudit';
          contractEntr.tabKey = {
            name:'contractReview_sh_rent',
            value:'commissionAudit',
          }
        }
      }
    }

    //均无数值判定
    if(contractEntr.path === null){
      contractEntr.path = stackArr[0].path;
      contractEntr.tabKey = stackArr[0].tabKey;
    }
    entranceData.push(contractEntr)
  }
  //部门管理
  if(judgeJurisdiction('TRADINGCENTER_ORGANIZATION_STRUCTURE_MANAGEMENT')){
    entranceData.push({
      path:'businessManagement/organizeStructureManagement',
      title:'员工管理',
      number:0,
      className:'badge_management',
      bgcolor:'#85C1DA',
    })
  }
  return entranceData;
}
