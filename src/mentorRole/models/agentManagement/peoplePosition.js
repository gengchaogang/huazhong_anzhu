import { routerRedux } from 'dva/router';
import {requestApi} from '../../services/common.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import defaultImg from '../../assets/images/morentouinfg.png'
import lodash from 'lodash';
const AMap=window.AMap;
let count=0;
let interval = null;
let tutorName = "";
const defaultState = {
  Amap:null,
  infoWindow:new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
  promptObj:finalCode.promptObj,
  teamData:[],
  generateTeamData:[],
  searchValue:"",
  expandedKeys:[],
  autoExpandParent: true,
  treeMarkers:[],
  initMarkers:[],
  transactionCount:null,
  houseCount:null,
  customerCount:null,
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
        let address=brokerItem.address===null?"":brokerItem.address;        
        brokerItem.title = brokerItem.name+"["+address+"]"; //拼经纪人地址信息
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
  namespace: 'peoplePosition',
  state: {},
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    saveInitMarkers(state,action){
      return{...state,...action.payload}
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    changeInitMarkers(state,action){
      return{...state,...action.payload}
    },
    saveCurrentBrokerInfos(state,action){
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
    saveMap(state,action){
      return{...state,...action.payload}
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
      const resultData=findTutorBrokerResponse.data.data;
      const brokerInfo = analysisUtil.analysisDataResponse(findTutorBrokerResponse);
      let brokerArray =[];
      const treeMarkers=[];
      if(brokerInfo.isSuccess){
        if(resultData.length!==0){
          resultData.map((item,index)=>{
            if(!!item.brokers){
              if(item.brokers.length!==0){
                item.brokers.map((i,j)=>{
                  if(i.latitude!=null&&i.longitude!=null&&i.latitude!=undefined&&i.longitude!=undefined&&i.latitude!=''&&i.longitude!=''){
                    treeMarkers.push({
                      position:[i.longitude,i.latitude],
                      logo:i.logo,
                      id:i.id,
                      name:i.name,
                      phoneNumber:i.phoneNumber,
                      teamName:i.teamName,
                      latitude:i.latitude,
                      longitude:i.longitude,
                    })
                  }
                })
              }
            }
          })
        }
        yield put({type:"saveInitMarkers",payload:{treeMarkers:treeMarkers}})
        const teamTreeData = createTeamTreeData(tutorName,brokerInfo.content);
        yield put({type:'setTeamTreeData',payload:{teamData:teamTreeData}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${brokerInfo.msg}`}});
      }
    },
    *getBrokerInfos({payload},{call,put,select}){
      const response=yield call(requestApi,{
        apiName:"/miss-anzhu-broker/brokers/getStatisticInfoForTutor",
        id:payload.id,
      });
      const infoWindow=yield select(({peoplePosition})=>peoplePosition.infoWindow);
      const brokerInfo = analysisUtil.analysisDataResponse(response);
      const treeMarkers=[];
      if(brokerInfo.isSuccess){
        if(payload.pointClick){
          infoWindow.setContent(
            !!payload.logo?
            `
            <div>
              <div>
                <img src=${payload.logo} width="50px" height="50px"/>
                ${payload.name} ${payload.teamName} ${payload.phoneNumber}
              </div>
              <hr/>
              <div>
                房源 ${brokerInfo.houseCount}
                客源 ${brokerInfo.customerCount}
                出售 ${brokerInfo.transactionCount}
              </div>
            </div>
            `:
            `
            <div>
              <div>
                <img src=${defaultImg} width="50px" height="50px"/>
                ${payload.name} ${payload.teamName} ${payload.phoneNumber}
              </div>
              <hr/>
              <div>
                房源 ${brokerInfo.houseCount}
                客源 ${brokerInfo.customerCount}
                出售 ${brokerInfo.transactionCount}
              </div>
            </div>
          `
          )
        }else{
          infoWindow.setContent(
            !!payload.item.props.logo?
            `
            <div>
              <div>
                <img src=${payload.item.props.logo} width="50px" height="50px"/>
                ${payload.item.props.name} ${payload.item.props.teamName} ${payload.item.props.phoneNumber}
              </div>
              <hr/>
              <div>
                房源 ${brokerInfo.houseCount}
                客源 ${brokerInfo.customerCount}
                出售 ${brokerInfo.transactionCount}
              </div>
            </div>
            `:
            `
            <div>
              <div>
                <img src=${defaultImg} width="50px" height="50px"/>
                ${payload.item.props.name} ${payload.item.props.teamName} ${payload.item.props.phoneNumber}
              </div>
              <hr/>
              <div>
                房源 ${brokerInfo.houseCount}
                客源 ${brokerInfo.customerCount}
                出售 ${brokerInfo.transactionCount}
              </div>
            </div>
          `
          )
          // treeMarkers.push({
          //   position:[payload.item.props.longitude,payload.item.props.latitude],
          //   logo:payload.item.props.logo,
          //   transactionCount:brokerInfo.transactionCount,
          //   houseCount:brokerInfo.houseCount,
          //   customerCount:brokerInfo.customerCount,
          //   name:payload.item.props.name,
          //   phoneNumber:payload.item.props.phoneNumber,
          //   teamName:payload.item.props.teamName,
          // })
        }
        yield put ({
          type:"saveCurrentBrokerInfos",
          payload:{
            transactionCount:brokerInfo.transactionCount,
            houseCount:brokerInfo.houseCount,
            customerCount:brokerInfo.customerCount,
            infoWindow:infoWindow,
            treeMarkers:treeMarkers,
          }})
      }else{
        yield put({type:'showPrompt',payload:{description:`${brokerInfo.msg}`}});
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/agentManagement/peoplePosition') {
          dispatch({
            type:"setDefaultState"
          });
          interval = setInterval(() => {
            dispatch({
              type:"getInitInfo",
            })
          }, 100);
				}
			});
		},
	},
}
