import { routerRedux } from 'dva/router';
import {requestApi} from '../services/common.js';
import analysisUtil from '../../commons/utils/commonApiResponseAnalysis.js';
import finalCode from '../../commons/utils/commonFinalCode.js';
import lodash from 'lodash';
let count=0;
let interval = null;
let tutorName = "";
const defaultState = {
  promptObj:finalCode.promptObj,
  teamData:[],
  generateTeamData:[],
  searchValue:"",
  expandedKeys:[],
  autoExpandParent: true,
  treeMarkers:[],
}
const guid=()=>{
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
const createTeamTreeData = (tutorName,teams)=>{
  let num = 0;
  teams.forEach((item)=>{
    delete item.teams;
    item.key=guid();
    if(!item.totalNumber){
      item.totalNumber = 0;
    }
    num+=item.totalNumber;
    item.title = item.name+"("+item.totalNumber+")";
    item.isBroker = false;
    if(item.brokers){
      item.brokers.forEach((brokerItem)=>{
        brokerItem.key = guid();
        brokerItem.title = brokerItem.name
        brokerItem.isBroker = true;
      });
      item.children = item.brokers;
    }
    delete item.brokers;
  });
  const teamTreeData = [{"key":"root","title":tutorName+"("+num+")","isBroker":false,"children":teams}];
  return teamTreeData;
}
const generateList = (data,dataList) => {
  if(!dataList){
    dataList=[];
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const {key,title,isBroker} = node;
    dataList.push({ key, title,isBroker,item:node});
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
  return dataList;
};
export default {
  namespace: 'indexPage',
  state: {},
  reducers: {

    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },

    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    setTeamTreeData(state,action){
      action.payload.generateTeamData = generateList(action.payload.teamData);
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
      const userInfo=yield select(({main})=>main.userInfo);
      if(userInfo){
        if(interval!=null){
          clearInterval(interval);
        }
      }else{
        count++;
        if(count>100){
          clearInterval(interval);
        }
        return;
      }
      const userInfoJSON = JSON.parse(userInfo);
      tutorName = userInfoJSON.name;
      //取导师的团队和经纪人。
      yield put({type:'findTutorBroker'});

    },
    *findTutorBroker({payload},{put,call,select}){
      const findTutorBrokerResponse=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/broker/findTutorBroker",
      });
      const brokerInfo = analysisUtil.analysisDataResponse(findTutorBrokerResponse);
      let brokerArray =[];
      if(brokerInfo.isSuccess) {
        const teamTreeData = createTeamTreeData(tutorName,brokerInfo.content);
        yield put({type:'setTeamTreeData',payload:{teamData:teamTreeData}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${brokerInfo.msg}`}});
      }
    }
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/indexPage') {
          dispatch({
            type:"setDefaultState"
          });
          // interval = setInterval(() => {
          //   dispatch({
          //     type:"getInitInfo",
          //   })
          // }, 100);
				}
			});
		},
	},
}
