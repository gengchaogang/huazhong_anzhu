import {
  getInitDataFetch
} from '../../services/dataStatistics/businessStatistics'
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
  tableData:[],
  teams:[],
  startDate:'',
  endDate:'',
  tutorTeamId:'',
  tableLoading:true,
  teams:[],
  newHouseView:{},
  newHouseViewBroker:[],
  nhReport:{},
  nhReportBroker:[],
  nhTransaction:{},
  nhTransactionBroker:[],
  secdAppointment:{},
  secdAppointmentBroker:[],
  secdHouseView:{},
  secdHouseViewBroker:[],
  secdTransaction:{},
  secdTransactionBroker:[],
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
  namespace: 'businessStatistics',
  state:initState,
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    saveCardData(state,action){
      return{...state,...action.payload}
    },
    changeTableData(state,action){
      return{...state,...action.payload}
    },
    changeFormData(state,action){
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
        const teams=data.data.teams;

        const newHouseView=data.data.newHouseView;
        const newHouseViewBroker=newHouseView.brokers;

        const nhReport=data.data.nhReport;
        const nhReportBroker=nhReport.brokers;

        const nhTransaction=data.data.nhTransaction;
        const nhTransactionBroker=nhTransaction.brokers;

        const secdAppointment=data.data.secdAppointment;
        const secdAppointmentBroker=secdAppointment.brokers;

        const secdHouseView=data.data.secdHouseView;
        const secdHouseViewBroker=secdHouseView.brokers;

        const secdTransaction=data.data.secdTransaction;
        const secdTransactionBroker=secdTransaction.brokers;
        yield put({
          type:"saveCardData",
          payload:{
            teams:teams,
            tableData:nhReportBroker,
            newHouseView:newHouseView,
            newHouseViewBroker:newHouseViewBroker,
            nhReport:nhReport,
            nhReportBroker:nhReportBroker,
            nhTransaction:nhTransaction,
            nhTransactionBroker:nhTransactionBroker,
            secdAppointment:secdAppointment,
            secdAppointmentBroker:secdAppointmentBroker,
            secdHouseView:secdHouseView,
            secdHouseViewBroker:secdHouseViewBroker,
            secdTransaction:secdTransaction,
            secdTransactionBroker:secdTransactionBroker,
            tableLoading:false,
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
				if (location.pathname === '/dataStatistics/basicStatistics/businessStatistics') {
          dispatch({
            type:"setDefaultState"
          })
          dispatch({
            type:"getInitData",
            payload:{
              startDate:"",
              endDate:""
            }
          })
				}
			});
		},
	},
}
