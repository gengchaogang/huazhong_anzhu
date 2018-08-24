import {getTransactionStatisticsFetch} from '../../services/dataAnalysis/tradeStatistics';
import {
  isNull,
  getKeysValue,
} from '../../../commons/utils/currencyFunction'
const initMainData=JSON.stringify({
  projectAdd:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  newHouseTrade:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  visitRecord:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shSellRecord:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shRentRecord:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
})
const initState={
  mainData:initMainData,
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
}
export default {
  namespace:'tradeStatistics',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/dataAnalysis/tradeStatistics') {
         dispatch({type:'initComponent'})
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({
        type:'doInitState'
      })
      yield put({
        type: 'getTransactionStatisticsData',
      });
    },
    *getTransactionStatisticsData({ payload }, { call, put }){
      const  {data}  = yield call(getTransactionStatisticsFetch);
      if(!!data){
        if(data.status==='success'){
          const {
            houseTransactionData,
            houseSellData,
            houseRentData,
          }=data.data;
          const mainData={
            projectAdd:{
              isDrow:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:{
                name:'项目数量',
                type:'bar',
                data:[
                  getKeysValue(houseTransactionData,['addProjectData','weekNumber'],0),
                  getKeysValue(houseTransactionData,['addProjectData','monthNumber'],0),
                  getKeysValue(houseTransactionData,['addProjectData','quarterNumber'],0),
                  getKeysValue(houseTransactionData,['addProjectData','halfYearNumber'],0),
                  getKeysValue(houseTransactionData,['addProjectData','yearNumber'],0),
                ],
              },
              boundaryGap:true,
              mainTitleLegend:['项目数量'],
            },
            newHouseTrade:{
              isDrow:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'客户约看',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseDealData','reportModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','reportModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','reportModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','reportModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','reportModel','yearNumber'],0),
                  ],
                },
                {
                  name:'客户确看',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseDealData','viewModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','viewModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','viewModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','viewModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','viewModel','yearNumber'],0),
                  ],
                },
                {
                  name:'电商优惠',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseDealData','groupbuyModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','groupbuyModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','groupbuyModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','groupbuyModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','groupbuyModel','yearNumber'],0),
                  ],
                },
                {
                  name:'新房成交',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseDealData','transactionModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','transactionModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','transactionModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','transactionModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseDealData','transactionModel','yearNumber'],0),
                  ],
                },
              ],
              boundaryGap:true,
              mainTitleLegend:['客户约看','客户确看','电商优惠','新房成交'],
            },
            visitRecord:{
              isDrow:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'客户自行确看',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseView','customerViewModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','customerViewModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','customerViewModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','customerViewModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','customerViewModel','yearNumber'],0),
                  ],
                },
                {
                  name:'经纪人带看',
                  type:'bar',
                  data:[
                    getKeysValue(houseTransactionData,['newHouseView','brokerViewModel','weekNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','brokerViewModel','monthNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','brokerViewModel','quarterNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','brokerViewModel','halfYearNumber'],0),
                    getKeysValue(houseTransactionData,['newHouseView','brokerViewModel','yearNumber'],0),
                  ],
                },
              ],
              boundaryGap:true,
              mainTitleLegend:['客户自行确看','经纪人带看'],
            },
            shSellRecord:{
              isDrow:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'报成交',
                  type:'bar',
                  data:[
                    getKeysValue(houseSellData,['reportData','weekNumber'],0),
                    getKeysValue(houseSellData,['reportData','monthNumber'],0),
                    getKeysValue(houseSellData,['reportData','quarterNumber'],0),
                    getKeysValue(houseSellData,['reportData','halfYearNumber'],0),
                    getKeysValue(houseSellData,['reportData','yearNumber'],0),
                  ],
                },
                {
                  name:'确认意向',
                  type:'bar',
                  data:[
                    getKeysValue(houseSellData,['intentData','weekNumber'],0),
                    getKeysValue(houseSellData,['intentData','monthNumber'],0),
                    getKeysValue(houseSellData,['intentData','quarterNumber'],0),
                    getKeysValue(houseSellData,['intentData','halfYearNumber'],0),
                    getKeysValue(houseSellData,['intentData','yearNumber'],0),
                  ],
                },
                // {
                //   name:'已交首付',
                //   type:'bar',
                //   data:[
                //     getKeysValue(houseSellData,['firstpaymentData','weekNumber'],0),
                //     getKeysValue(houseSellData,['firstpaymentData','monthNumber'],0),
                //     getKeysValue(houseSellData,['firstpaymentData','quarterNumber'],0),
                //     getKeysValue(houseSellData,['firstpaymentData','halfYearNumber'],0),
                //     getKeysValue(houseSellData,['firstpaymentData','yearNumber'],0),
                //   ],
                // },
                {
                  name:'申请贷款',
                  type:'bar',
                  data:[
                    getKeysValue(houseSellData,['loanData','weekNumber'],0),
                    getKeysValue(houseSellData,['loanData','monthNumber'],0),
                    getKeysValue(houseSellData,['loanData','quarterNumber'],0),
                    getKeysValue(houseSellData,['loanData','halfYearNumber'],0),
                    getKeysValue(houseSellData,['loanData','yearNumber'],0),
                  ],
                },
                {
                  name:'已分佣',
                  type:'bar',
                  data:[
                    getKeysValue(houseSellData,['transactionData','weekNumber'],0),
                    getKeysValue(houseSellData,['transactionData','monthNumber'],0),
                    getKeysValue(houseSellData,['transactionData','quarterNumber'],0),
                    getKeysValue(houseSellData,['transactionData','halfYearNumber'],0),
                    getKeysValue(houseSellData,['transactionData','yearNumber'],0),
                  ],
                },
                // {
                //   name:'已分佣',
                //   type:'bar',
                //   data:[
                //     getKeysValue(houseSellData,['commissionData','weekNumber'],0),
                //     getKeysValue(houseSellData,['commissionData','monthNumber'],0),
                //     getKeysValue(houseSellData,['commissionData','quarterNumber'],0),
                //     getKeysValue(houseSellData,['commissionData','halfYearNumber'],0),
                //     getKeysValue(houseSellData,['commissionData','yearNumber'],0),
                //   ],
                // }
              ],
              boundaryGap:true,
              // mainTitleLegend:['报成交','确认意向','已交首付','申请贷款','已成交','已分佣'],
              mainTitleLegend:['报成交','确认意向','申请贷款','已分佣'],
            },
            shRentRecord:{
              isDrow:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'报成交',
                  type:'bar',
                  data:[
                    getKeysValue(houseRentData,['reportData','weekNumber'],0),
                    getKeysValue(houseRentData,['reportData','monthNumber'],0),
                    getKeysValue(houseRentData,['reportData','quarterNumber'],0),
                    getKeysValue(houseRentData,['reportData','halfYearNumber'],0),
                    getKeysValue(houseRentData,['reportData','yearNumber'],0),
                  ],
                },
                {
                  name:'确认意向',
                  type:'bar',
                  data:[
                    getKeysValue(houseRentData,['intentData','weekNumber'],0),
                    getKeysValue(houseRentData,['intentData','monthNumber'],0),
                    getKeysValue(houseRentData,['intentData','quarterNumber'],0),
                    getKeysValue(houseRentData,['intentData','halfYearNumber'],0),
                    getKeysValue(houseRentData,['intentData','yearNumber'],0),
                  ],
                },
                {
                  name:'已分佣',
                  type:'bar',
                  data:[
                    getKeysValue(houseRentData,['transactionData','weekNumber'],0),
                    getKeysValue(houseRentData,['transactionData','monthNumber'],0),
                    getKeysValue(houseRentData,['transactionData','quarterNumber'],0),
                    getKeysValue(houseRentData,['transactionData','halfYearNumber'],0),
                    getKeysValue(houseRentData,['transactionData','yearNumber'],0),
                  ],
                },
                // {
                //   name:'已分佣',
                //   type:'bar',
                //   data:[
                //     getKeysValue(houseRentData,['commissionData','weekNumber'],0),
                //     getKeysValue(houseRentData,['commissionData','monthNumber'],0),
                //     getKeysValue(houseRentData,['commissionData','quarterNumber'],0),
                //     getKeysValue(houseRentData,['commissionData','halfYearNumber'],0),
                //     getKeysValue(houseRentData,['commissionData','yearNumber'],0),
                //   ],
                // },
              ],
              boundaryGap:true,
              // mainTitleLegend:['报成交','确认意向','已成交','已分佣'],
              mainTitleLegend:['报成交','确认意向','已分佣'],
            },
          }
          yield put({
            type:'initMainData',
            payload:JSON.stringify(mainData),
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
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({tradeStatistics})=>tradeStatistics.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
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
    initMainData(state,action){
      return {...state,mainData:action.payload}
    },
  },
}
