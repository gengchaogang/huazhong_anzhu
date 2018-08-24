import {requestApi} from '../../services/common.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import lodash from 'lodash';

import { routerRedux } from 'dva/router';
import {message} from 'antd'
let interval = null;
let count=0;
let tutorName = "";
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
const agentList=[];

const showAgentList=()=>{
    return agentList
}
const generateList = (data,dataList) => {
  if(!dataList){
    dataList=[];
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const {key,title,isBroker} = node;
    dataList.push({ key, title,isBroker,item:node});
    if(isBroker){
      agentList.push({item:node})
    }
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
  return dataList;
};

// pathIdMap:new Map(),
// const pathIdMap=new Map();
// [
//   {
//     []
//   }
// ]
// pathIdMap.set(id,path);
// {
//   '2'=>{title:'2',id:3}
// }
const initState={
  userInfoJSON:null,
  defaultKeys:[],
  pathIdMap:new Map(),
  houseResourceId:null,
  tableData:[],
  agentListTableData:[],
  agentList:[],
  teamData:[],
  generateTeamData:[],
  searchValue:"",
  expandedKeys:[],
  autoExpandParent: true,
  treeMarkers:[],

  selectedRowKeys: [],
  visible:false,
  loadingShadow:false,
  houseBaseInfo:{},
  slectedBrokers:[],
  visible:false,
  loadingShadow:false,
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
  namespace: 'directAssignAgent',
  state:initState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    saveResultData(state,action){
			return{...state,tableLoading:false,loadingShadow: false,...action.payload}
		},
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    changeSelectedRowKeys(state,action){
      return{...state,...action.payload}
    },
    changeModal(state,action){
      return{...state,...action.payload}
    },
    showProcess(state,action) {
      return {...state,loadingShadow: true};
    },
    hideProcess(state,action) {
      return {...state,loadingShadow: false};
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    setTeamTreeData(state,action){
      action.payload.generateTeamData = generateList(action.payload.teamData);
      return{...state,...action.payload}
    },
    saveAgentList(state,action){
      action.payload.agentList = agentList
      return{...state,...action.payload}
    },
    saveAgentTableData(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
      return{...state,loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})}
    },
    clearCxInfo(state,action){
      return {...state,jeCheckBoxChecked: false,commissionAmount:0.0,blCheckBoxChecked:false};
    },
    saveId(state,action){
      return{...state,...action.payload}
    },
    saveTableData(state,action){
      return{...state,...action.payload}
    },
    saveAgentListTableData(state,action){
      return{...state,...action.payload}
    },
    changePathIdMap(state,action){
      return{...state,...action.payload}
    },
    saveCurrentUserType(state,action){
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
      if(userInfoJSON.userType==='BROKER_USER'){
        yield put({type:"saveCurrentUserType",payload:{userInfoJSON:userInfoJSON}})
        return
      }else{
        yield put({type:"saveCurrentUserType",payload:{userInfoJSON:userInfoJSON}})
        yield put({type:'findTutorBroker'});
      }
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
        yield put({type:'saveAgentList',payload:{teamData:teamTreeData}});
        const agentListTableData=[];
        brokerInfo.content.map(item=>{
          if(!!item.children){
            if(item.children.length&&item.isBroker===false){
              const brokers=item.children;
              brokers.map(i=>{
                agentListTableData.push({
                  areaPath:i.areaPath,
                  id:i.id,
                  isBroker:i.isBroker,
                  isEmployee:i.isEmployee,
                  key:i.key,
                  logo:i.logo,
                  name:i.name,
                  phoneNumber:i.phoneNumber,
                  title:i.title,
                  teamName:i.teamName,
                })
              })
            }
          }
        })
        yield put({
          type:"saveAgentListTableData",
          payload:{
            agentListTableData:agentListTableData
          }
        })
      }else {
        yield put({type:'showPrompt',payload:{description:`${brokerInfo.msg}`}});
      }
    },
    *addBroker({payload},{call,put}){
      const {data}=yield call(requestApi,{
        apiName:"/miss-anzhu-secdhouse-resource/broker/addImproveInformationBroker",
        ...payload
      })
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'指派经纪人成功!',
          visible:true,
          todo:"closeModalAndSendFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *addSelectBroker({payload},{call,put,select}){
        if(payload['slectedBrokers']){
            // 已有的数据
            const {slectedBrokers} = yield select(({assignAgent})=>assignAgent);
            const _tempSelectobj = {};
            if (slectedBrokers != null && slectedBrokers.length > 0) {
                slectedBrokers.map((item, index)=>{
                    _tempSelectobj[item['id']] = item['id'];
                });
            }
            // 当前选择的数据
            const _tempSlectedBrokers = payload['slectedBrokers'];
            if (_tempSlectedBrokers != null && _tempSlectedBrokers.length > 0) {
                _tempSlectedBrokers.map((item, index)=>{
                    if (!_tempSelectobj[item['id']]) {
                        slectedBrokers.push(item);
                    }
                });
            }
            yield put({
              type:"setState",
              payload:{
                slectedBrokers:slectedBrokers,
              }
            })
        }
    },
    *getInitAgentData({payload},{call,put,select}){
      payload.apiName='/miss-anzhu-secdhouse-resource/broker/findMyBrokbers'
      const {data}=yield call(requestApi,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data.listBrokers;
        const tableData=[];
        const defaultKeys=[];
        resultData.map((item,index)=>{
          if(!!item.cooperationPromotion){
              tableData.push({
                number:index+1,
                key:item.name,
                cityIds:item.cityIds,
                cityNames:item.cityNames,
                gender:item.gender,
                id:item.id,
                logo:item.logo,
                name:item.name,
                phone:item.phone,
                description:item.coreSellingPoint===""?data.data.coreSellingPoint:item.coreSellingPoint,
                cooperation:item.cooperationPromotion,
                promotionMode:item.promotionMode,
                totlePrice:item.totlePrice,
                cooperationPromotion:item.promotionMode==="金额"?item.commissionAmount:item.commissionRate,
              })
          }else{
            tableData.push({
              number:index+1,
              key:item.name,
              cityIds:item.cityIds,
              cityNames:item.cityNames,
              gender:item.gender,
              id:item.id,
              logo:item.logo,
              name:item.name,
              phone:item.phone,
              description:data.data.coreSellingPoint,
              cooperation:data.data.cooperationPromotion,
              promotionMode:data.data.promotionMode,
              totlePrice:data.data.totlePrice,
              cooperationPromotion:data.data.promotionMode==="金额"?data.data.commissionAmount:data.data.commissionRate,
              commissionRateName:data.data.commissionRateName,
            })
          }
          defaultKeys.push(item.name)
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:tableData,
            defaultKeys:defaultKeys,
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *deleteAgent({payload},{call,put}){
      payload.apiName='/miss-anzhu-secdhouse-resource/broker/deleteImproveInformation'
      const {data}=yield call(requestApi,{...payload})
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'取消成功!',
          visible:true,
          todo:"closeModalAndSendFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *deleteAll({payload},{call,put}){
      payload.apiName='/miss-anzhu-secdhouse-resource/broker/deleteAllImproveInformation'
      const {data}=yield call(requestApi,{...payload})
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'取消全部经纪人成功!',
          visible:true,
          todo:"closeModalAndSendFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *currentSelect({payload},{call,put}){
      let selectedRowKeys=[]
      if(payload.agentListTableData.length){
        payload.tableData.map(item=>{
          payload.agentListTableData.map(i=>{
            if(item.id===i.id){
              selectedRowKeys.push(i.key)
            }
          })
        })
      }
      yield put({
        type:"assignAgentModal/changeSelectedRowKeys",
        payload:{
          selectedRowKeys,
        }
      })
      yield put({
        type:"changeModal",
        payload:{
          visible:true
        }
      })
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/directAssignAgent'||location.pathname === '/houseResourceRentManagement/directAssignAgent') {
             dispatch({
               type:"setDefaultState"
             })
             dispatch({
               type:"getInitAgentData",
               payload:{
                 id:location.state.id
               }
             })
             dispatch({ //保存id
               type:"saveId",
               payload:{
                 houseResourceId:location.state.id
               }
             })
             interval = setInterval(() => {
               dispatch({
                 type:"getInitInfo",
               })
             }, 100);

           }
         });
       },
  }
}
