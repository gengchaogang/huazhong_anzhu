import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';

const createTableData=(tableData,dateContent)=>{
  dateContent.map((item,index)=>{
    tableData.push({
      number:index+1,
      addTime:item.addTime,
      houseCode:item.houseCode,
      houseType:item.houseType,
      id:item.id,
      key:item.id,
      orderNumber:item.orderNumber,
      income:item.income,
      payType:item.payType,
      saleWay:item.saleWay,
      serialNumber:item.serialNumber,
      status:item.status,
      totalAmt:item.totalAmt,
      type:item.type,
    })
  })
  return tableData
}

const defaultState = {
  canMoney:null,
  name:null,
  totalElements:null,
  card:null,
  InitMoney:{},
  activeKey:"all",
  tableLoading:true,
  getMoneyVisible:false,
  currentTime:[],
  tableData:[],
  promptObj:finalCode.promptObj,
  type:"",
  pageInfo: {
    pageNo:0,
    total:0,
    pageSize:10,
    content:[],
  },
  commissionInfo:{
    amount:0,
    notIssue:0,
    totalIssue:0,
  },
  beginTime:"",
  endTime:"",
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
  namespace: 'commissionRecord',
  state: {
    currentPage:0,
  },
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    changeActiveKey(state,action){
      return{...state,...action.payload}
    },
    changeCurrentTime(state,action){
      return{...state,...action.payload}
    },
    saveInitMoney(state,action){
      return{...state,...action.payload}
    },
    changeModal(state,action){
      return{...state,...action.payload}
    },
    saveInitAccountDetails(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
      return{...state, loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})
      }
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },

  effects:{
    *getInitMoney({payload},{call,put,select}){
      const payloadEnpty={};
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/statistics/findTutorTotalCommission",
        ...payloadEnpty
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        const InitMoney={};
        InitMoney.notIssue=reObj.notIssue;
        InitMoney.totalCommission=reObj.totalCommission;
        InitMoney.totalIssue=reObj.totalIssue;
        yield put({type:"saveInitMoney",payload:{InitMoney:InitMoney}})
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *getInitInfo({payload},{put,call,select}){
      const {pageNo,pageSize,type,beginTime,endTime}=yield select(({commissionRecord})=>{
        const pageInfo = commissionRecord.pageInfo;
        return {
          pageNo:pageInfo.pageNo,
          pageSize:pageInfo.pageSize,
          type:commissionRecord.type,
          beginTime:commissionRecord.beginTime,
          endTime:commissionRecord.endTime,
        }
      });
      //默认取导师的经纪人。
      yield put({type:'findTutorCommissionBudget',payload:{pageNo,pageSize,type,beginTime,endTime}});
    },
    *getInitAccountDetails({payload},{put,call,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/closeTutDetails",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        if(!!reObj.card){
          yield put({
            type:"saveInitAccountDetails",
            payload:{
              canMoney:reObj.canMoney,
              name:reObj.name,
              card:reObj.card,
              getMoneyVisible:true,
            }
          })
        }else{
          yield put({
            type:'togglePrompt',
            payload:{
              title:'提示!',
              description:`您还未绑定银行卡,点击确定绑定银行卡!`,
              visible:true,
              todo:"toCardBinding"
            }
          })
        }
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *tutCloseAccount({payload},{put,call}){
      payload.payType="银联代付";
      const responseObj_state=yield call(requestApi,{
        apiName:"/miss-anzhu-account/state",
        payload:{}
      })
      var reObj_state=analysisUtil.analysisDataResponse(responseObj_state);
      if(!!reObj_state&&reObj_state.isSuccess&&reObj_state.hasWithdrawPwd){
        const responseObj=yield call(requestApi,{
          apiName:"/miss-anzhu-account/payment/withdraw",
          ...payload
        });
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess&&reObj.errorCount===null){
          yield put({
            type:'togglePrompt',
            payload:{
              type:'success',
              title:'成功!',
              description:`申请提现成功! 等待运营总后台处理提现申请!`,
              visible:true,
              todo:"closeModalAll"
            }
          })
        }else if(reObj.isSuccess&&reObj.errorCount!==null){
          yield put({
            type:'togglePrompt',
            payload:{
              type:'error',
              title:'失败!',
              description:`密码输入错误,剩余操作次数 :${reObj.errorCount}`,
              visible:true,
              todo:"pwdError"
            }
          })
        }else{
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
            }
          });
        }
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            title:'提示!',
            description:`您还未设置提现密码,请点击密码管理设置提现密码!`,
            visible:true,
            todo:"closeModalAll"
          }
        })
      }




    },
    *findTutorCommissionBudget({payload},{put,call,select}){
      payload.sort={
        id:"DESC"
      };
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/statistics/findTutorCommissionBudget",
        ...payload,
      });
      var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if(reObj.isSuccess) {
        const _tableData=yield select(({commissionRecord})=>commissionRecord.tableData);
        createTableData(_tableData,reObj.content);
        yield put({type:'setStatePramas',payload:{pageInfo:reObj,tableLoading:false,totalElements:reObj.totalElements}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *findTutorTotalCommission({payload},{put,call,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/statistics/findTutorTotalCommission",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({type:'setStatePramas',payload:{commissionInfo:reObj}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *getCommissionRecordData({payload},{call,put,select}){
      const data=yield call(requestApi,{
        apiName:"/miss-anzhu-account/statistics/findTutorCommissionBudget",
        ...payload,
      })
      var reObj = analysisUtil.analysisGetPageDataResponse(data);
      if(reObj.isSuccess) {
        const _tableData=[];
        yield put({
          type:'setStatePramas',
          payload:{
            tableData:createTableData(_tableData,reObj.content),
            totalElements:reObj.totalElements,
            tableLoading:false
          }});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/commissionRecord') {
          //获取初始化信息
          dispatch({
            type:"setDefaultState",
          });
          dispatch({
            type:"getInitInfo",
          });
          dispatch({
            type:"getInitMoney"
          })
          // dispatch({
          //   type:"getInitAccountDetails",
          //   payload:{}
          // })
				}
			});
		},
	},
}
