import { requestApi }
  from '../../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';
/***************************************************************/
/**************************************************************/
/**********  二手房出售：已发布，未指派经纪人、已下架、已售 *******/
/*************************************************************/
/*************************************************************/
let interval = null;
// 加载标签信息
const typeGroups = [
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelSecondHouseFyhx,    // 房源户型
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelSecondHouseFyjs,    // 户型居室
  },
];

const initState = {
  tudiGongVisible: false,
  pwd: null,
  area: null,
  selectedRowRecord: [],//选中项
  selectedRowKeys: [],//选中keys
  isBroker: null,
  activeKey: 'unassignedAgent',   // Tabs当前值
  loadingShadow: false,
  tableLoading: false,           // table loading状态
  freshList: false,
  currentPage: 1,                // 当前页
  total: null,                   // 当前页总条数
  eopOptions: [],                // 区域信息
  labels: {},                    // 标签信息
  houseFyhxOptions: [],          // 二手房房源户型
  promptObj: {
    visible: false,
    description: '',
    title: '',
    promptFor: 'default',
    okText: '确定',
    type: '',
    todo: '',
  },
  publishedHousePage: {       // 已发布房源Page
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  pausePage: {
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  unassignedAgentPage: {      // 未指派经济人Page
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  removedPage: {              // 已下架Page
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  soldPage: {               // 已售Page
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  cooperationPage: {               // 合作速销Page
    pageNo: 1,
    total: 0,
    pageSize: commonFinalCode.pageSize,
    content: [],
  },
  entrustModal: {//委托弹窗
    visible: false,
    required: false,
  },
  houseStateModal: {//委托弹窗
    visible: false,
    required: false,
  },
  optionss: {},
  record: {},//缓存当前行数据
}
export default {
  namespace: 'mentorSecondHandHouseSell',
  state: initState,
  reducers: { //action
    setDefaultState(state, action) {
      return lodash.cloneDeep(initState);
    },
    saveCurrentKey(state, action) {
      return { ...state, ...action.payload }
    },
    saveSelectedRowKeys(state, action) {
      return { ...state, ...action.payload }
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
    saveResultData(state, action) {
      return { ...state, tableLoading: false, loadingShadow: false, ...action.payload }
    },
    showPrompt(state, action) {
      return {
        ...state, tableLoading: false, loadingShadow: false,
        promptObj: Object.assign({}, state.promptObj, { ...{ type: "error", title: "", visible: true, todo: "closeModal" } },
          { ...action.payload })
      }
    },
    togglePrompt(state, action) {
      return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },
    showProcess(state, action) {
      return { ...state, loadingShadow: true };
    },
    hideProcess(state, action) {
      return { ...state, loadingShadow: false };
    },
    hiddleTableLoading(state, action) {
      return { ...state, tableLoading: false }
    },
    showTableLoading(state, action) {
      return { ...state, tableLoading: true }
    },
    saveUserType(state, action) {
      return { ...state, ...action.payload }
    },
    saveSearchArea(state, action) {
      return { ...state, ...action.payload }
    },
    changeVisible(state, action) {
      return { ...state, ...action.payload }
    },
    saveTudigongPass(state, action) {
      return { ...state, ...action.payload }
    },
  },
  subscriptions: {     //路由监听
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell') {
          dispatch({
            type: "setDefaultState"
          })
          interval = setInterval(() => {  //每秒去获取用户信息 获取之后清空定时器
            dispatch({
              type: "getIsBroker"
            })
          }, 1000);
          dispatch({
            type: 'getUnassignedAgentList',
            payload: {
              pageSize: commonFinalCode.pageSize,
              pageNo: 0,
              houseState: "已发布",
              resourcesType: "住宅",
              saleWay: "出售",
              isCurrentUser: '是',
              //isCooperationSale:'开启',
              //  hasBroker:"是",
            }
          });
          dispatch({
            type: 'getEopOptions',
          });
          dispatch({
            type: 'getCasOpt'
          })
        }
      });
    },
  },

  effects: {
    //分享房源
    *sharHouse({ payload }, { call, put }) {
      yield put({
        type: "changeVisible",
        payload: {
          tudiGongVisible: false
        }
      })
      const uploadData = {};
      const ids = [];
      payload.selectedRowRecord.map((item, index) => {
        ids.push(item.id)
      })
      uploadData.ids = ids;
      uploadData.apiName = "/miss-anzhu-secdhouse-resource/todgo/synchronize"
      const responseObj = yield call(requestApi, { ...uploadData });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        reObj.urls.map(item => {
          window.open(item.url)
        })
        yield put({
          type: "saveSelectedRowKeys",
          payload: {
            selectedRowKeys: [],
          }
        })
        yield put({
          type: 'showPrompt',
          payload: {
            description: `分享房源成功!`
          }
        });
      } else {
        if (reObj.msg === '土地公用户密码与您输入的密码不一致,请填入正确的密码后再同步房源') {
          yield put({
            type: 'togglePrompt',
            payload: {
              type: 'error',
              title: '失败!',
              description: `${reObj.msg}点击确定之后请先输入密码!`,
              visible: true,
              todo: "closeModalAndWritePass"
            }
          })
        } else {
          yield put({
            type: 'showPrompt',
            payload: {
              description: `${reObj.msg}`
            }
          });
        }
      }
    },
    /** 获取用户类型 ***/
    *getIsBroker({ payload }, { call, put, select }) {
      const isBroker = yield select(({ main }) => main.isBroker);
      if (isBroker) {
        clearInterval(interval)
        yield put({
          type: "saveUserType",
          payload: { isBroker: isBroker }
        })
      } else if (isBroker === false) {
        clearInterval(interval)
        yield put({
          type: "saveUserType",
          payload: { isBroker: isBroker }
        })
      }
    },
    /**  加载已发布房源列表 */
    *getPublishedHouseList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      payload.isCooperationSale = "关闭";
      //payload.hasBroker="是";
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            publishedHousePage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /**  未指派经纪人列表 */
    *getUnassignedAgentList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            unassignedAgentPage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /**  一下架列表 */
    *getRemovedAgentList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            removedPage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /**  已售列表 */
    *getSoldList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            soldPage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /*合作速销列表*/
    *getCooperationList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      //payload.hasBroker="是";
      payload.houseState = "已发布";
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            cooperationPage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    /*暂缓列表*/
    *getPauseList({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      //payload.hasBroker="是";
      payload.houseState = "暂缓";
      payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
      const responseObj = yield call(requestApi, { ...payload });
      const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "saveResultData",
          payload: {
            pausePage: reObj,
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /*删除房源*/
    *deleteHouse({ payload }, { call, put }) {
      yield put({
        type: 'showProcess',
      });
      const params = {};
      params['id'] = payload['id'];
      params.apiName = commonFinalCode.deleteSencondHouseApiName;
      const responseObj = yield call(requestApi, params);
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: 'hideProcess',
        })
        message.info(commonFinalCode.deleteSuccess_msg);
        yield put({
          type: "loadList",
          payload: {
            isReFresh: false,
          }
        })
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    *loadList({ payload }, { put, call, select }) {
      const { isReFresh } = payload;
      var pageNo = 0;
      var pageSize = commonFinalCode.pageSize;
      var typeName = "";
      var pageObj = null;

      const mentorSecondHandHouseSell = yield select(({ mentorSecondHandHouseSell }) => mentorSecondHandHouseSell);
      const { activeKey } = mentorSecondHandHouseSell;

      if (activeKey === 'publishedHouse') {
        typeName = 'getPublishedHouseList';
        const { publishedHousePage } = mentorSecondHandHouseSell;
        pageObj = publishedHousePage;
      } else if (activeKey === 'unassignedAgent') {
        typeName = 'getUnassignedAgentList';
        const { unassignedAgentPage } = mentorSecondHandHouseSell;
        pageObj = unassignedAgentPage;
      } else if (activeKey === 'removed') {
        typeName = 'getRemovedAgentList';
        const { removedPage } = mentorSecondHandHouseSell;
        pageObj = removedPage;
      } else if (activeKey === 'sold') {
        typeName = 'getSoldList';
        const { soldPage } = mentorSecondHandHouseSell;
        pageObj = soldPage;
      } else if (activeKey === 'cooperation') {
        typeName = 'getCooperationList';
        const { cooperationPage } = mentorSecondHandHouseSell;
        pageObj = cooperationPage;
      } else if (activeKey === 'pause') {
        typeName = 'getPauseList';
        const { pausePage } = mentorSecondHandHouseSell;
        pageObj = pausePage;
      }

      if (pageObj != null) {
        pageSize = pageObj.pageSize;
        if (isReFresh) {

        } else {
          pageNo = pageObj.pageNo;
        }
      }
      if (activeKey === 'cooperation') {  //合作速销
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            isCooperationSale: "开启",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      } else if (activeKey === 'publishedHouse') { //已发布房源
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            houseState: "已发布",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      } else if (activeKey === 'unassignedAgent') {  //未指派经纪人
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            //hasBroker:"否",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      } else if (activeKey === 'removed') {  //已下架房源
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            houseState: "已下架",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      } else if (activeKey === 'sold') {//已售房源
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            houseState: "已售",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      } else if (activeKey === 'pause') {//已售房源
        yield put({
          type: typeName,
          payload: {
            pageNo: pageNo,
            pageSize: pageSize,
            houseState: "暂缓",
            resourcesType: "住宅",
            saleWay: "出售",
            isCurrentUser: '是',
            fullPath: payload.area,
            keyword: payload.resourcesNumber,
            houseRoom: payload.houseRoom,
          }
        })
      }
    },
    // 加载区域信息
    *getEopOptions({ payload }, { put, call }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-operation/service-regions/findAllProvinces",
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const eopData = commonUtil.createEopData(reObj.content);
        yield put({
          type: 'saveResultData',
          payload: {
            eopOptions: eopData
          }
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
      const params = { groups: typeGroups };
      params.apiName = "/miss-anzhu-operation/labels/findGroup";
      const labelsResponseObj = yield call(requestApi, params);
      const reObje = analysisUtil.analysisDataResponse(labelsResponseObj);
      if (reObje.isSuccess) {
        const labels = commonUtil.ansyslabelsData(reObje.content);
        yield put({
          type: 'saveResultData',
          payload: {
            labels: labels
          }
        });
        const houseFyhxOptions = labels[labelsFinalCode.labelSecondHouseFyjs];
        if (houseFyhxOptions) {
          yield put({
            type: 'saveResultData',
            payload: {
              houseFyhxOptions: houseFyhxOptions,
            }
          });
        }
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObje.msg}`
          }
        });
      }

    },
    *getCasOpt({ payload }, { call, put, select }) {//委托联动项
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findTeamAndBroker",
      });
      const isBroker = yield select(({ main }) => main.isBroker);

      const { data } = responseObj

      yield put({
        type: 'saveResultData',
        payload: {
          optionss: data.data,
          userTypes: isBroker
        }
      });

    },
    *entrust({ payload }, { put, call, select }) {
      const currentState = yield select(({ mentorSecondHandHouseSell }) => mentorSecondHandHouseSell);
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-secdhouse-resource/main/UpdateHouseBailor",
        houseId: currentState.record.id,
        brokerId: payload.brokerId
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "setState",
          payload: {
            entrustModal: {
              visible: false,
              required: false,
            }
          }
        });
        if (currentState.activeKey === "unassignedAgent") {
          yield put({
            type: "getUnassignedAgentList",
            payload: {
              pageNo: currentState.unassignedAgentPage.pageNo,
              pageSize: currentState.unassignedAgentPage.pageSize,
              //hasBroker:"否",
              resourcesType: "住宅",
              saleWay: "出售",
              isCurrentUser: '是',
              fullPath: currentState.area,
              keyword: currentState.resourcesNumber,
              houseRoom: currentState.houseRoom,
            }
          });
        } else if (currentState.activeKey === "pause") {
          yield put({
            type: "getPauseList",
            payload: {
              pageNo: currentState.pausePage.pageNo,
              pageSize: currentState.pausePage.pageSize,
              //hasBroker:"否",
              resourcesType: "住宅",
              saleWay: "出售",
              isCurrentUser: '是',
              fullPath: currentState.area,
              keyword: currentState.resourcesNumber,
              houseRoom: currentState.houseRoom,
            }
          });
        }
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    *houseStateSet({ payload }, { put, call, select }) {
      const currentState = yield select(({ mentorSecondHandHouseSell }) => mentorSecondHandHouseSell);
      console.log(currentState);
      const responseObj = yield call(requestApi, {
        apiName: "miss-anzhu-secdhouse-resource/main/UpdateHouseState",
        houseId: currentState.record.id,
        state: payload.state
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put({
          type: "setState",
          payload: {
            houseStateModal: {
              visible: false,
              required: false,
            }
          }
        });
        if (currentState.activeKey === "unassignedAgent") {
          yield put({
            type: "getUnassignedAgentList",
            payload: {
              pageNo: currentState.unassignedAgentPage.pageNo,
              pageSize: currentState.unassignedAgentPage.pageSize,
              //hasBroker:"否",
              resourcesType: "住宅",
              saleWay: "出售",
              isCurrentUser: '是',
              fullPath: currentState.area,
              keyword: currentState.resourcesNumber,
              houseRoom: currentState.houseRoom,
            }
          });
        } else if (currentState.activeKey === "pause") {
          yield put({
            type: "getPauseList",
            payload: {
              pageNo: currentState.pausePage.pageNo,
              pageSize: currentState.pausePage.pageSize,
              //hasBroker:"否",
              resourcesType: "住宅",
              saleWay: "出售",
              isCurrentUser: '是',
              fullPath: currentState.area,
              keyword: currentState.resourcesNumber,
              houseRoom: currentState.houseRoom,
            }
          });
        }
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    }

    //*************************************effects end
  }
}
