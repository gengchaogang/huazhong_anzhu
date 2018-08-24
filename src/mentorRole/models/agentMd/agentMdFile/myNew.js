// import { routerRedux } from 'dva/router';
// import {message} from 'antd'
// import {requestApi}
// from '../../../services/common'
// import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
// import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
// import commonUtil from '../../../../commons/utils/commonUtil.js';
// import finalCode from '../../../../commons/utils/commonFinalCode.js';
// import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
// import lodash from 'lodash';
// const initState={
//   editVisible:false
// }
// export default {
//   namespace:'myNew',
//   state:initState,
//   subscriptions: {},
//   effects:{
//     *goSta({payload},{call,put,select}){
//       yield put({
//         type:"setState",
//         payload:{
//           editVisible:true
//
//         }
//       })
//     }
//
//   },
//   reducers: {
//
//     setState(state,{payload}){
// 			return {...state,...payload};
// 		},
//
//   },
//
// }


import {requestApi} from '../../../services/common.js';
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import { routerRedux } from 'dva/router';
import {message} from 'antd'
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';


/***************************************************************/
/**************************************************************/
/**********  写字楼出租：已发布，未指派经纪人、已下架、已售 *******/
/*************************************************************/
/*************************************************************/
let interval=null;
export default {
  namespace: 'myNew',
  state: {  //state
    tudiGongVisible:false,
    pwd:null,
    selectedRowRecord:[],//选中项
    selectedRowKeys:[],//选中keys
    isBroker:null,
    activeKey:'unassignedAgent',   //Tabs当前值
    tableLoading:false,           //table loading状态
    loadingShadow:false,
    eopOptions:[],                // 区域信息
    labels:{},                    // 标签信息
    area:null,
    promptObj:{
  		 visible:false,
  		 description:'',
  		 title:'',
  		 promptFor:'default',
  		 okText:'确定',
  		 type:'',
  		 todo:'',
  	},
    publishedHousePage: {       // 已发布房源Page
  		pageNo:1,
  		total:0,
  		pageSize:commonFinalCode.pageSize,
  		content:[],
  	},
    unassignedAgentPage: {      // 未指派经济人Page
  		pageNo:1,
  		total:0,
  		pageSize:commonFinalCode.pageSize,
  		content:[],
  	},
    removedPage: {              // 已下架Page
  		pageNo:1,
  		total:0,
  		pageSize:commonFinalCode.pageSize,
  		content:[],
  	},
    soldPage: {               // 已售Page
  		pageNo:1,
  		total:0,
  		pageSize:commonFinalCode.pageSize,
  		content:[],
  	},
    cooperationPage: {               // 合作速销Page
      pageNo:1,
      total:0,
      pageSize:commonFinalCode.pageSize,
      content:[],
    },
  },
  reducers: { //action
    saveSearchArea(state,action){
      return{...state,...action.payload}
    },
    saveCurrentKey(state,action){
      return{...state,...action.payload}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    saveResultData(state,action){
			return{...state,tableLoading:false,loadingShadow: false,...action.payload}
		},
    showProcess(state,action) {
			return {...state,loadingShadow: true};
		},
		hideProcess(state,action) {
			return {...state,loadingShadow: false};
		},
    showPrompt(state,action) {
			return{...state, tableLoading:false,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    saveSelectedRowKeys(state,action){
      return{...state,...action.payload}
    },
    saveUserType(state,action){
      return{...state,...action.payload}
    },
    changeVisible(state,action){
      return{...state,...action.payload}
    },
    saveTudigongPass(state,action){
      return{...state,...action.payload}
    },
  },
  subscriptions:{ //路由监听
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/agentmd/agentMd') {
            interval = setInterval(() => {  //每秒去获取用户信息 获取之后清空定时器
              dispatch({
                type:"getIsBroker"
              })
            }, 1000);
            dispatch({
              type: 'getUnassignedAgentList',
              payload: {
                pageSize:commonFinalCode.pageSize,
                pageNo:0,
                houseState:"已发布",
                resourcesType:"写字楼",
                saleWay:"出租",
                isCurrentUser:'是',
          //      hasBroker:'是',
          //      isCooperationSale:'开启',
              }
            });

            dispatch({
              type: 'getEopOptions',
            });
          }
        });
      },
	},
  effects:{ //发起异步请求
    *sharHouse({payload},{call,put}){
      yield put({
        type:"changeVisible",
        payload:{
          tudiGongVisible:false
        }
      })
      const uploadData={};
      const ids=[];
      payload.selectedRowRecord.map((item,index)=>{
        ids.push(item.id)
      })
      uploadData.ids=ids;
      uploadData.apiName="/miss-anzhu-secdhouse-resource/todgo/synchronize"
      const responseObj = yield call(requestApi,{...uploadData});
      var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if(reObj.isSuccess){
        reObj.urls.map(item=>{
          window.open(item.url)
        })
        yield put({
          type:"saveSelectedRowKeys",
          payload:{
            selectedRowKeys:[],
          }
        })
        yield put({
          type:'showPrompt',
          payload:{
            description:`分享房源成功!`
        }});
      }else{
        if(reObj.msg==='土地公用户密码与您输入的密码不一致,请填入正确的密码后再同步房源'){
          yield put({
            type:'togglePrompt',
            payload:{
              type:'error',
              title:'失败!',
              description:`${reObj.msg}点击确定之后请先输入密码!`,
              visible:true,
              todo:"closeModalAndWritePass"
            }
          })
        }else{
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
      }
    },

    *getIsBroker({payload},{call,put,select}){
      const isBroker=yield select(({main})=>main.isBroker);
      if(isBroker){
        clearInterval(interval)
        yield put({
          type:"saveUserType",
          payload:{isBroker:isBroker}
        })
      }else if(isBroker===false){
        clearInterval(interval)
        yield put({
          type:"saveUserType",
          payload:{isBroker:isBroker}
        })
      }
    },

    /**  加载已发布房源列表 */
    *getPublishedHouseList({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        payload.isCooperationSale="关闭";
    //    payload.hasBroker="是";
        payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
        const responseObj = yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
        if (reObj.isSuccess) {
            yield put({
              type:"saveResultData",
              payload:{
                publishedHousePage:reObj,
              }
            });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
    },


    /**  未指派经纪人列表 */
    *getUnassignedAgentList({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        payload.apiName = "/miss-anzhu-tutor/tutors/broker/findTeamByNameAndArea";
        const responseObj = yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
        console.log(reObj)
        if (reObj.isSuccess) {
            yield put({
              type:"saveResultData",
              payload:{
                unassignedAgentPage:reObj,
              }
            });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
    },


    /**  已下架列表 */
    *getRemovedAgentList({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
        const responseObj = yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
        if (reObj.isSuccess) {
            yield put({
              type:"saveResultData",
              payload:{
                removedPage:reObj,
              }
            });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
    },


    /**  已售列表 */
    *getSoldList({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
        const responseObj = yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
        if (reObj.isSuccess) {
            yield put({
              type:"saveResultData",
              payload:{
                soldPage:reObj,
              }
            });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
    },
    /*合作速销列表*/
    *getCooperationList({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        payload.hasBroker="是";
        payload.houseState="已发布";
        payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
        const responseObj = yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
        if (reObj.isSuccess) {
            yield put({
              type:"saveResultData",
              payload:{
                cooperationPage:reObj,
              }
            });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
          }});
        }
    },

    //加载区域信息
    // 加载区域信息
    *getEopOptions({ payload }, { put, call }) {
      yield put({
        type: 'showProcess',
      });
      const responseObj = yield call(requestApi, {
        apiName: commonFinalCode.findAllAreasApiName,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const eopData = commonUtil.createEopData(reObj.content);
        yield put({
          type: 'saveResultData',
          payload: {
            eopOptions: eopData
          }
        });
        yield put({
          type: 'hideProcess',
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }

      // 查询标签

    },

    *deleteHouse({payload},{call,put}){
        yield put ({
          type:'showProcess',
        });
        const params = {};
        params['teamId'] = payload['id'];
        params.apiName = '/miss-anzhu-tutor/tutors/broker/deleteTutorTeam';
        const responseObj = yield call(requestApi, params);
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess) {
            yield put ({
              type:'hideProcess',
            })
            message.info(commonFinalCode.deleteSuccess_msg);
            yield put ({
              type:"loadList",
              payload:{
                isReFresh:false,
              }
            })
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
            }
          });
        }
    },

    *loadList({payload},{put,call,select}){
        const {isReFresh} = payload;
        var pageNo = 0;
        var pageSize = commonFinalCode.pageSize;
        var typeName = "";
        var pageObj = null;

        const myNew = yield select(({myNew})=>myNew);
        const {activeKey} = myNew;

        if(activeKey === 'publishedHouse'){
            typeName = 'getPublishedHouseList';
            const {publishedHousePage} = myNew;
            pageObj = publishedHousePage;
        }else if(activeKey === 'unassignedAgent'){
          typeName = 'getUnassignedAgentList';
          const {unassignedAgentPage} = myNew;
          pageObj = unassignedAgentPage;
        }else if(activeKey === 'removed'){
          typeName = 'getRemovedAgentList';
          const {removedPage} = myNew;
          pageObj = removedPage;
        }else if(activeKey === 'sold'){
          typeName = 'getSoldList';
          const {soldPage} = myNew;
          pageObj = soldPage;
        }else if(activeKey === 'cooperation'){
          typeName = 'getCooperationList';
          const {cooperationPage} = myNew;
          pageObj = cooperationPage;
        }

        if (pageObj != null) {
            pageSize = pageObj.pageSize;
            if (isReFresh) {

            }else {
              pageNo = pageObj.pageNo;
            }
        }
        if(activeKey==='cooperation'){  //合作速销
          yield put ({
            type: typeName,
            payload:{
              pageNo: pageNo,
              pageSize: pageSize,
              isCooperationSale:"开启",
              resourcesType:"写字楼",
              saleWay:"出租",
              isCurrentUser:'是',
              fullPath:payload.area,
              keyword:payload.resourcesNumber,
            }
          })
        }else if(activeKey==='publishedHouse'){ //已发布房源
          yield put ({
            type: typeName,
            payload:{
              pageNo: pageNo,
              pageSize: pageSize,
              houseState:"已发布",
              resourcesType:"写字楼",
              saleWay:"出租",
              isCurrentUser:'是',
              fullPath:payload.area,
              keyword:payload.resourcesNumber,
            }
          })
        }else if(activeKey==='unassignedAgent'){  //未指派经纪人
          yield put ({
            type: typeName,
            payload:{
              pageNo: pageNo,
              pageSize: pageSize,
      //        hasBroker:"否",
              resourcesType:"写字楼",
              saleWay:"出租",
              isCurrentUser:'是',
              fullPath:payload.area,
              keyword:payload.resourcesNumber,
            }
          })
        }else if(activeKey==='removed'){  //已下架房源
          yield put ({
            type: typeName,
            payload:{
              pageNo: pageNo,
              pageSize: pageSize,
              houseState:"已下架",
              resourcesType:"写字楼",
              saleWay:"出租",
              isCurrentUser:'是',
              fullPath:payload.area,
              keyword:payload.resourcesNumber,
            }
          })
        }else if(activeKey==='sold'){//已售房源
          yield put ({
            type: typeName,
            payload:{
              pageNo: pageNo,
              pageSize: pageSize,
              houseState:"已售",
              resourcesType:"写字楼",
              saleWay:"出租",
              isCurrentUser:'是',
              fullPath:payload.area,
              keyword:payload.resourcesNumber,
            }
          })
        }
    },

    //*************************************effects end
  }
}
