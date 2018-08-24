import {
  getInitDataFetch
} from '../../services/dataStatistics/dealStatistics'
import { routerRedux } from 'dva/router';
import lodash from 'lodash';
const getNowFormatDate=(date)=>{
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
   return year + seperator1 + month + seperator1 + strDate
}
const  myDate1=new Date();
myDate1.setDate(myDate1.getDate()-31);
const initState={
  defaultStartDate:getNowFormatDate(myDate1),
  defaultEndDate:getNowFormatDate(new Date()),
  dealStatisticsData:{},
  tableData:[],
  teams:[],
  startDate:'',
  endDate:'',
  houseType:'',
  tradeType:'',
  tutorTeamId:'',
  tableLoading:true,
  promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
  },
}
export default {
  namespace: 'dealStatistics',
  state:initState,
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    saveResultData(state,action){
      return{...state,...action.payload}
    },
    saveFormData(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *getInitData({payload},{call,put}){
      const  myDate=new Date();
      myDate.setDate(myDate.getDate()-31);
      if(payload.startDate===""&&payload.endDate===""){
        payload.startDate=getNowFormatDate(myDate);
        payload.endDate=getNowFormatDate(new Date());
      }
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const dealStatisticsData=data.data;
        const resultTableData=data.data.brokers;
        const tableData=[];
        const teams=data.data.teams;
        resultTableData.content.map((item)=>{
          tableData.push({
            brokerLogo:item.brokerLogo,
            brokerName:item.brokerName,
            brokerPhone:item.brokerPhone,
            houseSource:item.houseSource,
            houseType:item.houseType,
            sourceType:item.sourceType,
            tradeCommission:`${item.tradeCommission}元`,
            tradeSum:`${item.tradeSum}元`,
            tradeTime:item.tradeTime,
          })
        })
        yield put({
          type:"saveResultData",
          payload:{
            dealStatisticsData:dealStatisticsData,
            tableData:tableData,
            tableLoading:false,
            teams:teams,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取初始数据失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/dataStatistics/basicStatistics/dealStatistics') {
          dispatch({
            type:"setDefaultState"
          })
          dispatch({
            type:"getInitData",
            payload:{
              startDate:'',
              endDate:'',
              pageSize:100000000,
              pageNo:0,
            }
          })
				}
			});
		},
	},
}
