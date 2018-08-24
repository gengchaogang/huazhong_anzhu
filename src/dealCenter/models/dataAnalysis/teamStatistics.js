import {
  getGroupStatisticsFetch,
} from '../../services/dataAnalysis/teamStatistics';
import {
  isNull,
  getKeysValue,
} from '../../../commons/utils/currencyFunction'
const initMainData=JSON.stringify({
  newVisit:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  newGroupBuy:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  shSellAccept:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  shSellLoan:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  shSellTransfer:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  shRentAccept:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  },
  shRentLoan:{
    xData: [],
    mainTitleLegend:[],
    yData: [],
    boundaryGap:true,
    isDrow:false,
  }
});
const initState={
  mainData:initMainData,
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
}
export default {
  namespace:'teamStatistics',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/dataAnalysis/teamStatistics') {
         dispatch({type:'initComponent'})
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'});
      yield put({
        type:'getMainData'
      })
    },
    //获取主体数据
    *getMainData({payload},{call,put}){
      const {data}=yield call(getGroupStatisticsFetch);
      if(!!data){
        if(data.status==='success'){
          console.log('data',data);
          const {
            newProjectGroupData,
            secHouseSellGroupData,
            houseRentGroupData,
          }=data.data;
          const mainData={
            newVisit:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(newProjectGroupData.groupViewData),
            },
            newGroupBuy:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(newProjectGroupData.groupBuyData),
            },
            shSellAccept:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(secHouseSellGroupData.dealData),
            },
            shSellLoan:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(secHouseSellGroupData.loanData),
            },
            shSellTransfer:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(secHouseSellGroupData.transferData),
            },
            shRentAccept:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(houseRentGroupData.dealData),
            },
            shRentLoan:{
              xData: ['本周','本月','季度','半年','全年'],
              boundaryGap:true,
              isDrow:true,
              ...creatData(houseRentGroupData.loanData),
            }
          };
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

function creatData(obj){
  let resultObj={
    mainTitleLegend:[],
    yData:[],
  }
  let dataMap=new Map();
  for(let key in obj){
    if(obj[key].length!==0){
      obj[key].map(item=>{
        if(dataMap.has(item.optUserName)){
          dataMap.get(item.optUserName)[key]=item.total;
        }else{
          let newObj={};
          newObj[key]=item.total;
          dataMap.set(item.optUserName,newObj);
        }
      })
    }
  }
  [...dataMap.keys()].map(itemKey=>{
    let traObj=dataMap.get(itemKey);
    resultObj.yData.push({
      name:isNull(itemKey,''),
      type:'bar',
      data:[
        isNull(traObj.weekData,0),
        isNull(traObj.monthData,0),
        isNull(traObj.quarterData,0),
        isNull(traObj.halfYearData,0),
        isNull(traObj.yearData,0),
      ]
    })
  })
  return resultObj;
}
