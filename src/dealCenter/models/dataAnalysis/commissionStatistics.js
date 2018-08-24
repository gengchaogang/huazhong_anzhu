import {
  getCommissionStatisticsFetch,
} from '../../services/dataAnalysis/commissionStatistics';
import {
  isNull,
  getKeysValue,
} from '../../../commons/utils/currencyFunction'
const initMainData=JSON.stringify({
  nhTradeData:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  nhGroupBuyData:{
    isDrow:false,
    series:[],
    mainTitleLegend:'',
  },
  nhGroupBuyCharge:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shSellTradeData:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shSellCheckout:{
    isDrow:false,
    series:[],
    mainTitleLegend:'',
  },
  shSellCharge:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shRentTradeData:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  shRentCheckout:{
    isDrow:false,
    series:[],
    mainTitleLegend:'',
  },
  shRentCharge:{
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
  namespace:'commissionStatistics',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/dataAnalysis/commissionStatistics') {
         dispatch({type:'initComponent'})
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'})
      yield put({type:'getMainData'})
    },
    //获取主体数据
    *getMainData({payload},{call,put}){
      const {data}=yield call(getCommissionStatisticsFetch);
      if(!!data){
        if(data.status==='success' && !!data.data){
          console.log('data',data);
          const defaultObj={
            weekNumber:0,
            monthNumber:0,
            quarterNumber:0,
            halfYearNumber:0,
            yearNumber:0,
          }
          const {
            newHouseCommissionData,
            secHouseSellCommissionData,
            houseRentCommissionData,
          }=data.data;
          const mainData={
            nhTradeData:{
              isDrow:true,
              boundaryGap:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:{
                name:'新房电商销售',
                type:'bar',
                data:getRecordArr(isNull(newHouseCommissionData.newHouseGroupSellData,defaultObj)),
              },
              mainTitleLegend:['新房电商销售'],
            },
            nhGroupBuyData:{
              isDrow:true,
              boundaryGap:true,
              series:[
                {
                  name: '新房电商销售量',
                  type: 'pie',
                  radius : '45%',
                  data:[
                    {value:getKeysValue(newHouseCommissionData,['newHouseGroupSellData','peiNumber1'],0), name:'销售量'},
                    {value:getKeysValue(newHouseCommissionData,['newHouseGroupSellData','peiNumber2'],0), name:'退款量'},
                  ],
                }
              ],
              mainTitleLegend:['销售量','退款量'],
            },
            nhGroupBuyCharge:{
              isDrow:true,
              boundaryGap:true,              
              xData:['本周','本月','季度','半年','全年'],
              yData:{
                name:'电商佣金收益',
                type:'bar',
                data:getRecordArr(isNull(newHouseCommissionData.newHouseServiceFeeData,defaultObj)),
              },
              mainTitleLegend:['电商佣金收益'],
            },
            shSellTradeData:{
              isDrow:true,
              boundaryGap:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'购房定金',
                  type:'bar',
                  data:getRecordArr(isNull(secHouseSellCommissionData.houseSellJyslData.intentData,defaultObj)),
                },
                // {
                //   name:'购房首付款(万)',
                //   type:'bar',
                //   data:getRecordArr(isNull(secHouseSellCommissionData.houseSellJyslData.firstpaymentData,defaultObj)),
                // },
                {
                  name:'购房中介',
                  type:'bar',
                  data:getRecordArr(isNull(secHouseSellCommissionData.houseSellJyslData.transactionData,defaultObj)),
                },
              ],
              // mainTitleLegend:['购房定金(万)','购房首付款(万)','购房中介(万)'],
              mainTitleLegend:['购房定金','购房中介'],
            },
            shSellCheckout:{
              isDrow:true,
              boundaryGap:true,
              series:[
                {
                  name: '二手房退房率',
                  type: 'pie',
                  radius : '45%',
                  data:[
                    {value:getKeysValue(secHouseSellCommissionData,['peiData','peiNumber1'],0), name:'成交量(年)'},
                    {value:getKeysValue(secHouseSellCommissionData,['peiData','peiNumber2'],0), name:'退房量(年)'},
                  ],
                }
              ],
              mainTitleLegend:['成交量(年)','退房量(年)'],
            },
            shSellCharge:{
              isDrow:true,
              boundaryGap:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:{
                name:'租房佣金收益',
                type:'bar',
                data:getRecordArr(isNull(secHouseSellCommissionData.serviceFeeData,defaultObj)),
              },
              mainTitleLegend:['租房佣金收益'],
            },
            shRentTradeData:{
              isDrow:true,
              boundaryGap:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:[
                {
                  name:'租房定金',
                  type:'bar',
                  data:getRecordArr(getKeysValue(houseRentCommissionData,['rentTransactionData','intentData'],defaultObj)),
                },
                {
                  name:'租房中介费',
                  type:'bar',
                  data:getRecordArr(getKeysValue(houseRentCommissionData,['rentTransactionData','commissionData'],defaultObj)),
                }
              ],
              mainTitleLegend:['租房定金','租房中介费'],
            },
            shRentCheckout:{
              isDrow:true,
              boundaryGap:true,
              series:[
                {
                  name: '二手房退房率',
                  type: 'pie',
                  radius : '45%',
                  data:[
                    {value:getKeysValue(houseRentCommissionData,['peiData','peiNumber1'],0), name:'成交量(年)'},
                    {value:getKeysValue(houseRentCommissionData,['peiData','peiNumber2'],0), name:'退房量(年)'},
                  ],
                }
              ],
              mainTitleLegend:['成交量(年)','退房量(年)'],
            },
            shRentCharge:{
              isDrow:true,
              boundaryGap:true,
              xData:['本周','本月','季度','半年','全年'],
              yData:{
                name:'租房佣金收益',
                type:'bar',
                data:getRecordArr(isNull(houseRentCommissionData.serviceFeeData,defaultObj)),
              },
              mainTitleLegend:['租房佣金收益'],
            },
          }
          console.log('mainData',mainData);
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
function getRecordArr(obj){
  return [
    isNull(obj.weekNumber,0),
    isNull(obj.monthNumber,0),
    isNull(obj.quarterNumber,0),
    isNull(obj.halfYearNumber,0),
    isNull(obj.yearNumber,0),
  ]
}
