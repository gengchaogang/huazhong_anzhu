import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';

const defaultState = {
  record:null,
  teamData:[],
  pageInfo: {
    pageNo:0,
    total:0,
    pageSize:5,
    content:[],
  },
  customFilter:{
    keyword:"",
    teamId:"",
  },
  tableLoading:false,
  promptObj:finalCode.promptObj,
}
const createTeamData = (teams)=>{
  return teams.map((item)=>{
    return {"key":item.id+"","title":item.name};
  });
}
export default {
  namespace: 'inactiveAgent',
  state: {},
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
      return{...state,
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
        type:'setDefaultState'
      });
      const _pageNo=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageNo);
      const _pageSize=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageSize);
      yield put({type:'findBrokerUnActive',payload:{pageNo:_pageNo,pageSize:_pageSize}});

      yield put({type:'findTeamBrief'});
    }
    ,
    *findBrokerUnActive({payload},{put,call,select}){
      const findBrokerInfoResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/broker/findBrokerUnActive",
        ...payload,
      });
      const brokerInfo = analysisUtil.analysisGetPageDataResponse(findBrokerInfoResponse);


      if(brokerInfo.isSuccess) {
        yield put({type:'setStatePramas',payload:{pageInfo:brokerInfo,tableLoading:false}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${brokerInfo.msg}`}});
      }
    },
    //得到该导师下的所有团队
    *findTeamBrief({payload},{put,call,select}){
      const findTeamBriefResponseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/broker/findTeamBrief",
      });
      const teamBrief = analysisUtil.analysisDataResponse(findTeamBriefResponseObj);
      if(teamBrief.isSuccess) {
        const teamOptionData = createTeamData(teamBrief.content);
        yield put({type:'setStatePramas',payload:{teamData:teamOptionData}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${teamBrief.msg}`}});
        return;
      }
    },

    *activateBroker({payload},{put,call,select}){
      const activateBrokerResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/broker/activateBroker",
        ...payload,
      });

      const activateBrokerResult = analysisUtil.analysisDataResponse(activateBrokerResponse);
      if(activateBrokerResult.isSuccess) {
        payload.resolve();
        const _pageNo=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageNo);
        const _pageSize=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageSize);
        yield put({type:'findBrokerUnActive',payload:{pageNo:_pageNo,pageSize:_pageSize,...payload}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${activateBrokerResult.msg}`}});
      }
    },
    *sendMessage({payload},{put,call,select}){
      // const activateBrokerResponse=yield call(requestApi,{
      //   apiName:"/miss-anzhu-tutor/tutors/broker/activateBroker",
      //   ...payload,
      // });

      // const activateBrokerResult = analysisUtil.analysisDataResponse(activateBrokerResponse);
      // if(activateBrokerResult.isSuccess) {
      //   payload.resolve();
      //   const _pageNo=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageNo);
      //   const _pageSize=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageSize);
      //   yield put({type:'findBrokerUnActive',payload:{pageNo:_pageNo,pageSize:_pageSize,...payload}});
      // }else {
      //   yield put({type:'showPrompt',payload:{description:`${activateBrokerResult.msg}`}});
      // }
    },

    *deleteUnActivationBroker({payload},{put,call,select}){
      const deleteUnActivationBrokerResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/broker/deleteUnActiveBroker",
        id:payload.id
      });
      const deleteUnActivationBrokerResult = analysisUtil.analysisDataResponse(deleteUnActivationBrokerResponse);
      if(deleteUnActivationBrokerResult.isSuccess) {
        payload.resolve();
        const _pageNo=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageNo);
        const _pageSize=yield select(({inactiveAgent})=>inactiveAgent.pageInfo.pageSize);
        yield put({type:'findBrokerUnActive',payload:{pageNo:_pageNo,pageSize:_pageSize,...payload}});
      }else {
        payload.resolve();
        yield put({type:'showPrompt',payload:{description:`${deleteUnActivationBrokerResult.msg}`}});
      }
    },

  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/agentManagement/inactiveAgent') {
          dispatch({
            type:"getInitInfo",
          })
				}
			});
		},
	},
}
