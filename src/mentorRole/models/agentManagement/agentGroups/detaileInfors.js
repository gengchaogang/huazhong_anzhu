import finalCode from '../../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../../services/common.js';
import lodash from 'lodash';

const defaultState = {
  brokerId:null,
	logo:"",
	name:"",
	phone:"",
	addTeamTime:"",//加入团队时间
	conversantArea:"",//熟悉区域
	age:"",
	workTime:"",//从业年限
  speciality:"",
	guideCountForOneWeek:"",//近7天带看
	commitCountForOneMonth:"",//近30天成交
  guideFollowForOneWeek:'',
  addHouseTotal:0,//累计拓房
	addCustomerTotal:0,//累计拓客
	addCustomerTotal:0,//累计预约
	reportTotal:0,//累计报备
	guideTotal:0,//累计带看
	commitTotal:0,//总成交
	newHouseCommitTotal:0,//新房成交
	secondHouseCommitTotal:0,//二手房成交
	rentOutTotal:0,//出租成交
	commitMoneyTotal:0,//累计成交金额
	brokerageTotal:0,//累计佣金
	tutorEarnings:0,//导师收益
  tableData:[],
  loadingShadow:true,
  promptObj:finalCode.promptObj,
}
export default {
  namespace: 'detaileInfors',
  state: {

  },
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    saveTableData(state,action){
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
    *getInitInfo({payload},{put,call,select}){
      yield put({
        type:'setDefaultState',
      });
      const brokerId = payload.brokerId;

      const findBrokerDetailResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-broker/brokers/findBrokerDetail",
        id:brokerId,
      });

      const findBrokerDetailResult = analysisUtil.analysisDataResponse(findBrokerDetailResponse);
      if(findBrokerDetailResult.isSuccess) {
        yield put({type:'setStatePramas',payload:{loadingShadow:false,brokerId:brokerId,...findBrokerDetailResult}});
        yield put({type:'findBrokerPerformance',payload:{id:brokerId,sreachType:"WEEK"}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${findBrokerDetailResult.msg}`}});
      }

    },

    *findBrokerPerformance({payload},{put,call,select}){
      yield put({type:'setStatePramas',payload:{loadingShadow:true}});
      const findBrokerPerformanceResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-broker/brokers/findBrokerPerformance",
        ...payload,
      });
      const findBrokerPerformanceResult = analysisUtil.analysisDataResponse(findBrokerPerformanceResponse);
      const resultData={};
      const tableData=[];

      if(findBrokerPerformanceResult.isSuccess) {
        resultData.key=findBrokerPerformanceResult.addHouseTotal;
        resultData.tf=`${findBrokerPerformanceResult.addHouseTotal}套`;  //累计拓房
        resultData.tk=`${findBrokerPerformanceResult.addCustomerTotal}人`; //累计拓客
        resultData.yy=`${findBrokerPerformanceResult.appointmentTotal}次`; //累计预约
        resultData.bb=`${findBrokerPerformanceResult.reportTotal}次`;  //累计报备
        resultData.cj=`${findBrokerPerformanceResult.commitTotal}套（新房${findBrokerPerformanceResult.newHouseCommitTotal}套、二手房${findBrokerPerformanceResult.secondHouseCommitTotal}套、出租${findBrokerPerformanceResult.rentOutTotal}套）`;  //累计成交
        resultData.dk=`${findBrokerPerformanceResult.guideTotal}次`; //累计带看
        resultData.je=`${findBrokerPerformanceResult.commitMoneyTotal}元`; //成交金额
        resultData.yj=`${findBrokerPerformanceResult.brokerageTotal}元`; //累计佣金
        resultData.sy=`${findBrokerPerformanceResult.tutorEarnings}元`;  //导师收益
        tableData.push(resultData);
        yield put({type:"saveTableData",payload:{tableData:tableData}})
        yield put({type:'setStatePramas',payload:{loadingShadow:false,...findBrokerPerformanceResult}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${findBrokerPerformanceResult.msg}`}});
      }
    }
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/agentManagement/detaileInfors') {
          const brokerId = location.state.brokerId;
          //获取初始化信息
          dispatch({
            type:"getInitInfo",
            payload:{
  						brokerId:brokerId,
  					}
          })
				}
			});
		},
	},
}
