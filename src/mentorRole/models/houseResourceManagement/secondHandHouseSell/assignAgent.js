import { routerRedux } from 'dva/router';
import {message} from 'antd'
import {requestApi}
from '../../../services/common'
let interval = null;
let count=0;
let tutorName = "";
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import finalCode from '../../../../commons/utils/commonFinalCode.js';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';

/***************************************************************/
/**************************************************************/
/**********  二手房出售：指派经纪人 *****************************/
/*************************************************************/
/*************************************************************/
// 加载标签信息
const typeGroups = [
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelHzsx,    // 房源户型
  },
];

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
const initState={
  defaultRadioValue:"佣金金额",
  userInfoJSON:null,
  currentRadio:'佣金金额',
  labels:{},
  agentListTableData:[],
  agentList:[],
  promptObj:finalCode.promptObj,
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
  assignAgentObj:{},              // 合作促销信息
  openPromotionCheked:false,  // 合作促销 是否已选择
  jeCheckBoxChecked:true,    // 金额 是否选择
  commissionAmount:null,       // 金额
  blCheckBoxChecked:false,    // 佣金比例是否选择
}
export default {
  namespace: 'assignAgent',
  state:initState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    changeSelectedRowKeys(state,action){
      return{...state,...action.payload}
    },
    saveCurrentRadio(state,action){
      return{...state,...action.payload}
    },
    saveAgentListTableData(state,action){
      return{...state,...action.payload}
    },
    closeCommissionAmount(state,action){
      return{...state,...action.payload}
    },
    changeModal(state,action){
      return{...state,...action.payload}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    saveResultData(state,action){
			return{...state,loadingShadow: false,...action.payload}
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
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    clearCxInfo(state,action){
      return {...state,jeCheckBoxChecked: false,commissionAmount:0.0,blCheckBoxChecked:false};
    },
    saveCurrentUserType(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *initData({payload},{call,put,select}){
        const {houseBaseInfo} = yield select(({assignAgent})=>assignAgent);
        yield put({
            type:"initUpdate"
        })
    },

    // init  Update
    *initUpdate({payload},{call,put,select}){
        const {houseBaseInfo} = yield select(({assignAgent})=>assignAgent);
        yield put({
            type:"setState",
            payload:{
                assignAgentObj: {},
            }
        })
        yield put({
            type:"setState",
            payload:{
                slectedBrokers: [],
            }
        })

        if (houseBaseInfo['id']) {
            yield put({
              type:"showProcess"
            });
            const params = {};
            params['id'] = houseBaseInfo['id'];
            params.apiName = "/miss-anzhu-secdhouse-resource/broker/findMyBrokbers";
            const responseObj = yield call(requestApi, params);
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if(reObj.isSuccess) {
              const slectedBrokers=[];
                yield put({
                    type:"setState",
                    payload:{
                        assignAgentObj: reObj,
                        defaultRadioValue:reObj.promotionMode==="金额"?"佣金金额":"佣金比例"
                    }
                })
                if(reObj.promotionMode==="比例"){
                  yield put({
                      type:"setState",
                      payload:{
                          currentRadio:"佣金比例",
                          jeCheckBoxChecked:false,
                          blCheckBoxChecked:true,
                      }
                  })
                }else if(reObj.promotionMode==='金额'){
                  yield put({
                      type:"setState",
                      payload:{
                        currentRadio: "佣金金额",
                        jeCheckBoxChecked:true,
                        blCheckBoxChecked:false,
                      }
                  })
                }
                if (reObj.listBrokers.length) {
                  reObj.listBrokers.map((item,index)=>{
                    slectedBrokers.push({
                      key:index+1,
                      cityIds:item.cityIds,
                      areaPath:item.cityNames,
                      gender:item.gender,
                      id:item.id,
                      logo:item.logo,
                      name:item.name,
                      phoneNumber:item.phone,
                      position:item.position,
                      tutorId:item.tutorId,
                      userId:item.userId,
                    })
                  })
                    yield put({
                      type:"setState",
                      payload:{
                        slectedBrokers: slectedBrokers,
                      }
                    })
                }

                //-------------------回选 选择框 start------
                let _openPromotionCheked = false;
                const cooperationPromotion = reObj['cooperationPromotion'];
                if (cooperationPromotion != null && cooperationPromotion == '开启') {
                    _openPromotionCheked = true;
                }
                yield put ({
                  type:"setState",
                  payload:{
                      openPromotionCheked:_openPromotionCheked,
                  }
                });

                // 促销方式
                const _promotionMode = reObj['promotionMode'];
                if (_promotionMode != null) {
                    if (_promotionMode == '金额') {
                        yield put ({
                          type:"setState",
                          payload:{
                              jeCheckBoxChecked:true,
                          }
                        });
                    }else if (_promotionMode == '比例') {
                        yield put ({
                          type:"setState",
                          payload:{
                              blCheckBoxChecked:true,
                          }
                        });
                    }
                }

                //-------------------回选 选择框 end------
                yield put({
                  type:"hideProcess"
                });
            }else {
                yield put({
                  type:'showPrompt',
                  payload:{
                    title:'失败!',
                    description:`${reObj.msg}`
                }});
            }
        }

        const params = {groups:typeGroups};
        params.apiName = "/miss-anzhu-operation/labels/findGroup";
        const labelsResponseObj = yield call(requestApi, params);
        var reObj = analysisUtil.analysisDataResponse(labelsResponseObj);
        if(reObj.isSuccess) {
            const labels = commonUtil.ansyslabelsData(reObj.content);
            yield put({
              type:'saveResultData',
              payload:{
                labels:labels
              }
            });
            const houseFyhxOptions = labels[labelsFinalCode.labelSecondHouseFyhx];
            if (houseFyhxOptions) {
              yield put({
                type:'saveResultData',
                payload:{
                  houseFyhxOptions:houseFyhxOptions,
                }
              });
            }
        }else {
            yield put({
              type:'showPrompt',
              payload:{
                description:`${reObj.msg}`
              }
            });
        }
    },

    *addSelectBroker({payload},{call,put,select}){
        if(payload['slectedBrokers']){
            // 已有的数据\
            const slectedBrokers=[];
            // const {slectedBrokers} = yield select(({assignAgent})=>assignAgent);
            const _tempSelectobj = {};
            // if (slectedBrokers != null && slectedBrokers.length > 0) {
            //     slectedBrokers.map((item, index)=>{
            //         _tempSelectobj[item['id']] = item['id'];
            //     });
            // }
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

    *submitData({payload},{call,put,select}){
        const _assignAgentState = yield select(({assignAgent})=>assignAgent);
        const {houseBaseInfo} = _assignAgentState;    // 房源信息
        const {slectedBrokers} = _assignAgentState;   // 选择的经纪人信息
        var submitObj = {};
        let tradingCommissions = payload['tradingCommissions'];   // 销售佣金
        tradingCommissions = parseFloat(tradingCommissions).toFixed(2);
        if (isNaN(tradingCommissions) || tradingCommissions <= 0) {
            message.error('请输入房源销售总金额')
            return;
        }
        submitObj['tradingCommissions'] = tradingCommissions;

        const {openPromotionCheked} = _assignAgentState;    //  开启合作促销
        let cooperationPromotion = "关闭";
        if (openPromotionCheked) {
            cooperationPromotion = "开启";

            const {jeCheckBoxChecked} = _assignAgentState;    // 开启金额
            if(jeCheckBoxChecked) {
                  submitObj['promotionMode'] = '金额';
                  let commissionAmount = payload['commissionAmount'];             // 佣金金额
                  commissionAmount = parseFloat(commissionAmount).toFixed(2);
                  if (isNaN(commissionAmount) || commissionAmount < 0) {
                    message.error('请输入佣金金额');
                    return;
                  }
                  submitObj['commissionAmount'] = commissionAmount;
            }else {
                const {blCheckBoxChecked} = _assignAgentState;                // 比例
                if(blCheckBoxChecked) {
                    submitObj['promotionMode'] = '比例';
                    let commissionRate = payload['commissionRate'];             // 佣金比例
                    if (isNaN(commissionRate) || commissionRate < 0||commissionRate==='') {
                      message.error('请输入佣金比例');
                      return;
                    }
                }else {
                    message.error('请选择促销方式');
                    return;
                }
            }
        }
        if (slectedBrokers == null || slectedBrokers.length <= 0) {
            // message.error('请指派经纪人');
            // return;
        }
        yield put({
          type:"showProcess"
        });
        submitObj['cooperationPromotion'] = cooperationPromotion;
        submitObj['houseId'] = houseBaseInfo['id'];
        submitObj['currentIsBroker'] = '否';

        let listBrokers = [];
        if (slectedBrokers != null && slectedBrokers.length > 0) {
            slectedBrokers.map((item, index)=>{
                listBrokers.push(item.id);
            })
        }
        submitObj.commissionRate=payload.commissionRate;
        submitObj['listBrokers'] = listBrokers;
        submitObj.apiName = "/miss-anzhu-secdhouse-resource/broker/addImproveInformation";
        const responseObj = yield call(requestApi, submitObj);
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess){
          // message.info('保存成功');
          // 关闭
          yield put({
            type:"hideProcess"
          });
          houseBaseInfo.assignAgentInfos = submitObj;
          yield put({
            type:"setState",
            payload:{
                houseBaseInfo:houseBaseInfo
            }
          });
          yield put({
            type:'togglePrompt',
            payload:{
              title:'',
              todo:"backlist",
              visible:true,
              description:'保存成功'
          }});
          yield put({
            type:"sendMessage",
            payload:{
              id:submitObj['houseId']
            }
          })
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              title:'失败!',
              description:`${reObj.msg}`
          }});
        }
    },

    *sendMessage({payload},{call,put}){
      payload.apiName="/miss-anzhu-secdhouse-resource/main/releaseSuccess";
      const responseObj = yield call(requestApi, payload);
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){

      }else{
        yield put({
          type:'showPrompt',
          payload:{
            title:'失败!',
            description:`${reObj.msg}`
        }});
      }
    },

    *backlist({payload},{call,put,select}){
        const _assignAgentState = yield select(({assignAgent})=>assignAgent);
        const {houseBaseInfo} = _assignAgentState;    // 房源信息
        var {resourcesType} = houseBaseInfo;
        var {saleWay} = houseBaseInfo;
        // console.log("commonFinalCode",commonFinalCode);
        if (resourcesType == commonFinalCode.senondHouseResourcesType_zz) {
            // 住宅
            if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
                // 出售
                yield put (routerRedux.push({
                  pathname:'/houseResourceSaleManagement/secondHandHouseSell',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
                // 出租
                yield put (routerRedux.push({
                  pathname:'/houseResourceRentManagement/secondHandHouseRent',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }
        }else if (resourcesType == commonFinalCode.senondHouseResourcesType_sp) {
            // 商铺
            if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
                // 出售
                yield put (routerRedux.push({
                  pathname:'/houseResourceSaleManagement/shopsSell',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
                // 出租
                yield put (routerRedux.push({
                  pathname:'/houseResourceRentManagement/shopsRent',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }
        }else if (resourcesType == commonFinalCode.senondHouseResourcesType_xzl) {
            // 写字楼
            if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
                // 出售
                yield put (routerRedux.push({
                  pathname:'/houseResourceSaleManagement/officeSell',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
                // 出租
                yield put (routerRedux.push({
                  pathname:'/houseResourceRentManagement/officeRent',
                  state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                      houseBaseInfo:houseBaseInfo
                  }
                }))
            }
        }
    },

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
    },
    //------------------------------------------effects end-------------------
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/assignAgent') {
             dispatch({
               type:"setDefaultState"
             });
               let _houseBaseInfo = {};
               if (location.state) {
                  _houseBaseInfo = location.state.houseBaseInfo;
               }
               dispatch({
                 type:'setState',
                 payload:{
                   houseBaseInfo:_houseBaseInfo,
                 }
               });

               dispatch({
                 type:'initData',
                 payload:{

                 }
               });
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
